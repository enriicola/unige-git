import { Op } from 'sequelize';
import Challenge from '#root/models/challenge.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import { VoteType } from '#root/models/enum/enums.js';

export default async function getPeerReviewSummary({ challengeId, studentId }) {
  const challenge = await Challenge.findByPk(challengeId);
  if (!challenge) return { status: 'challenge_not_found' };

  const participant = await ChallengeParticipant.findOne({
    where: { challengeId, studentId },
  });
  if (!participant) return { status: 'participant_not_found' };

  const assignments = await PeerReviewAssignment.findAll({
    where: { reviewerId: participant.id },
    attributes: ['id'],
    raw: true,
  });

  const assignmentIds = assignments.map((a) => a.id);
  const total = assignmentIds.length;

  if (total === 0) {
    return {
      status: 'ok',
      summary: {
        total: 0,
        voted: 0,
        correct: 0,
        incorrect: 0,
        abstain: 0,
        unvoted: 0,
      },
    };
  }

  const votes = await PeerReviewVote.findAll({
    where: { peerReviewAssignmentId: { [Op.in]: assignmentIds } },
    attributes: ['peerReviewAssignmentId', 'vote'],
    raw: true,
  });

  const voteByAssignmentId = new Map(
    votes.map((v) => [v.peerReviewAssignmentId, v.vote])
  );

  let correct = 0;
  let incorrect = 0;
  let abstain = 0;
  let unvoted = 0;

  for (const id of assignmentIds) {
    const v = voteByAssignmentId.get(id);
    if (v === VoteType.CORRECT) correct += 1;
    else if (v === VoteType.INCORRECT) incorrect += 1;
    else if (v === VoteType.ABSTAIN) abstain += 1;
    else unvoted += 1;
  }

  const voted = total - unvoted;

  return {
    status: 'ok',
    summary: { total, voted, correct, incorrect, abstain, unvoted },
  };
}
