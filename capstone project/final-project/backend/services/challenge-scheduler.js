import Challenge from '#root/models/challenge.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';
import { broadcastEvent } from '#root/services/event-stream.js';
import finalizePeerReviewChallenge from '#root/services/finalize-peer-review.js';
import { calculateChallengeScores } from '#root/services/scoring-service.js';
import SubmissionScoreBreakdown from '#root/models/submission-score-breakdown.js';
import { finalizeMissingSubmissionsForChallenge } from '#root/services/submission-finalization.js';
import { maybeCompletePhaseOneFinalization } from '#root/services/phase-one-finalization.js';

const phaseOneTimers = new Map();
const phaseTwoTimers = new Map();

const clearPhaseOneTimer = (challengeId) => {
  const timer = phaseOneTimers.get(challengeId);
  if (timer) clearTimeout(timer);
  phaseOneTimers.delete(challengeId);
};

const computePhaseOneEndMs = (challenge) => {
  if (challenge.endPhaseOneDateTime) {
    const explicit = new Date(challenge.endPhaseOneDateTime).getTime();
    return Number.isNaN(explicit) ? null : explicit;
  }
  const startMs = new Date(challenge.startPhaseOneDateTime).getTime();
  if (Number.isNaN(startMs)) return null;
  return startMs + Number(challenge.duration || 0) * 60 * 1000 + 5000;
};

const computePhaseTwoEndMs = (challenge) => {
  if (challenge.endPhaseTwoDateTime) {
    const explicit = new Date(challenge.endPhaseTwoDateTime).getTime();
    return Number.isNaN(explicit) ? null : explicit;
  }
  const startMs = new Date(challenge.startPhaseTwoDateTime).getTime();
  if (Number.isNaN(startMs)) return null;
  return startMs + Number(challenge.durationPeerReview || 0) * 60 * 1000 + 5000;
};

const markPhaseOneEnded = async (challengeId) => {
  clearPhaseOneTimer(challengeId);
  const [updatedCount, updatedRows] = await Challenge.update(
    {
      status: ChallengeStatus.ENDED_PHASE_ONE,
      endPhaseOneDateTime: new Date(),
      phaseOneFinalizationCompletedAt: null,
    },
    {
      where: {
        id: challengeId,
        status: ChallengeStatus.STARTED_PHASE_ONE,
      },
      returning: true,
    }
  );

  if (updatedCount > 0) {
    const updatedChallenge = updatedRows?.[0];
    try {
      const finalizedMatches = await finalizeMissingSubmissionsForChallenge({
        challengeId: updatedChallenge.id,
      });
      finalizedMatches.forEach((finalized) => {
        broadcastEvent({
          event: 'finalization-updated',
          data: {
            challengeId: updatedChallenge.id,
            matchId: finalized.matchId,
          },
        });
      });
    } catch (error) {
      console.error(
        `Error finalizing submissions for challenge ${updatedChallenge.id}:`,
        error
      );
    }
    broadcastEvent({
      event: 'challenge-updated',
      data: {
        challengeId: updatedChallenge.id,
        status: updatedChallenge.status,
      },
    });

    try {
      await maybeCompletePhaseOneFinalization({
        challengeId: updatedChallenge.id,
      });
    } catch (error) {
      console.error(
        `Error completing coding phase finalization for challenge ${updatedChallenge.id}:`,
        error
      );
    }
  }
};

const clearPhaseTwoTimer = (challengeId) => {
  const timer = phaseTwoTimers.get(challengeId);
  if (timer) clearTimeout(timer);
  phaseTwoTimers.delete(challengeId);
};

