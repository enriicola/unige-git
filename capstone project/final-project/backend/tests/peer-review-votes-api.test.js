import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import User from '#root/models/user.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';

const createReviewVotesScenario = async () => {
  const suffix = Date.now();
  const matchSetting = await MatchSetting.create({
    problemTitle: `Vote Breakdown ${suffix}`,
    problemDescription: 'Test problem',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [{ input: [1], output: 1 }],
    privateTests: [{ input: [2], output: 2 }],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Vote Breakdown Challenge ${suffix}`,
    duration: 30,
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.ENDED_PHASE_TWO,
    startDatetime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endDatetime: new Date(Date.now() - 30 * 60 * 1000),
    startPhaseTwoDateTime: new Date(Date.now() - 90 * 60 * 1000),
    endPhaseTwoDateTime: new Date(Date.now() - 30 * 60 * 1000),
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const reviewer = await User.create({
    username: `reviewer_${suffix}`,
    password: 'password123',
    email: `reviewer_${suffix}@mail.com`,
    role: 'student',
  });
  const revieweeCorrect = await User.create({
    username: `reviewee_ok_${suffix}`,
    password: 'password123',
    email: `reviewee_ok_${suffix}@mail.com`,
    role: 'student',
  });
  const revieweeIncorrect = await User.create({
    username: `reviewee_bad_${suffix}`,
    password: 'password123',
    email: `reviewee_bad_${suffix}@mail.com`,
    role: 'student',
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewer.id,
  });
  const revieweeCorrectParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: revieweeCorrect.id,
  });
  const revieweeIncorrectParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: revieweeIncorrect.id,
  });

  const matchCorrect = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: revieweeCorrectParticipant.id,
  });
  const matchIncorrect = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: revieweeIncorrectParticipant.id,
  });

  const submissionCorrect = await Submission.create({
    matchId: matchCorrect.id,
    challengeParticipantId: revieweeCorrectParticipant.id,
    code: 'int main() { return 0; }',
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal: true,
  });
  const submissionIncorrect = await Submission.create({
    matchId: matchIncorrect.id,
    challengeParticipantId: revieweeIncorrectParticipant.id,
    code: 'int main() { return 1; }',
    status: SubmissionStatus.IMPROVABLE,
    isFinal: true,
  });

  const assignmentCorrect = await PeerReviewAssignment.create({
    reviewerId: reviewerParticipant.id,
    submissionId: submissionCorrect.id,
  });
  const assignmentIncorrect = await PeerReviewAssignment.create({
    reviewerId: reviewerParticipant.id,
    submissionId: submissionIncorrect.id,
  });

  await PeerReviewVote.create({
    peerReviewAssignmentId: assignmentCorrect.id,
    vote: VoteType.CORRECT,
  });
  await PeerReviewVote.create({
    peerReviewAssignmentId: assignmentIncorrect.id,
    vote: VoteType.INCORRECT,
    testCaseInput: '[3]',
    expectedOutput: '[4]',
    isVoteCorrect: true,
    isExpectedOutputCorrect: true,
    isBugProven: true,
  });

  return { challenge, reviewer };
};

describe('Peer review votes breakdown API', () => {
  it('returns expected evaluation and correctness for each vote', async () => {
    const { challenge, reviewer } = await createReviewVotesScenario();

    const agent = request.agent(app);
    const loginRes = await agent.post('/api/login').send({
      email: reviewer.email,
      password: 'password123',
    });
    expect(loginRes.status).toBe(200);

    const res = await agent.get(
      `/api/rest/challenges/${challenge.id}/peer-reviews/votes`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.votes)).toBe(true);
    expect(res.body.votes).toHaveLength(2);

    const correctVote = res.body.votes.find(
      (vote) => vote.vote === VoteType.CORRECT
    );
    const incorrectVote = res.body.votes.find(
      (vote) => vote.vote === VoteType.INCORRECT
    );

    expect(correctVote).toBeDefined();
    expect(correctVote.expectedEvaluation).toBe('correct');
    expect(correctVote.isCorrect).toBe(true);
    expect(correctVote.reviewedSubmission).toBeDefined();

    expect(incorrectVote).toBeDefined();
    expect(incorrectVote.expectedEvaluation).toBe('incorrect');
    expect(incorrectVote.isCorrect).toBe(true);
    expect(incorrectVote.reviewedSubmission).toBeDefined();
  });
});
