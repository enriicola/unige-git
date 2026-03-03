import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  vi,
} from 'vitest';
import request from 'supertest';
import { ChallengeStatus } from '#root/models/enum/enums.js';

let app;
let sequelize;
let Challenge;
let ChallengeParticipant;
let PeerReviewAssignment;
let PeerReviewVote;
let User;
let MatchSetting;
let ChallengeMatchSetting;
let Match;
let Submission;

let createdChallenges = [];
let createdUsers = [];
let createdMatchSettings = [];

beforeAll(async () => {
  const appModule = await import('#root/app_initial.js');
  const sequelizeModule = await import('#root/services/sequelize.js');
  const challengeModule = await import('#root/models/challenge.js');
  const participantModule =
    await import('#root/models/challenge-participant.js');
  const assignmentModule =
    await import('#root/models/peer_review_assignment.js');
  const voteModule = await import('#root/models/peer-review-vote.js');
  const userModule = await import('#root/models/user.js');
  const matchSettingModule = await import('#root/models/match-setting.js');
  const challengeMatchSettingModule =
    await import('#root/models/challenge-match-setting.js');
  const matchModule = await import('#root/models/match.js');
  const submissionModule = await import('#root/models/submission.js');

  app = appModule.default;
  sequelize = sequelizeModule.default;
  Challenge = challengeModule.default;
  ChallengeParticipant = participantModule.default;
  PeerReviewAssignment = assignmentModule.default;
  PeerReviewVote = voteModule.default;
  User = userModule.default;
  MatchSetting = matchSettingModule.default;
  ChallengeMatchSetting = challengeMatchSettingModule.default;
  Match = matchModule.default;
  Submission = submissionModule.default;

  await sequelize.truncate({ cascade: true, restartIdentity: true });
}, 60000);

beforeEach(() => {
  createdChallenges = [];
  createdUsers = [];
  createdMatchSettings = [];
});

