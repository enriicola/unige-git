import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import { Op } from 'sequelize';
import { SubmissionStatus } from '#root/models/enum/enums.js';

const submissionStatusRank = {
  [SubmissionStatus.WRONG]: 0,
  [SubmissionStatus.IMPROVABLE]: 1,
  [SubmissionStatus.PROBABLY_CORRECT]: 2,
};

const getStatusRank = (status) => submissionStatusRank[status] ?? 0;

const pickLatest = (a, b) => {
  if (!a) return b;
  if (!b) return a;
  const aTime = new Date(a.updatedAt).getTime();
  const bTime = new Date(b.updatedAt).getTime();
  if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
    return b.id > a.id ? b : a;
  }
  return bTime >= aTime ? b : a;
};

export const computeFinalSubmissionForMatch = async ({
  matchId,
  transaction,
}) => {
  const submissions = await Submission.findAll({
    where: { matchId },
    transaction,
    lock: transaction?.LOCK?.UPDATE,
  });

  if (!submissions.length) return null;

  let manual = null;
  let automatic = null;
  submissions.forEach((submission) => {
    if (submission.isAutomaticSubmission) {
      automatic = pickLatest(automatic, submission);
    } else {
      manual = pickLatest(manual, submission);
    }
  });

  let winner = null;
  if (manual && automatic) {
    const manualRank = getStatusRank(manual.status);
    const autoRank = getStatusRank(automatic.status);
    if (autoRank > manualRank) {
      winner = automatic;
    } else {
      winner = manual;
    }
  } else if (manual) {
    winner = manual;
  } else if (automatic) {
    winner = automatic;
  }

  await Submission.update(
    { isFinal: false },
    { where: { matchId }, transaction }
  );

  if (winner) {
    await Submission.update(
      { isFinal: true },
      { where: { id: winner.id }, transaction }
    );
  }

  return winner;
};

export const finalizeMissingSubmissionsForChallenge = async ({
  challengeId,
  transaction,
}) => {
  if (!challengeId) return [];

  const matches = await Match.findAll({
    attributes: ['id', 'challengeParticipantId'],
    include: [
      {
        model: ChallengeMatchSetting,
        as: 'challengeMatchSetting',
        attributes: ['challengeId'],
        where: { challengeId },
      },
    ],
    transaction,
  });

  if (!matches.length) return [];

  const matchIds = matches.map((matchRow) => matchRow.id);
  const submissions = await Submission.findAll({
    attributes: ['matchId', 'isFinal'],
    where: { matchId: { [Op.in]: matchIds } },
    transaction,
    raw: true,
  });

  const matchHasSubmission = new Set();
  const matchHasFinal = new Set();
  submissions.forEach((row) => {
    matchHasSubmission.add(row.matchId);
    if (row.isFinal) {
      matchHasFinal.add(row.matchId);
    }
  });

  const finalizedMatches = [];

  for (const matchRow of matches) {
    const matchId = matchRow.id;
    if (!matchHasSubmission.has(matchId)) {
      const created = await Submission.create(
        {
          matchId,
          challengeParticipantId: matchRow.challengeParticipantId,
          code: '',
          status: SubmissionStatus.WRONG,
          isAutomaticSubmission: true,
          isFinal: true,
          publicTestResults: JSON.stringify([]),
          privateTestResults: JSON.stringify([]),
        },
        { transaction }
      );
      finalizedMatches.push({
        matchId,
        submissionId: created.id,
      });
      continue;
    }

    if (!matchHasFinal.has(matchId)) {
      const winner = await computeFinalSubmissionForMatch({
        matchId,
        transaction,
      });
      if (winner) {
        finalizedMatches.push({
          matchId,
          submissionId: winner.id,
        });
      }
    }
  }

  return finalizedMatches;
};
