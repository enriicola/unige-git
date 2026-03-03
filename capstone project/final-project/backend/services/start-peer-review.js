import { Op } from 'sequelize';
import Challenge from '#root/models/challenge.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import { ChallengeStatus, SubmissionStatus } from '#root/models/enum/enums.js';
import {
  getInFlightSubmissionsCount,
  maybeCompletePhaseOneFinalization,
} from '#root/services/phase-one-finalization.js';

export default async function startPeerReview({ challengeId }) {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) return { status: 'challenge_not_found' };

  if (challenge.status === ChallengeStatus.STARTED_PHASE_TWO) {
    return { status: 'already_started' };
  }

  if (challenge.status !== ChallengeStatus.ENDED_PHASE_ONE) {
    return { status: 'invalid_status', challengeStatus: challenge.status };
  }

  const inFlightSubmissionsCount = getInFlightSubmissionsCount(challengeId);
  if (inFlightSubmissionsCount > 0) {
    return { status: 'finalization_pending', inFlightSubmissionsCount };
  }

  if (!challenge.phaseOneFinalizationCompletedAt) {
    await maybeCompletePhaseOneFinalization({ challengeId });
    await challenge.reload();
  }

  if (!challenge.phaseOneFinalizationCompletedAt) {
    return { status: 'finalization_pending', inFlightSubmissionsCount: 0 };
  }

  const matches = await Match.findAll({
    attributes: ['id', 'challengeMatchSettingId'],
    include: [
      {
        model: ChallengeMatchSetting,
        as: 'challengeMatchSetting',
        attributes: ['id'],
        where: { challengeId },
      },
    ],
  });

  if (!matches.length) return { status: 'no_matches' };

  const matchIds = matches.map((matchRow) => matchRow.id);
  const matchSettingByMatchId = new Map(
    matches.map((matchRow) => [matchRow.id, matchRow.challengeMatchSettingId])
  );

  const validSubmissions = await Submission.findAll({
    attributes: ['id', 'matchId'],
    where: {
      matchId: { [Op.in]: matchIds },
      isFinal: true,
      status: {
        [Op.in]: [
          SubmissionStatus.IMPROVABLE,
          SubmissionStatus.PROBABLY_CORRECT,
        ],
      },
    },
    raw: true,
  });

  if (validSubmissions.length <= 1) {
    return { status: 'insufficient_valid_submissions' };
  }

  const validSubmissionsByCms = {};
  const submissionIds = [];
  validSubmissions.forEach((submission) => {
    const cmsId = matchSettingByMatchId.get(submission.matchId);
    if (!cmsId) return;
    submissionIds.push(submission.id);
    validSubmissionsByCms[cmsId] = (validSubmissionsByCms[cmsId] || 0) + 1;
  });

  const eligibleGroupIds = Object.entries(validSubmissionsByCms)
    .filter(([, count]) => count > 1)
    .map(([cmsId]) => Number(cmsId));

  if (eligibleGroupIds.length === 0) {
    return { status: 'insufficient_valid_submissions' };
  }

  const assignments = await PeerReviewAssignment.findAll({
    where: { submissionId: { [Op.in]: submissionIds } },
    include: [{ model: Submission, as: 'submission', attributes: ['matchId'] }],
  });

  const assignmentsByCms = {};
  assignments.forEach((assignment) => {
    const cmsId = matchSettingByMatchId.get(assignment.submission?.matchId);
    if (!cmsId) return;
    assignmentsByCms[cmsId] = (assignmentsByCms[cmsId] || 0) + 1;
  });

  const hasAssignmentsForAll = eligibleGroupIds.every(
    (cmsId) => (assignmentsByCms[cmsId] || 0) > 0
  );

  if (!hasAssignmentsForAll) {
    return { status: 'no_assignments' };
  }

  const startedAt = new Date();
  const endPhaseTwoDateTime = new Date(
    startedAt.getTime() + (challenge.durationPeerReview || 0) * 60 * 1000 + 5000
  );
  await challenge.update({
    status: ChallengeStatus.STARTED_PHASE_TWO,
    startPhaseTwoDateTime: startedAt,
    endPhaseTwoDateTime,
  });

  return { status: 'ok', challenge };
}
