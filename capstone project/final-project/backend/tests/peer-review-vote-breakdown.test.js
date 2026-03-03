import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import User from '#root/models/user.js';
import Challenge from '#root/models/challenge.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import MatchSetting from '#root/models/match-setting.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';
import sequelize from '#root/services/sequelize.js';

describe('Peer Review Vote Breakdown API', () => {
  let student,
    challenge,
    participant,
    matchSetting,
    cms,
    match,
    submission,
    assignment;

  beforeAll(async () => {
    // No need to sync since we are in a test environment with a pre-synced DB
  });

  afterAll(async () => {
    if (sequelize) await sequelize.close();
  });

  beforeEach(async () => {
    await PeerReviewVote.destroy({ where: {}, cascade: true });
    await PeerReviewAssignment.destroy({ where: {}, cascade: true });
    await Submission.destroy({ where: {}, cascade: true });
    await Match.destroy({ where: {}, cascade: true });
    await ChallengeMatchSetting.destroy({ where: {}, cascade: true });
    await MatchSetting.destroy({ where: {}, cascade: true });
    await ChallengeParticipant.destroy({ where: {}, cascade: true });
    await Challenge.destroy({ where: {}, cascade: true });
    await User.destroy({ where: {}, cascade: true });

    student = await User.create({
      username: 'student1',
      email: 'student1@test.com',
      password: 'password',
      role: 'student',
    });

    challenge = await Challenge.create({
      title: 'Breakdown Challenge',
      duration: 30,
      startDatetime: new Date(),
      endDatetime: new Date(Date.now() + 30 * 60000),
      durationPeerReview: 30,
      allowedNumberOfReview: 1,
      status: ChallengeStatus.STARTED_PHASE_TWO,
    });

    participant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: student.id,
    });

    matchSetting = await MatchSetting.create({
      problemTitle: 'Problem 1',
      problemDescription: 'Desc',
      referenceSolution: 'function solve(x) { return [x * 2]; }',
      publicTests: [],
      privateTests: [],
      status: 'ready',
    });

    cms = await ChallengeMatchSetting.create({
      challengeId: challenge.id,
      matchSettingId: matchSetting.id,
    });

    match = await Match.create({
      challengeMatchSettingId: cms.id,
      challengeParticipantId: participant.id,
    });

    submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: participant.id,
      code: 'code',
      status: SubmissionStatus.PROBABLY_CORRECT,
      isFinal: true,
    });

    assignment = await PeerReviewAssignment.create({
      submissionId: submission.id,
      reviewerId: participant.id,
      isExtra: false,
    });
  });

  it('returns breakdown with earned credit for CORRECT vote', async () => {
    const agent = request.agent(app);

    const password = 'password';

    const loginRes = await agent
      .post('/api/login')
      .send({ email: student.email, password: password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: VoteType.CORRECT,
    });

    const res = await agent.get(
      `/api/rest/challenges/${challenge.id}/peer-reviews/votes`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.votes).toHaveLength(1);
    const vote = res.body.votes[0];
    expect(vote.vote).toBe(VoteType.CORRECT);
    expect(vote.isVoteCorrect).toBe(true);
    expect(vote.earnedCredit).toBe(true);
  });

  it('returns breakdown with reference output for INCORRECT vote', async () => {
    const agent = request.agent(app);

    const password = 'password';

    const loginRes = await agent
      .post('/api/login')
      .send({ email: student.email, password: password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.success).toBe(true);

    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: VoteType.INCORRECT,
      testCaseInput: JSON.stringify([5]),
      expectedOutput: JSON.stringify([10]),
    });

    const res = await agent.get(
      `/api/rest/challenges/${challenge.id}/peer-reviews/votes`
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.votes).toHaveLength(1);
    const vote = res.body.votes[0];
    expect(vote.vote).toBe(VoteType.INCORRECT);
    expect(vote.isExpectedOutputCorrect).toBe(true);
    expect(vote.referenceOutput).toBe('[10]');
    expect(vote.isVoteCorrect).toBe(false); // Submission was PROBABLY_CORRECT
    expect(vote.earnedCredit).toBe(false);
  });
});
