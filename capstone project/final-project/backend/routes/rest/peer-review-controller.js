import { Router } from 'express';
import { Op } from 'sequelize';
import { handleException } from '#root/services/error.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import Challenge from '#root/models/challenge.js';
import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import MatchSetting from '#root/models/match-setting.js';
import User from '#root/models/user.js';
import {
  ChallengeStatus,
  VoteType,
  SubmissionStatus,
} from '#root/models/enum/enums.js';
import logger from '#root/services/logger.js';
import * as submitVoteService from '#root/services/peer-review-submit-vote.js';
import {
  runReferenceSolution,
  normalizeOutputForComparison,
} from '#root/services/reference-solution-evaluation.js';
import finalizePeerReviewChallenge from '#root/services/finalize-peer-review.js';

const router = Router();

router.get('/challenges/:challengeId/peer-reviews/votes', async (req, res) => {
  try {
    const { challengeId } = req.params;
    const userId = req.user?.id || req.session?.user?.id;
    if (!challengeId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Challenge ID is required' },
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' },
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: {
        studentId: userId,
        challengeId: challengeId,
      },
    });

    if (!participant) {
      return res.status(403).json({
        success: false,
        error: { message: 'User is not a participant in this challenge' },
      });
    }

    const assignments = await PeerReviewAssignment.findAll({
      where: {
        reviewerId: participant.id,
      },
      include: [
        {
          model: PeerReviewVote,
          as: 'vote',
          required: true,
        },
        {
          model: Submission,
          as: 'submission',
          include: [
            {
              model: ChallengeParticipant,
              as: 'challengeParticipant',
              include: [{ model: User, as: 'student' }],
            },
            {
              model: Match,
              as: 'match',
              include: [
                {
                  model: ChallengeMatchSetting,
                  as: 'challengeMatchSetting',
                  include: [{ model: MatchSetting, as: 'matchSetting' }],
                },
              ],
            },
          ],
        },
      ],
    });

    const votes = [];
    for (const assignment of assignments) {
      const submission = assignment.submission;
      const submissionStatus = submission?.status || null;
      const voteRecord = assignment.vote;
      const revieweeStudent = submission?.challengeParticipant?.student;
      const problemTitle =
        submission?.match?.challengeMatchSetting?.matchSetting?.problemTitle ||
        null;

      let expectedEvaluation = 'unknown';
      if (submissionStatus === SubmissionStatus.PROBABLY_CORRECT) {
        expectedEvaluation = 'correct';
      } else if (
        submissionStatus === SubmissionStatus.IMPROVABLE ||
        submissionStatus === SubmissionStatus.WRONG
      ) {
        expectedEvaluation = 'incorrect';
      }

      let isVoteCorrect =
        typeof voteRecord.isVoteCorrect === 'boolean'
          ? voteRecord.isVoteCorrect
          : null;
      let isExpectedOutputCorrect =
        typeof voteRecord.isExpectedOutputCorrect === 'boolean'
          ? voteRecord.isExpectedOutputCorrect
          : null;
      let referenceOutput = voteRecord.referenceOutput ?? null;
      let needsUpdate = false;

      if (isVoteCorrect === null && submissionStatus) {
        const isSubmissionValid =
          submissionStatus === SubmissionStatus.PROBABLY_CORRECT;
        if (voteRecord.vote === VoteType.CORRECT) {
          isVoteCorrect = isSubmissionValid;
          needsUpdate = true;
        } else if (voteRecord.vote === VoteType.INCORRECT) {
          isVoteCorrect = !isSubmissionValid;
          needsUpdate = true;
        }
      }

      if (
        voteRecord.vote === VoteType.INCORRECT &&
        isExpectedOutputCorrect === null &&
        submission
      ) {
        let matchSetting =
          submission.match?.challengeMatchSetting?.matchSetting;

        if (matchSetting && !matchSetting.referenceSolution) {
          matchSetting = await MatchSetting.findByPk(matchSetting.id);
        }

        if (
          matchSetting?.referenceSolution &&
          voteRecord.testCaseInput &&
          voteRecord.expectedOutput
        ) {
          try {
            const { referenceOutput: computedReferenceOutput } =
              await runReferenceSolution({
                referenceSolution: matchSetting.referenceSolution,
                testCaseInput: voteRecord.testCaseInput,
              });

            referenceOutput = computedReferenceOutput;
            isExpectedOutputCorrect =
              normalizeOutputForComparison(voteRecord.expectedOutput) ===
              normalizeOutputForComparison(referenceOutput);

            needsUpdate = true;
          } catch (evaluationError) {
            logger.error(
              'Error computing expected output correctness',
              evaluationError
            );
          }
        }
      }

      if (needsUpdate) {
        await voteRecord.update({
          isVoteCorrect,
          isExpectedOutputCorrect,
          referenceOutput,
        });
      }

      const isBugProven =
        typeof voteRecord.isBugProven === 'boolean'
          ? voteRecord.isBugProven
          : null;

      let earnedCredit = false;
      if (voteRecord.vote === VoteType.CORRECT) {
        earnedCredit = Boolean(
          typeof isVoteCorrect === 'boolean'
            ? isVoteCorrect
            : submissionStatus === SubmissionStatus.PROBABLY_CORRECT
        );
      } else if (voteRecord.vote === VoteType.INCORRECT) {
        let baseCorrect = false;
        if (typeof isVoteCorrect === 'boolean') {
          baseCorrect = isVoteCorrect;
        } else if (submissionStatus) {
          baseCorrect = submissionStatus !== SubmissionStatus.PROBABLY_CORRECT;
        }

        if (typeof isExpectedOutputCorrect === 'boolean') {
          earnedCredit = baseCorrect && isExpectedOutputCorrect;
        } else if (typeof isBugProven === 'boolean') {
          earnedCredit = baseCorrect && isBugProven;
        } else {
          earnedCredit = baseCorrect;
        }
      }

      votes.push({
        assignmentId: assignment.id,
        submissionId: assignment.submissionId,
        reviewedSubmission: {
          id: assignment.submissionId,
          matchId: submission?.matchId || submission?.match?.id || null,
          student: revieweeStudent
            ? {
                id: revieweeStudent.id,
                username: revieweeStudent.username,
              }
            : null,
          problemTitle,
        },
        vote: voteRecord.vote,
        expectedEvaluation,
        isCorrect: earnedCredit,
        evaluationStatus: voteRecord.evaluationStatus || null,
        isVoteCorrect,
        isExpectedOutputCorrect,
        isBugProven,
        testCaseInput: voteRecord.testCaseInput,
        expectedOutput: voteRecord.expectedOutput,
        referenceOutput,
        actualOutput: voteRecord.actualOutput ?? null,
        earnedCredit,
      });
    }

    return res.json({
      success: true,
      votes,
    });
  } catch (error) {
    logger.error('Get peer review votes error:', error);
    handleException(res, error);
  }
});
router.post('/peer-reviews/:assignmentId/vote', async (req, res) => {
  try {
    const { assignmentId } = req.params;
    const { vote, testCaseInput, expectedOutput } = req.body;

    const userId = req.user?.id || req.session?.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        error: { message: 'User not authenticated' },
      });
    }

    await submitVoteService.submitVote(userId, assignmentId, {
      vote,
      testCaseInput,
      expectedOutput,
    });

    logger.info(`User ${userId} voted ${vote} on assignment ${assignmentId}`);

    return res.json({ success: true });
  } catch (error) {
    if (error.code === 'INVALID_INPUT') {
      return res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    }
    if (error.code === 'INVALID_TEST_CASE') {
      return res
        .status(400)
        .json({ success: false, error: { message: error.message } });
    }
    if (error.code === 'NOT_FOUND') {
      return res
        .status(404)
        .json({ success: false, error: { message: error.message } });
    }
    if (error.code === 'FORBIDDEN') {
      return res
        .status(403)
        .json({ success: false, error: { message: error.message } });
    }

    logger.error('Submit peer review vote error:', error);
    handleException(res, error);
  }
});
router.post('/peer-review/finalize-challenge', async (req, res) => {
  try {
    const { challengeId, allowEarly = false } = req.body;
    if (!challengeId) {
      return res.status(400).json({
        success: false,
        error: 'challengeId is required',
      });
    }

    const result = await finalizePeerReviewChallenge({
      challengeId,
      allowEarly: Boolean(allowEarly),
    });

    if (result.status === 'missing_challenge') {
      return res.status(400).json({
        success: false,
        error: 'challengeId is required',
      });
    }

    if (result.status === 'challenge_not_found') {
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }
    if (result.status === 'peer_review_not_ended') {
      return res.status(400).json({
        success: false,
        error: 'Peer review phase has not ended yet',
      });
    }

    if (result.status === 'no_participants') {
      return res.status(400).json({
        success: false,
        error: 'Peer review cannot be finalized without participants',
      });
    }

    if (result.status === 'update_failed') {
      return res.status(500).json({
        success: false,
        error: 'Unable to finalize challenge',
      });
    }

    const badgeResults = result.badgeResults || [];
    return res.json({
      success: true,
      data: { finalized: true, badgeResults },
    });
  } catch (error) {
    handleException(res, error);
  }
});

