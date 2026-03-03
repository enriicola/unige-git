import ChallengeParticipant from '#root/models/challenge-participant.js';
import Challenge from '#root/models/challenge.js';
import User from '#root/models/user.js';

export async function joinChallenge({ studentId, challengeId }) {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) {
    return { status: 'challenge_not_found' };
  }
  if (challenge.status === 'private') {
    return { status: 'challenge_private' };
  }

  const student = await User.findByPk(studentId);
  if (!student) {
    return { status: 'student_not_found' };
  }

  const existing = await ChallengeParticipant.findOne({
    where: { studentId, challengeId },
  });

  if (existing) {
    return { status: 'already_joined' };
  }

  try {
    const participation = await ChallengeParticipant.create({
      studentId,
      challengeId,
    });

    return { status: 'ok', participation };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return { status: 'already_joined' };
    }
    throw error;
  }
}
export async function getChallengeParticipants({ challengeId }) {
  if (!challengeId) {
    return { status: 'error', message: 'Challenge ID is required' };
  }

  try {
    const participants = await ChallengeParticipant.findAll({
      where: { challengeId },
      include: [{ model: User, as: 'student' }],
      order: [['id', 'ASC']],
    });

    if (!participants || participants.length === 0) {
      return { status: 'no_participants' };
    }

    return { status: 'ok', participants };
  } catch (error) {
    console.error('Error fetching challenge participants:', error);
    return { status: 'error', error: error.message };
  }
}