afterEach(async () => {
  try {
    await PeerReviewVote.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await PeerReviewAssignment.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await Submission.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await Match.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await ChallengeMatchSetting.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });
    await ChallengeParticipant.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    for (const challengeId of createdChallenges) {
      await Challenge.destroy({ where: { id: challengeId }, force: true });
    }

    for (const matchSettingId of createdMatchSettings) {
      await MatchSetting.destroy({
        where: { id: matchSettingId },
        force: true,
      });
    }

    for (const userId of createdUsers) {
      await User.destroy({ where: { id: userId }, force: true });
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

afterAll(async () => {
  if (sequelize) await sequelize.close();
});

describe('Peer Review Finalization - Integration Tests', () => {
  vi.setConfig({ testTimeout: 15000 });

  it('should complete full finalization flow: setup -> timer expiry -> finalize -> verify', async () => {
    // 1. Setup: Create challenge, participants, assignments
    const suffix = Date.now() + Math.floor(Math.random() * 1000);

    // Create Challenge
    const challenge = await Challenge.create({
      title: `Integration Test Challenge ${suffix}`,
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 2,
      status: ChallengeStatus.STARTED_PHASE_TWO,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000), // Expired 10 minutes ago
    });
    createdChallenges.push(challenge.id);

    // Create Reviewer
    const reviewer = await User.create({
      username: `integration_reviewer_${suffix}`,
      email: `integration_reviewer_${suffix}@test.com`,
      password: 'password',
      firstName: 'Integration',
      lastName: 'Reviewer',
      role: 'student',
    });
    createdUsers.push(reviewer.id);

    const reviewerParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: reviewer.id,
    });

    // Create two Submitters with submissions
    const matchSetting = await MatchSetting.create({
      problemTitle: `Integration Test Problem ${suffix}`,
      problemDescription: 'Test integration flow',
      referenceSolution: 'ref solution',
      publicTests: [],
      privateTests: [],
      status: 'ready',
    });
    createdMatchSettings.push(matchSetting.id);

    const cms = await ChallengeMatchSetting.create({
      challengeId: challenge.id,
      matchSettingId: matchSetting.id,
    });

    const assignments = [];
    for (let i = 0; i < 2; i++) {
      const submitter = await User.create({
        username: `integration_submitter_${suffix}_${i}`,
        email: `integration_submitter_${suffix}_${i}@test.com`,
        password: 'password',
        firstName: `Submitter${i}`,
        lastName: 'Integration',
        role: 'student',
      });
      createdUsers.push(submitter.id);

      const submitterParticipant = await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: submitter.id,
      });

      const match = await Match.create({
        challengeMatchSettingId: cms.id,
        challengeParticipantId: submitterParticipant.id,
      });

      const submission = await Submission.create({
        matchId: match.id,
        challengeParticipantId: submitterParticipant.id,
        code: `console.log("solution ${i}")`,
        status: 'probably_correct',
        isFinal: true,
      });

      const assignment = await PeerReviewAssignment.create({
        reviewerId: reviewerParticipant.id,
        submissionId: submission.id,
      });

      assignments.push(assignment);
    }

    // 2. Verify initial state: no votes, challenge is STARTED_PHASE_TWO
    let votesBeforeFinalization = await PeerReviewVote.findAll();
    expect(votesBeforeFinalization).toHaveLength(0);

    let challengeBefore = await Challenge.findByPk(challenge.id);
    expect(challengeBefore.status).toBe(ChallengeStatus.STARTED_PHASE_TWO);

    // 3. Finalize peer review
    const finalizeRes = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(finalizeRes.status).toBe(200);
    expect(finalizeRes.body.success).toBe(true);
    expect(finalizeRes.body.data.finalized).toBe(true);

    // 4. Verify database records after finalization
    const challengeAfter = await Challenge.findByPk(challenge.id);
    expect(challengeAfter.status).toBe(ChallengeStatus.ENDED_PHASE_TWO);

    // 5. Verify abstain votes were created for unvoted assignments
    const votesAfterFinalization = await PeerReviewVote.findAll();
    expect(votesAfterFinalization).toHaveLength(2);

    votesAfterFinalization.forEach((vote) => {
      expect(vote.vote).toBe('abstain');
      expect(vote.testCaseInput).toBeNull();
      expect(vote.expectedOutput).toBeNull();
    });

    // 6. Verify each assignment has exactly one vote
    for (const assignment of assignments) {
      const assignmentVotes = await PeerReviewVote.findAll({
        where: { peerReviewAssignmentId: assignment.id },
      });
      expect(assignmentVotes).toHaveLength(1);
      expect(assignmentVotes[0].vote).toBe('abstain');
    }
  });

  it('should preserve existing votes while adding abstain for unvoted submissions', async () => {
    // Setup
    const suffix = Date.now() + Math.floor(Math.random() * 1000);

    const challenge = await Challenge.create({
      title: `Mixed Votes Test ${suffix}`,
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 2,
      status: ChallengeStatus.STARTED_PHASE_TWO,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000),
    });
    createdChallenges.push(challenge.id);

    const reviewer = await User.create({
      username: `mixed_reviewer_${suffix}`,
      email: `mixed_reviewer_${suffix}@test.com`,
      password: 'password',
      firstName: 'Mixed',
      lastName: 'Reviewer',
      role: 'student',
    });
    createdUsers.push(reviewer.id);

    const reviewerParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: reviewer.id,
    });

    const matchSetting = await MatchSetting.create({
      problemTitle: `Mixed Test ${suffix}`,
      problemDescription: 'Test',
      referenceSolution: 'ref',
      publicTests: [],
      privateTests: [],
      status: 'ready',
    });
    createdMatchSettings.push(matchSetting.id);

    const cms = await ChallengeMatchSetting.create({
      challengeId: challenge.id,
      matchSettingId: matchSetting.id,
    });

    const assignments = [];
    for (let i = 0; i < 3; i++) {
      const submitter = await User.create({
        username: `mixed_submitter_${suffix}_${i}`,
        email: `mixed_submitter_${suffix}_${i}@test.com`,
        password: 'password',
        firstName: `Submitter${i}`,
        lastName: 'Mixed',
        role: 'student',
      });
      createdUsers.push(submitter.id);

      const submitterParticipant = await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: submitter.id,
      });

      const match = await Match.create({
        challengeMatchSettingId: cms.id,
        challengeParticipantId: submitterParticipant.id,
      });

      const submission = await Submission.create({
        matchId: match.id,
        challengeParticipantId: submitterParticipant.id,
        code: `solution ${i}`,
        status: 'probably_correct',
        isFinal: true,
      });

      const assignment = await PeerReviewAssignment.create({
        reviewerId: reviewerParticipant.id,
        submissionId: submission.id,
      });

      assignments.push(assignment);
    }

    // Vote on first two submissions, leave third unvoted
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignments[0].id,
      vote: 'correct',
      testCaseInput: null,
      expectedOutput: null,
    });

    await PeerReviewVote.create({
      peerReviewAssignmentId: assignments[1].id,
      vote: 'incorrect',
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '["result"]',
    });

    // Finalize
    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);

    // Verify votes
    const vote0 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[0].id },
    });
    expect(vote0.vote).toBe('correct');

    const vote1 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[1].id },
    });
    expect(vote1.vote).toBe('incorrect');
    expect(vote1.testCaseInput).toBe('[1, 2, 3]');
    expect(vote1.expectedOutput).toBe('["result"]');

    const vote2 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[2].id },
    });
    expect(vote2.vote).toBe('abstain');
  });

  it('should verify idempotency across multiple API calls', async () => {
    const suffix = Date.now() + Math.floor(Math.random() * 1000);

    const challenge = await Challenge.create({
      title: `Idempotency Test ${suffix}`,
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 1,
      status: ChallengeStatus.STARTED_PHASE_TWO,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000),
    });
    createdChallenges.push(challenge.id);

    const reviewer = await User.create({
      username: `idempotent_reviewer_${suffix}`,
      email: `idempotent_reviewer_${suffix}@test.com`,
      password: 'password',
      firstName: 'Idempotent',
      lastName: 'Reviewer',
      role: 'student',
    });
    createdUsers.push(reviewer.id);

    const reviewerParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: reviewer.id,
    });

    const matchSetting = await MatchSetting.create({
      problemTitle: `Idempotent Test ${suffix}`,
      problemDescription: 'Test',
      referenceSolution: 'ref',
      publicTests: [],
      privateTests: [],
      status: 'ready',
    });
    createdMatchSettings.push(matchSetting.id);

    const cms = await ChallengeMatchSetting.create({
      challengeId: challenge.id,
      matchSettingId: matchSetting.id,
    });

    const submitter = await User.create({
      username: `idempotent_submitter_${suffix}`,
      email: `idempotent_submitter_${suffix}@test.com`,
      password: 'password',
      firstName: 'Idempotent',
      lastName: 'Submitter',
      role: 'student',
    });
    createdUsers.push(submitter.id);

    const submitterParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: submitter.id,
    });

    const match = await Match.create({
      challengeMatchSettingId: cms.id,
      challengeParticipantId: submitterParticipant.id,
    });

    const submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: submitterParticipant.id,
      code: 'solution',
      status: 'probably_correct',
      isFinal: true,
    });

    await PeerReviewAssignment.create({
      reviewerId: reviewerParticipant.id,
      submissionId: submission.id,
    });

    // First finalization
    const res1 = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res1.status).toBe(200);

    const votesAfter1 = await PeerReviewVote.count();
    expect(votesAfter1).toBe(1);

    // Second finalization (should be idempotent)
    const res2 = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res2.status).toBe(200);

    // Vote count should remain the same
    const votesAfter2 = await PeerReviewVote.count();
    expect(votesAfter2).toBe(1);

    // Third finalization
    const res3 = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res3.status).toBe(200);

    const votesAfter3 = await PeerReviewVote.count();
    expect(votesAfter3).toBe(1);

    // Challenge status should remain ENDED_PHASE_TWO
    const finalChallenge = await Challenge.findByPk(challenge.id);
    expect(finalChallenge.status).toBe(ChallengeStatus.ENDED_PHASE_TWO);
  });
});