const markPhaseTwoEnded = async (challengeId) => {
  clearPhaseTwoTimer(challengeId);
  const challenge = await Challenge.findByPk(challengeId);

  if (!challenge || challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
    return;
  }

  // 1. Finalize Peer Review
  const result = await finalizePeerReviewChallenge({ challengeId });

  if (result.status === 'ok' && result.challenge) {
    // Notify "Pending"
    broadcastEvent({
      event: 'challenge-updated',
      data: {
        challengeId: result.challenge.id,
        status: result.challenge.status,
        scoringStatus: 'pending',
      },
    });

    try {
      // 2. Set COMPUTING status
      await Challenge.update(
        { scoringStatus: 'computing' },
        { where: { id: challengeId } }
      );

      broadcastEvent({
        event: 'challenge-updated',
        data: {
          challengeId: result.challenge.id,
          status: result.challenge.status,
          scoringStatus: 'computing',
        },
      });

      // ----------------------------------------------------------------
      // 3. CALCULATION AND SAVING (RT-215)
      // ----------------------------------------------------------------

      // Calculate scores in memory
      const scores = await calculateChallengeScores(challengeId);

      if (scores && scores.length > 0) {
        await Promise.all(
          scores.map(async (scoreItem) => {
            if (scoreItem.challengeParticipantId) {
              const [breakdown, created] =
                await SubmissionScoreBreakdown.findOrCreate({
                  where: {
                    challengeParticipantId: scoreItem.challengeParticipantId,
                  },
                  defaults: {
                    submissionId: scoreItem.submissionId || null,
                    codeReviewScore: scoreItem.codeReviewScore,
                    implementationScore: scoreItem.implementationScore || 0,
                    totalScore: scoreItem.totalScore || 0,
                  },
                });

              if (!created) {
                await breakdown.update({
                  submissionId:
                    scoreItem.submissionId || breakdown.submissionId,
                  codeReviewScore: scoreItem.codeReviewScore,
                  implementationScore: scoreItem.implementationScore || 0,
                  totalScore: scoreItem.totalScore || 0,
                });
              }
            }
          })
        );
      }
      // ----------------------------------------------------------------

      // 4. COMPLETED
      await Challenge.update(
        { scoringStatus: 'completed' },
        { where: { id: challengeId } }
      );

      broadcastEvent({
        event: 'challenge-updated',
        data: {
          challengeId: result.challenge.id,
          status: result.challenge.status,
          scoringStatus: 'completed',
        },
      });
    } catch (error) {
      console.error(
        `Error computing scores for challenge ${challengeId}:`,
        error
      );
    }
  }
};

export const schedulePhaseOneEndForChallenge = async (challenge) => {
  if (!challenge || challenge.status !== ChallengeStatus.STARTED_PHASE_ONE)
    return;

  const endMs = computePhaseOneEndMs(challenge);
  if (!endMs) return;

  const delay = Math.max(0, endMs - Date.now());
  clearPhaseOneTimer(challenge.id);

  if (delay === 0) {
    await markPhaseOneEnded(challenge.id);
    return;
  }

  const timer = setTimeout(() => {
    markPhaseOneEnded(challenge.id);
  }, delay);
  phaseOneTimers.set(challenge.id, timer);
};

export const schedulePhaseTwoEndForChallenge = async (challenge) => {
  if (!challenge || challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
    return;
  }

  const endMs = computePhaseTwoEndMs(challenge);
  if (!endMs) return;

  const delay = Math.max(0, endMs - Date.now());
  clearPhaseTwoTimer(challenge.id);

  if (delay === 0) {
    await markPhaseTwoEnded(challenge.id);
    return;
  }

  const timer = setTimeout(() => {
    markPhaseTwoEnded(challenge.id);
  }, delay);
  phaseTwoTimers.set(challenge.id, timer);
};

export const scheduleActivePhaseOneChallenges = async () => {
  const activeChallenges = await Challenge.findAll({
    where: { status: ChallengeStatus.STARTED_PHASE_ONE },
  });
  await Promise.all(
    activeChallenges.map((challenge) =>
      schedulePhaseOneEndForChallenge(challenge)
    )
  );
};

export const scheduleActivePhaseTwoChallenges = async () => {
  const activeChallenges = await Challenge.findAll({
    where: { status: ChallengeStatus.STARTED_PHASE_TWO },
  });
  await Promise.all(
    activeChallenges.map((challenge) =>
      schedulePhaseTwoEndForChallenge(challenge)
    )
  );
};
