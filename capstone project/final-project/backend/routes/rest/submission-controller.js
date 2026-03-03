import { Router } from 'express';

import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import MatchSetting from '#root/models/match-setting.js';
import Challenge from '#root/models/challenge.js';

import sequelize from '#root/services/sequelize.js';
import { handleException } from '#root/services/error.js';
import logger from '#root/services/logger.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';
import { validateImportsBlock } from '#root/services/import-validation.js';
import { getSubmissionStatus } from '#root/services/submission-evaluation.js';
import { computeFinalSubmissionForMatch } from '#root/services/submission-finalization.js';
import { broadcastEvent } from '#root/services/event-stream.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';
import {
  PHASE_ONE_AUTOSUBMIT_GRACE_MS,
  markSubmissionInFlight,
  unmarkSubmissionInFlight,
} from '#root/services/phase-one-finalization.js';

const router = Router();

router.post('/submissions', async (req, res) => {
  let transaction;
  let challengeId = null;
  let isInFlightMarked = false;
  try {
    const { matchId, code, language = 'cpp', isAutomatic = false } = req.body;
    const isAutomaticSubmission = Boolean(
      req.body.isAutomaticSubmission ??
      req.body.is_automatic_submission ??
      isAutomatic
    );

    if (!matchId || !code) {
      return res.status(400).json({
        success: false,
        error: { message: 'Missing required fields: matchId and code' },
      });
    }

    if (typeof code !== 'string' || code.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Code cannot be empty' },
      });
    }

    const importValidationError = validateImportsBlock(code, language);
    if (importValidationError)
      return res.status(400).json({
        success: false,
        error: { message: importValidationError },
      });

    const match = await Match.findByPk(matchId, {
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          include: [{ model: MatchSetting, as: 'matchSetting' }],
        },
      ],
    });

    if (!match) {
      return res.status(404).json({
        success: false,
        error: { message: `Match with ID ${matchId} not found` },
      });
    }

    const matchSetting = match.challengeMatchSetting?.matchSetting;
    if (!matchSetting) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match setting not found for this match' },
      });
    }

    challengeId = match.challengeMatchSetting?.challengeId || null;
    if (challengeId) {
      const challenge = await Challenge.findByPk(challengeId, {
        attributes: [
          'id',
          'status',
          'endPhaseOneDateTime',
          'phaseOneFinalizationCompletedAt',
        ],
      });
      if (!challenge) {
        return res.status(404).json({
          success: false,
          error: { message: 'Challenge not found for this match' },
        });
      }

      const isCodingActive =
        challenge.status === ChallengeStatus.STARTED_PHASE_ONE;
      const phaseOneEndedRecently = (() => {
        if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) return false;
        if (!challenge.endPhaseOneDateTime) return false;
        const endMs = new Date(challenge.endPhaseOneDateTime).getTime();
        if (Number.isNaN(endMs)) return false;
        return Date.now() - endMs <= PHASE_ONE_AUTOSUBMIT_GRACE_MS;
      })();
      const isAutoAllowedAfterEnd =
        isAutomaticSubmission &&
        phaseOneEndedRecently &&
        !challenge.phaseOneFinalizationCompletedAt;

      if (!isCodingActive && !isAutoAllowedAfterEnd) {
        return res.status(409).json({
          success: false,
          error: {
            message: 'Submissions are only accepted during the coding phase.',
          },
          currentStatus: challenge.status,
        });
      }
    }

    if (challengeId) {
      markSubmissionInFlight(challengeId);
      isInFlightMarked = true;
    }

    const publicTests = matchSetting.publicTests || [];
    const privateTests = matchSetting.privateTests || [];

    if (!Array.isArray(publicTests) || publicTests.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No public tests found for this match setting' },
      });
    }

    if (!Array.isArray(privateTests) || privateTests.length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'No private tests found for this match setting' },
      });
    }

    // Execute public tests (for compilation check)
    let publicExecutionResult;
    try {
      publicExecutionResult = await executeCodeTests({
        code,
        language,
        testCases: publicTests,
        userId: req.user?.id,
      });
    } catch (error) {
      logger.error('Public tests execution error:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Error while executing public tests' },
      });
    }

    // Execute private tests (for submission evaluation)
    let privateExecutionResult;
    try {
      privateExecutionResult = await executeCodeTests({
        code,
        language,
        testCases: privateTests,
        userId: req.user?.id,
      });
    } catch (error) {
      logger.error('Private tests execution error:', error);
      return res.status(500).json({
        success: false,
        error: { message: 'Error while executing private tests' },
      });
    }

    // Check compilation status
    // If public tests passed, the code definitely compiles (same code, same compilation)
    // Trust public test compilation status - if it compiles for public tests, it compiles for private tests too
    const publicCompiled = publicExecutionResult.isCompiled;

    // Only block submission if public tests show compilation failure
    // If public compiles but private shows false positive, allow submission to proceed
    if (!publicCompiled) {
      logger.warn(
        `Submission blocked: Public tests show compilation failure for match ${matchId}`
      );
      return res.status(400).json({
        success: false,
        error: {
          message:
            'Your code did not compile. Please fix compilation errors before submitting.',
        },
      });
    }

    const submissionStatus = getSubmissionStatus(
      publicExecutionResult,
      privateExecutionResult
    );

    transaction = await sequelize.transaction();
    const submissionFilters = {
      matchId,
      isAutomaticSubmission,
    };
    const existingSubmission = await Submission.findOne({
      where: submissionFilters,
      transaction,
      lock: transaction.LOCK.UPDATE,
    });

    let submission;
    if (existingSubmission) {
      submission = await existingSubmission.update(
        {
          code,
          status: submissionStatus,
          isAutomaticSubmission,
          isFinal: false,
          publicTestResults: JSON.stringify(publicExecutionResult.testResults),
          privateTestResults: JSON.stringify(
            privateExecutionResult.testResults
          ),
        },
        { transaction }
      );
    } else {
      submission = await Submission.create(
        {
          matchId,
          challengeParticipantId: match.challengeParticipantId,
          code,
          status: submissionStatus,
          isAutomaticSubmission,
          isFinal: false,
          publicTestResults: JSON.stringify(publicExecutionResult.testResults),
          privateTestResults: JSON.stringify(
            privateExecutionResult.testResults
          ),
        },
        { transaction }
      );
    }

    const finalSubmission = await computeFinalSubmissionForMatch({
      matchId,
      transaction,
    });

    await transaction.commit();

    logger.info(`Submission ${submission.id} saved for match ${matchId}`);

    if (challengeId) {
      broadcastEvent({
        event: 'finalization-updated',
        data: {
          challengeId,
          matchId,
        },
      });
    }

    const submissionData = submission.get({ plain: true });
    delete submissionData.code;

    return res.json({
      success: true,
      data: {
        submission: {
          id: submissionData.id,
          matchId: submissionData.matchId,
          challengeParticipantId: submissionData.challengeParticipantId,
          createdAt: submissionData.createdAt,
          updatedAt: submissionData.updatedAt,
          status: submissionStatus,
          isAutomaticSubmission,
          isFinal: finalSubmission?.id === submission.id,
        },
        publicTestResults: publicExecutionResult.testResults,
        privateTestResults: privateExecutionResult.testResults,
        isCompiled: privateExecutionResult.isCompiled,
        isPassed: privateExecutionResult.isPassed,
      },
    });
  } catch (error) {
    if (transaction && !transaction.finished) await transaction.rollback();
    logger.error('Submission error:', error);
    handleException(res, error);
  } finally {
    if (challengeId && isInFlightMarked) {
      try {
        await unmarkSubmissionInFlight(challengeId);
      } catch (unmarkError) {
        logger.error('Unable to decrement submission in-flight counter', {
          challengeId,
          error: unmarkError?.message || String(unmarkError),
        });
      }
    }
  }
});

