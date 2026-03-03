import Challenge from '#root/models/challenge.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';
import { getChallengeParticipants } from '#root/services/challenge-participant.js';

export default async function startChallenge({ challengeId }) {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    return { status: 'challenge_not_found' };
  }

  if (
    challenge.status !== ChallengeStatus.ASSIGNED &&
    challenge.status !== ChallengeStatus.STARTED_PHASE_ONE
  ) {
    return {
      status: 'invalid_status',
      challengeStatus: challenge.status,
    };
  }

  const now = new Date();
  if (challenge.startDatetime && now < new Date(challenge.startDatetime)) {
    return { status: 'too_early' };
  }

  const participantsResult = await getChallengeParticipants({ challengeId });

  if (participantsResult.status !== 'ok') {
    return { status: 'participants_error' };
  }

  const participants = participantsResult.participants || [];
  if (participants.length === 0) {
    return { status: 'no_participants' };
  }

  const matchesCount = await Match.count({
    include: [
      {
        model: ChallengeMatchSetting,
        as: 'challengeMatchSetting',
        where: { challengeId },
      },
    ],
  });

  if (matchesCount === 0) {
    return { status: 'no_matches' };
  }

  if (challenge.status === ChallengeStatus.STARTED_PHASE_ONE) {
    return { status: 'already_started' };
  }

  const startedAt = new Date();

  const endPhaseOneDateTime = new Date(
    startedAt.getTime() + (challenge.duration || 0) * 60 * 1000 + 5000
  );
  await challenge.update({
    status: ChallengeStatus.STARTED_PHASE_ONE,
    startPhaseOneDateTime: startedAt,
    endPhaseOneDateTime,
    phaseOneFinalizationCompletedAt: null,
  });

  return {
    status: 'ok',
    challenge,
  };
}
