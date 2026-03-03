import { describe, it, expect, beforeEach, afterEach, beforeAll } from 'vitest';

import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import User from '#root/models/user.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import sequelize from '#root/services/sequelize.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';

const createVotingScenario = async () => {
  const suffix = Date.now() + Math.floor(Math.random() * 1000);

  const matchSetting = await MatchSetting.create({
    problemTitle: `Vote Problem ${suffix}`,
    problemDescription: 'Desc',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [],
    privateTests: [],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Vote Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(),
    endDatetime: new Date(),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.STARTED_PHASE_TWO,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const author = await User.create({
    username: `author_${suffix}`,
    password: 'pw',
    email: `author_${suffix}@mail.com`,
    role: 'student',
  });

  const reviewer = await User.create({
    username: `reviewer_${suffix}`,
    password: 'pw',
    email: `reviewer_${suffix}@mail.com`,
    role: 'student',
  });

  const authorParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: author.id,
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewer.id,
  });

  const match = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: authorParticipant.id,
  });

  const submission = await Submission.create({
    matchId: match.id,
    challengeParticipantId: authorParticipant.id,
    code: 'int main() { return 0; }',
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal: true,
  });

  const assignment = await PeerReviewAssignment.create({
    submissionId: submission.id,
    reviewerId: reviewerParticipant.id,
    isExtra: false,
  });

  return { assignment };
};

describe('PeerReviewVote Model', () => {
  beforeAll(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
  });

  beforeEach(async () => {
    // Pulizia
    await PeerReviewVote.destroy({ where: {} });
    await PeerReviewAssignment.destroy({ where: {} });
    await Submission.destroy({ where: {} });
    await Match.destroy({ where: {} });
    await ChallengeParticipant.destroy({ where: {} });
    await ChallengeMatchSetting.destroy({ where: {} });
    await Challenge.destroy({ where: {} });
    await MatchSetting.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterEach(async () => {
    await PeerReviewVote.destroy({ where: {} });
    await PeerReviewAssignment.destroy({ where: {} });
    await Submission.destroy({ where: {} });
    await Match.destroy({ where: {} });
    await ChallengeParticipant.destroy({ where: {} });
    await ChallengeMatchSetting.destroy({ where: {} });
    await Challenge.destroy({ where: {} });
    await MatchSetting.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('creates a valid CORRECT vote', async () => {
    const { assignment } = await createVotingScenario();
    const vote = await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: VoteType.CORRECT,
    });
    expect(vote.id).toBeDefined();
    expect(vote.vote).toBe(VoteType.CORRECT);
  });

  it('creates a valid INCORRECT vote with valid JSON arrays', async () => {
    const { assignment } = await createVotingScenario();
    const vote = await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: VoteType.INCORRECT,
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '["result"]',
    });
    expect(vote.id).toBeDefined();
    expect(vote.testCaseInput).toBe('[1, 2, 3]');
  });

  it('fails validation if INCORRECT vote is missing inputs', async () => {
    const { assignment } = await createVotingScenario();
    await expect(
      PeerReviewVote.create({
        peerReviewAssignmentId: assignment.id,
        vote: VoteType.INCORRECT,
        testCaseInput: null,
        expectedOutput: '[1]',
      })
    ).rejects.toThrow();
  });

  it('fails validation if inputs are not valid JSON arrays', async () => {
    const { assignment } = await createVotingScenario();
    await expect(
      PeerReviewVote.create({
        peerReviewAssignmentId: assignment.id,
        vote: VoteType.INCORRECT,
        testCaseInput: 'non un array',
        expectedOutput: '[1]',
      })
    ).rejects.toThrow();
  });

  it('enforces unique vote per assignment', async () => {
    const { assignment } = await createVotingScenario();
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: VoteType.CORRECT,
    });
    await expect(
      PeerReviewVote.create({
        peerReviewAssignmentId: assignment.id,
        vote: VoteType.ABSTAIN,
      })
    ).rejects.toThrow();
  });
});
