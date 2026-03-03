import sequelize from '#root/services/sequelize.js';
import Challenge from '#root/models/challenge.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import MatchSetting from '#root/models/match-setting.js';
import User from '#root/models/user.js';
import { getChallengeParticipants } from '#root/services/challenge-participant.js';

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default async function assignMatches({
  challengeId,
  overwrite = false,
}) {
  // 1) Verify challenge exists
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) return { status: 'challenge_not_found' };
  const now = new Date();
  if (challenge.startDatetime && now < new Date(challenge.startDatetime))
    return { status: 'too_early' };

  // 2) Load selected match settings via ChallengeMatchSetting
  const cmsList = await ChallengeMatchSetting.findAll({
    where: { challengeId },
    include: [{ model: MatchSetting, as: 'matchSetting' }],
    order: [['id', 'ASC']],
  });
  if (!cmsList.length) return { status: 'no_match_settings' };

  // 3) Load joined participants
  const participantsResult = await getChallengeParticipants({ challengeId });

  if (participantsResult.status !== 'ok') {
    return { status: participantsResult.status };
  }
  const participants = participantsResult.participants;

  // 4) Detect existing assignments
  const participantIds = participants.map((p) => p.id);
  const existing = await Match.count({
    where: { challengeParticipantId: participantIds },
  });
  if (existing > 0 && !overwrite) return { status: 'already_assigned' };

  const transaction = await sequelize.transaction();
  try {
    if (existing > 0 && overwrite) {
      // Clear previous matches related to this challenge
      await Match.destroy({
        where: { challengeParticipantId: participantIds },
        transaction,
      });
    }

    // 5) Random distribution (round-robin across settings)
    const shuffled = shuffle([...participants]);
    const matchRows = [];
    let idx = 0;
    for (const participant of shuffled) {
      const cms = cmsList[idx % cmsList.length];
      matchRows.push({
        challengeMatchSettingId: cms.id,
        challengeParticipantId: participant.id,
      });
      idx += 1;
    }

    await Match.bulkCreate(matchRows, { transaction });

    // if the "status" column of that challenge is public, then change the "status" column to "assigned" in challenge table
    if (
      challenge.status === 'public' ||
      (challenge.status === 'assigned' && overwrite)
    )
      await challenge.update({ status: 'assigned' }, { transaction });

    // 6) Load grouped result to return
    const allMatches = await Match.findAll({
      where: { challengeParticipantId: participantIds },
      include: [
        {
          model: ChallengeMatchSetting,
          as: 'challengeMatchSetting',
          include: [{ model: MatchSetting, as: 'matchSetting' }],
        },
        {
          model: ChallengeParticipant,
          as: 'challengeParticipant',
          include: [{ model: User, as: 'student' }],
        },
      ],
      transaction,
    });

    const grouped = {};
    for (const m of allMatches) {
      const cmsId = m.challengeMatchSettingId;
      if (!grouped[cmsId]) {
        grouped[cmsId] = {
          challengeMatchSettingId: cmsId,
          matchSetting: m.challengeMatchSetting?.matchSetting
            ? {
                id: m.challengeMatchSetting.matchSetting.id,
                problemTitle: m.challengeMatchSetting.matchSetting.problemTitle,
              }
            : null,
          matches: [],
        };
      }
      grouped[cmsId].matches.push({
        id: m.id,
        challengeParticipantId: m.challengeParticipantId,
        student: m.challengeParticipant?.student
          ? {
              id: m.challengeParticipant.student.id,
              username: m.challengeParticipant.student.username,
            }
          : null,
      });
    }

    await transaction.commit();
    return { status: 'ok', assignments: Object.values(grouped) };
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