router.post('/peer-review/exit', async (req, res) => {
  const t = await PeerReviewVote.sequelize.transaction();

  try {
    const { challengeId, studentId, votes } = req.body;

    if (!challengeId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'challengeId is required',
      });
    }

    if (!studentId) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'studentId is required',
      });
    }

    const challenge = await Challenge.findByPk(challengeId, { transaction: t });

    if (!challenge) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Challenge not found',
      });
    }

    if (challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        error: 'Peer review phase must be active to exit',
      });
    }

    const participant = await ChallengeParticipant.findOne({
      where: {
        challengeId,
        studentId,
      },
      transaction: t,
    });

    if (!participant) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        error: 'Participant not found',
      });
    }

    const assignments = await PeerReviewAssignment.findAll({
      where: { reviewerId: participant.id },
      transaction: t,
    });

    const assignmentIds = assignments.map((a) => a.id);
    const assignmentMap = new Map(assignments.map((a) => [a.submissionId, a]));

    const existingVotes = await PeerReviewVote.findAll({
      where: {
        peerReviewAssignmentId: { [Op.in]: assignmentIds },
      },
      transaction: t,
    });

    const existingVoteMap = new Map(
      existingVotes.map((v) => [v.peerReviewAssignmentId, v])
    );

    let votesSaved = 0;
    let abstainVotesCreated = 0;

    if (Array.isArray(votes) && votes.length > 0) {
      for (const voteData of votes) {
        const { submissionId, vote, testCaseInput, expectedOutput } = voteData;
        const assignment = assignmentMap.get(submissionId);

        if (!assignment) continue;

        const existingVote = existingVoteMap.get(assignment.id);

        const voteType =
          vote === VoteType.CORRECT
            ? VoteType.CORRECT
            : vote === VoteType.INCORRECT
              ? VoteType.INCORRECT
              : VoteType.ABSTAIN;

        const votePayload = {
          vote: voteType,
          testCaseInput: voteType === VoteType.INCORRECT ? testCaseInput : null,
          expectedOutput:
            voteType === VoteType.INCORRECT ? expectedOutput : null,
        };

        if (existingVote) {
          await existingVote.update(votePayload, { transaction: t });
        } else {
          await PeerReviewVote.create(
            {
              peerReviewAssignmentId: assignment.id,
              ...votePayload,
            },
            { transaction: t }
          );
        }
        votesSaved += 1;
      }
    }

    const votedAssignmentIds = new Set();

    if (Array.isArray(votes) && votes.length > 0) {
      votes.forEach((v) => {
        const assignment = assignmentMap.get(v.submissionId);
        if (assignment) {
          votedAssignmentIds.add(assignment.id);
        }
      });
    }

    existingVotes.forEach((v) => {
      votedAssignmentIds.add(v.peerReviewAssignmentId);
    });

    const unvotedAssignments = assignmentIds.filter(
      (id) => !votedAssignmentIds.has(id)
    );

    if (unvotedAssignments.length > 0) {
      const abstainVotes = unvotedAssignments.map((id) => ({
        peerReviewAssignmentId: id,
        vote: VoteType.ABSTAIN,
        testCaseInput: null,
        expectedOutput: null,
      }));

      await PeerReviewVote.bulkCreate(abstainVotes, { transaction: t });
      abstainVotesCreated = abstainVotes.length;
    }

    logger.info(
      `Student ${studentId} exited peer review for challenge ${challengeId}. Votes saved: ${votesSaved}, Abstain votes created: ${abstainVotesCreated}`
    );

    await t.commit();
    return res.json({
      success: true,
      data: {
        votesSaved,
        abstainVotesCreated,
      },
    });
  } catch (error) {
    await t.rollback();
    logger.error('Exit peer review error:', error);
    return handleException(res, error);
  }
});

export default router;