router.get('/submissions/last', async (req, res) => {
  try {
    const matchId = Number(req.query?.matchId);
    if (!matchId) {
      return res.status(400).json({
        success: false,
        error: { message: 'Match ID is required' },
      });
    }

    let submission = await Submission.findOne({
      where: { matchId, isFinal: true },
      order: [
        ['updatedAt', 'DESC'],
        ['id', 'DESC'],
      ],
    });

    if (!submission) {
      submission = await Submission.findOne({
        where: { matchId },
        order: [
          ['updatedAt', 'DESC'],
          ['id', 'DESC'],
        ],
      });
    }

    if (!submission) {
      return res.status(404).json({
        success: false,
        error: { message: 'Submission not found' },
      });
    }

    return res.json({
      success: true,
      data: {
        submission: {
          id: submission.id,
          matchId: submission.matchId,
          code: submission.code,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
          status: submission.status,
          isAutomaticSubmission: submission.isAutomaticSubmission,
          isFinal: submission.isFinal,
          publicTestResults: submission.publicTestResults,
          privateTestResults: submission.privateTestResults,
        },
      },
    });
  } catch (error) {
    logger.error('Get last submission error:', error);
    handleException(res, error);
  }
});

router.get('/submission/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: { message: 'Submission ID must be a number' },
      });
    }

    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({
        success: false,
        error: { message: `Submission with ID ${id} not found` },
      });
    }

    return res.json({
      success: true,
      data: {
        submission: {
          id: submission.id,
          matchId: submission.matchId,
          code: submission.code,
          createdAt: submission.createdAt,
          updatedAt: submission.updatedAt,
          publicTestResults: submission.publicTestResults,
          privateTestResults: submission.privateTestResults,
        },
      },
    });
  } catch (error) {
    logger.error('Get submission error:', error);
    handleException(res, error);
  }
});

export default router;
