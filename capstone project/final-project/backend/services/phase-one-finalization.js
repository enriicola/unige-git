import Challenge from '#root/models/challenge.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';
import { broadcastEvent } from '#root/services/event-stream.js';
import { finalizeMissingSubmissionsForChallenge } from '#root/services/submission-finalization.js';
import logger from '#root/services/logger.js';

export const PHASE_ONE_AUTOSUBMIT_GRACE_MS =
  process.env.NODE_ENV === 'test' ? 0 : 20 * 1000;

const inFlightSubmissionsByChallengeId = new Map();
const completionTimersByChallengeId = new Map();

const scheduleCompletionRecheck = (challengeId, delayMs) => {
  if (!challengeId || delayMs <= 0) return;
  if (completionTimersByChallengeId.has(challengeId)) return;

  const timeoutId = setTimeout(() => {
    completionTimersByChallengeId.delete(challengeId);
    maybeCompletePhaseOneFinalization({ challengeId }).catch((error) => {
      logger.error(
        'Coding phase finalization: delayed completion check failed',
        {
          challengeId,
          error: error?.message || String(error),
        }
      );
    });
  }, delayMs);

  completionTimersByChallengeId.set(challengeId, timeoutId);
};

const clearCompletionRecheck = (challengeId) => {
  const timeoutId = completionTimersByChallengeId.get(challengeId);
  if (!timeoutId) return;
  clearTimeout(timeoutId);
  completionTimersByChallengeId.delete(challengeId);
};

const normalizeChallengeId = (challengeId) => {
  const numericId = Number(challengeId);
  if (!Number.isInteger(numericId) || numericId < 1) return null;
  return numericId;
};

export const markSubmissionInFlight = (challengeId) => {
  const normalized = normalizeChallengeId(challengeId);
  if (!normalized) return;
  const current = inFlightSubmissionsByChallengeId.get(normalized) || 0;
  inFlightSubmissionsByChallengeId.set(normalized, current + 1);
};

export const unmarkSubmissionInFlight = async (challengeId) => {
  const normalized = normalizeChallengeId(challengeId);
  if (!normalized) return;
  const current = inFlightSubmissionsByChallengeId.get(normalized) || 0;
  const next = Math.max(0, current - 1);
  if (next === 0) {
    inFlightSubmissionsByChallengeId.delete(normalized);
  } else {
    inFlightSubmissionsByChallengeId.set(normalized, next);
  }

  // If the coding phase has ended, we may now be able to mark finalization completed.
  await maybeCompletePhaseOneFinalization({ challengeId: normalized });
};

export const getInFlightSubmissionsCount = (challengeId) => {
  const normalized = normalizeChallengeId(challengeId);
  if (!normalized) return 0;
  return inFlightSubmissionsByChallengeId.get(normalized) || 0;
};

export const maybeCompletePhaseOneFinalization = async ({ challengeId }) => {
  const normalized = normalizeChallengeId(challengeId);
  if (!normalized) return { status: 'invalid_challenge_id' };

  const inFlight = getInFlightSubmissionsCount(normalized);
  if (inFlight > 0) {
    return { status: 'pending_in_flight', inFlight };
  }

  const challenge = await Challenge.findByPk(normalized, {
    attributes: [
      'id',
      'status',
      'endPhaseOneDateTime',
      'phaseOneFinalizationCompletedAt',
    ],
  });

  if (!challenge) return { status: 'challenge_not_found' };
  if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) {
    return { status: 'not_in_phase_one_end', statusValue: challenge.status };
  }
  if (challenge.phaseOneFinalizationCompletedAt) {
    return {
      status: 'already_completed',
      completedAt: challenge.phaseOneFinalizationCompletedAt,
    };
  }

  const endMs = challenge.endPhaseOneDateTime
    ? new Date(challenge.endPhaseOneDateTime).getTime()
    : null;
  if (endMs !== null && !Number.isNaN(endMs)) {
    const elapsedMs = Date.now() - endMs;
    const remainingMs = PHASE_ONE_AUTOSUBMIT_GRACE_MS - elapsedMs;
    if (remainingMs > 0) {
      scheduleCompletionRecheck(normalized, remainingMs);
      return { status: 'within_grace_period', remainingMs };
    }
  }

  try {
    await finalizeMissingSubmissionsForChallenge({ challengeId: normalized });
  } catch (error) {
    logger.error(
      'Coding phase finalization: finalize missing submissions failed',
      {
        challengeId: normalized,
        error: error?.message || String(error),
      }
    );
  }

  const completedAt = new Date();
  const [updatedCount, updatedRows] = await Challenge.update(
    { phaseOneFinalizationCompletedAt: completedAt },
    {
      where: {
        id: normalized,
        status: ChallengeStatus.ENDED_PHASE_ONE,
        phaseOneFinalizationCompletedAt: null,
      },
      returning: true,
    }
  );

  if (updatedCount > 0) {
    clearCompletionRecheck(normalized);
    const updatedChallenge = updatedRows?.[0] || null;
    broadcastEvent({
      event: 'challenge-updated',
      data: {
        challengeId: normalized,
        status: updatedChallenge?.status || ChallengeStatus.ENDED_PHASE_ONE,
        phaseOneFinalizationCompletedAt: completedAt,
      },
    });

    return { status: 'completed', completedAt };
  }

  return { status: 'not_updated' };
};
