import { Op } from 'sequelize';
import Challenge from '#root/models/challenge.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import MatchSetting from '#root/models/match-setting.js';
import {
  ChallengeStatus,
  EvaluationStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';
import {
  normalizeOutputForComparison,
  runReferenceSolution,
} from '#root/services/reference-solution-evaluation.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';
import logger from '#root/services/logger.js';
import {
  awardChallengeMilestoneBadges,
  awardReviewMilestoneBadges,
  awardReviewQualityBadges,
} from '#root/services/challenge-completed-badges.js';
import { broadcastEvent } from '#root/services/event-stream.js';
import { calculateChallengeScores } from '#root/services/scoring-service.js';

const computePeerReviewEndTime = (challenge) => {
  if (!challenge) return null;
  if (challenge.endPhaseTwoDateTime) {
    const explicit = new Date(challenge.endPhaseTwoDateTime).getTime();
    if (!Number.isNaN(explicit)) {
      return new Date(explicit);
    }
  }
  if (!challenge.startPhaseTwoDateTime) return null;
  const startMs = new Date(challenge.startPhaseTwoDateTime).getTime();
  if (Number.isNaN(startMs)) return null;
  return new Date(
    startMs + (challenge.durationPeerReview || 0) * 60 * 1000 + 5000
  );
};

const buildAbstainVotes = (assignmentIds, existingVotes) => {
  const votedAssignmentIds = new Set(
    existingVotes.map((vote) => vote.peerReviewAssignmentId)
  );
  return assignmentIds
    .filter((id) => !votedAssignmentIds.has(id))
    .map((id) => ({
      peerReviewAssignmentId: id,
      vote: 'abstain',
      testCaseInput: null,
      expectedOutput: null,
    }));
};

const loadAssignments = async (reviewerId, challengeId, transaction) =>
  PeerReviewAssignment.findAll({
    where: { reviewerId },
    transaction,
    include: [
      {
        model: Submission,
        as: 'submission',
        required: true,
        include: [
          {
            model: Match,
            as: 'match',
            required: true,
            include: [
              {
                model: ChallengeMatchSetting,
                as: 'challengeMatchSetting',
                required: true,
                where: { challengeId },
                include: [{ model: MatchSetting, as: 'matchSetting' }],
              },
            ],
          },
        ],
      },
    ],
  });

const loadVotes = async (assignmentIds, transaction) =>
  PeerReviewVote.findAll({
    where: { peerReviewAssignmentId: { [Op.in]: assignmentIds } },
    transaction,
  });

export default async function finalizePeerReviewChallenge({
  challengeId,
  allowEarly = false,
} = {}) {
  const transaction = await PeerReviewVote.sequelize.transaction();

  try {
    if (!challengeId) {
      await transaction.rollback();
      return { status: 'missing_challenge' };
    }

    const challenge = await Challenge.findByPk(challengeId, {
      transaction,
    });

    if (!challenge) {
      await transaction.rollback();
      return { status: 'challenge_not_found' };
    }

    const alreadyFinalized =
      challenge.status === ChallengeStatus.ENDED_PHASE_TWO;

    const peerReviewEndTime = computePeerReviewEndTime(challenge);
    if (
      !alreadyFinalized &&
      !allowEarly &&
      peerReviewEndTime &&
      new Date() < peerReviewEndTime
    ) {
      await transaction.rollback();
      return { status: 'peer_review_not_ended' };
    }

    const participants = await ChallengeParticipant.findAll({
      where: { challengeId },
      transaction,
    });

    if (participants.length === 0) {
      await transaction.rollback();
      return { status: 'no_participants' };
    }

    if (!alreadyFinalized) {
      for (const participant of participants) {
        const assignments = await loadAssignments(
          participant.id,
          challengeId,
          transaction
        );
        const assignmentIds = assignments.map((assignment) => assignment.id);
        if (assignmentIds.length === 0) continue;

        const existingVotes = await loadVotes(assignmentIds, transaction);
        const assignmentById = new Map(
          assignments.map((assignment) => [assignment.id, assignment])
        );

        const incorrectVotes = existingVotes.filter(
          (vote) =>
            vote.vote === VoteType.INCORRECT &&
            vote.testCaseInput &&
            vote.expectedOutput
        );

        const correctVotes = existingVotes.filter(
          (vote) => vote.vote === VoteType.CORRECT
        );

        for (const vote of correctVotes) {
          const assignment = assignmentById.get(vote.peerReviewAssignmentId);
          const submissionStatus = assignment?.submission?.status;
          const isVoteCorrect =
            submissionStatus === SubmissionStatus.PROBABLY_CORRECT;

          await PeerReviewVote.update(
            { isVoteCorrect },
            {
              where: { id: vote.id },
              transaction,
            }
          );
        }

        for (const vote of incorrectVotes) {
          const assignment = assignmentById.get(vote.peerReviewAssignmentId);

          const referenceSolution =
            assignment.submission.match.challengeMatchSetting.matchSetting
              .dataValues.referenceSolution;

          if (!referenceSolution) {
            logger.warn('No reference solution found for vote', {
              voteId: vote.id,
            });
            continue;
          }

          try {
            const updatePayload = {};
            const { referenceOutput } = await runReferenceSolution({
              referenceSolution,
              testCaseInput: vote.testCaseInput,
              expectedOutput: vote.expectedOutput,
            });

            if (referenceOutput !== null && referenceOutput !== undefined) {
              const normalizedExpected = normalizeOutputForComparison(
                vote.expectedOutput
              );
              const normalizedReference =
                normalizeOutputForComparison(referenceOutput);

              const isExpectedOutputCorrect =
                normalizedExpected === normalizedReference;

              updatePayload.referenceOutput = referenceOutput;
              updatePayload.isExpectedOutputCorrect = isExpectedOutputCorrect;

              const submissionCode = assignment?.submission?.code;
              if (submissionCode) {
                let submissionResult;
                try {
                  submissionResult = await executeCodeTests({
                    code: submissionCode,
                    language: 'cpp',
                    testCases: [
                      {
                        input: JSON.parse(vote.testCaseInput),
                        output: vote.expectedOutput,
                      },
                    ],
                  });
                } catch {
                  updatePayload.actualOutput = null;
                  updatePayload.isBugProven = false;
                  updatePayload.evaluationStatus = isExpectedOutputCorrect
                    ? EvaluationStatus.RUNTIME_ERROR
                    : EvaluationStatus.INVALID_OUTPUT;
                  await PeerReviewVote.update(updatePayload, {
                    where: { id: vote.id },
                    transaction,
                  });
                  continue;
                }

                const testResult = submissionResult?.testResults?.[0];
                const actualOutput = testResult?.actualOutput;
                updatePayload.actualOutput =
                  normalizeOutputForComparison(actualOutput);

                if (!submissionResult?.isCompiled) {
                  updatePayload.evaluationStatus =
                    EvaluationStatus.COMPILE_ERROR;
                  updatePayload.isBugProven = true;
                } else if (testResult?.exitCode === 124) {
                  updatePayload.evaluationStatus = EvaluationStatus.TIMEOUT;
                  updatePayload.isBugProven = true;
                } else if (testResult?.exitCode !== 0) {
                  updatePayload.evaluationStatus =
                    EvaluationStatus.RUNTIME_ERROR;
                  updatePayload.isBugProven = true;
                } else {
                  const normalizedActual =
                    normalizeOutputForComparison(actualOutput);
                  const normalizedReference =
                    normalizeOutputForComparison(referenceOutput);
                  const isDifferent =
                    normalizedActual !== null &&
                    normalizedReference !== null &&
                    normalizedActual !== normalizedReference;

                  updatePayload.isBugProven = Boolean(isDifferent);
                  updatePayload.evaluationStatus = isDifferent
                    ? EvaluationStatus.BUG_PROVEN
                    : EvaluationStatus.NO_BUG;
                }

                updatePayload.isVoteCorrect =
                  updatePayload.isBugProven &&
                  updatePayload.isExpectedOutputCorrect;
              }

              if (!isExpectedOutputCorrect) {
                updatePayload.evaluationStatus =
                  EvaluationStatus.INVALID_OUTPUT;
              }
            }

            await PeerReviewVote.update(updatePayload, {
              where: { id: vote.id },
              transaction,
            });
          } catch (error) {
            logger.error('Finalize peer review: reference solution failed', {
              voteId: vote.id,
              assignmentId: vote.peerReviewAssignmentId,
              error: error?.message || String(error),
            });
          }
        }

        const abstainVotes = buildAbstainVotes(assignmentIds, existingVotes);
        if (abstainVotes.length > 0) {
          await PeerReviewVote.bulkCreate(abstainVotes, { transaction });
        }
      }
    }

    let updatedChallenge = challenge;
    let updatedCount = 0;
    if (!alreadyFinalized) {
      const endPhaseTwoDateTime = new Date();
      const result = await Challenge.update(
        {
          status: ChallengeStatus.ENDED_PHASE_TWO,
          endPhaseTwoDateTime,
        },
        {
          where: { id: challengeId },
          transaction,
          returning: true,
        }
      );
      updatedCount = result?.[0] ?? 0;
      updatedChallenge = result?.[1]?.[0] || challenge;
    }
    await transaction.commit();

    const badgeResults = [];
    for (const participant of participants) {
      const { newlyUnlocked: challengeBadges, completedChallenges } =
        await awardChallengeMilestoneBadges(participant.studentId);
      const { newlyUnlocked: reviewMilestoneBadges } =
        await awardReviewMilestoneBadges(participant.studentId);
      const { newlyUnlocked: reviewQualityBadges } =
        await awardReviewQualityBadges(participant.studentId);
      const newlyUnlocked = [
        ...challengeBadges,
        ...reviewMilestoneBadges,
        ...reviewQualityBadges,
      ];
      if (newlyUnlocked.length > 0) {
        badgeResults.push({
          studentId: participant.studentId,
          newlyUnlocked,
          completedChallenges,
        });
      }
    }

    if (updatedChallenge.scoringStatus !== 'completed') {
      try {
        await Challenge.update(
          { scoringStatus: 'computing' },
          { where: { id: challengeId } }
        );

        broadcastEvent({
          event: 'challenge-updated',
          data: {
            challengeId,
            status: ChallengeStatus.ENDED_PHASE_TWO,
            scoringStatus: 'computing',
          },
        });

        await calculateChallengeScores(challengeId);

        await Challenge.update(
          { scoringStatus: 'completed' },
          { where: { id: challengeId } }
        );

        broadcastEvent({
          event: 'challenge-updated',
          data: {
            challengeId,
            status: ChallengeStatus.ENDED_PHASE_TWO,
            scoringStatus: 'completed',
          },
        });
      } catch (scoreError) {
        logger.error('Finalize challenge scoring failed', {
          challengeId,
          error: scoreError?.message || String(scoreError),
        });
      }
    }

    let status = 'update_failed';
    if (alreadyFinalized) {
      status = 'already_finalized';
    } else if (updatedCount > 0) {
      status = 'ok';
    }

    return {
      status,
      challenge: updatedChallenge,
      badgeResults,
    };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
