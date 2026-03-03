import {
  describe,
  it,
  beforeAll,
  expect,
  vi,
  afterAll,
  beforeEach,
  afterEach,
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
}, 60000);

beforeEach(() => {
  createdChallenges = [];
  createdUsers = [];
  createdMatchSettings = [];
  vi.clearAllMocks();
});

afterEach(async () => {
  // Cleanup in reverse order of dependencies
  try {
    // Delete votes
    await PeerReviewVote.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete assignments
    await PeerReviewAssignment.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete submissions
    await Submission.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete matches
    await Match.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete challenge match settings
    await ChallengeMatchSetting.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete participants
    await ChallengeParticipant.destroy({
      where: {},
      force: true,
      truncate: { cascade: true },
    });

    // Delete challenges
    for (const challengeId of createdChallenges) {
      await Challenge.destroy({ where: { id: challengeId }, force: true });
    }

    // Delete match settings
    for (const matchSettingId of createdMatchSettings) {
      await MatchSetting.destroy({
        where: { id: matchSettingId },
        force: true,
      });
    }

    // Delete users
    for (const userId of createdUsers) {
      await User.destroy({ where: { id: userId }, force: true });
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

afterAll(async () => {
  if (!sequelize) return;
  try {
    await Promise.race([
      sequelize.close(),
      new Promise((resolve) => setTimeout(resolve, 5000)),
    ]);
  } catch {
    // Best-effort close to avoid hanging test teardown in CI.
  }
}, 20000);

describe('Peer Review Finalization', () => {
  const createChallengeAndParticipants = async (
    status = ChallengeStatus.STARTED_PHASE_TWO
  ) => {
    // 1. Create Challenge
    const challenge = await Challenge.create({
      title: 'Finalization Test',
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 2,
      status: status,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000), // Started 20 mins ago, duration is 10 mins, so it's expired
    });
    createdChallenges.push(challenge.id);

    // 2. Create Student (Reviewer)
    const uniqueIdReviewer = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const student = await User.create({
      username: `test_reviewer_${uniqueIdReviewer}`,
      email: `test_reviewer_${uniqueIdReviewer}@example.com`,
      password: 'password',
      firstName: 'Test',
      lastName: 'Student',
      role: 'student',
    });
    createdUsers.push(student.id);

    const participant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: student.id,
    });

    // 3. Create another Student (Submitter)
    const uniqueIdSubmitter = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const submitter = await User.create({
      username: `test_submitter_${uniqueIdSubmitter}`,
      email: `test_submitter_${uniqueIdSubmitter}@example.com`,
      password: 'password',
      firstName: 'Submitter',
      lastName: 'Student',
      role: 'student',
    });
    createdUsers.push(submitter.id);

    const submitterParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: submitter.id,
    });

    // 4. Create MatchSetting
    let matchSetting;
    try {
      matchSetting = await MatchSetting.create({
        problemTitle: 'Test Problem',
        problemDescription: 'Desc',
        referenceSolution: 'ref',
        publicTests: [],
        privateTests: [],
        status: 'ready',
      });
    } catch (e) {
      console.error('MatchSetting create failed:', e);
      throw e;
    }
    createdMatchSettings.push(matchSetting.id);

    // 5. Create ChallengeMatchSetting
    const cms = await ChallengeMatchSetting.create({
      challengeId: challenge.id,
      matchSettingId: matchSetting.id,
    });

    // 6. Create Match for Submitter
    const match = await Match.create({
      challengeMatchSettingId: cms.id,
      challengeParticipantId: submitterParticipant.id,
    });

    // 7. Create Submission for Submitter
    const submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: submitterParticipant.id,
      code: 'console.log("hello")',
      status: 'probably_correct',
      isFinal: true,
    });

    // 8. Create Peer Review Assignment (Reviewer reviews Submitter's submission)
    const assignment = await PeerReviewAssignment.create({
      reviewerId: participant.id,
      submissionId: submission.id,
      // PeerReviewAssignment does not have matchId field based on inspection
    });

    return { challenge, participant, assignment };
  };

  it('should fail if timer has not expired', async () => {
    const { challenge } = await createChallengeAndParticipants();

    // Update challenge to have started just now
    await challenge.update({
      startPhaseTwoDateTime: new Date(),
      durationPeerReview: 60, // 60 minutes duration, so it hasn't expired
    });

    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toMatch(/Peer review phase has not ended yet/i);
  });

  it('should finalize correctly if timer has expired', async () => {
    const { challenge, assignment } = await createChallengeAndParticipants();

    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.finalized).toBe(true);

    const updatedChallenge = await Challenge.findByPk(challenge.id);
    expect(updatedChallenge.status).toBe(ChallengeStatus.ENDED_PHASE_TWO);

    // Verify unvoted assignments became abstain
    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote).toBeDefined();
    expect(vote.vote).toBe('abstain');
  });

  it('should be idempotent (multiple calls do not error)', async () => {
    const { challenge } = await createChallengeAndParticipants();

    let res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);

    // Call again
    res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should handle invalid challengeId', async () => {
    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: 999999 });

    expect(res.status).toBe(404);
  });

  it('should not change existing votes', async () => {
    const { challenge, assignment } = await createChallengeAndParticipants();

    // Cast a vote
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: 'correct',
      testCaseInput: null,
      expectedOutput: null,
    });

    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);

    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote.vote).toBe('correct');
  });

  it('should rollback transaction on database error', async () => {
    const { challenge } = await createChallengeAndParticipants();

    // Mock an error during vote creation
    const originalBulkCreate = PeerReviewVote.bulkCreate;
    vi.spyOn(PeerReviewVote, 'bulkCreate').mockRejectedValue(
      new Error('DB Error')
    );

    try {
      const res = await request(app)
        .post('/api/rest/peer-review/finalize-challenge')
        .send({ challengeId: challenge.id });

      expect(res.status).toBe(500);

      // Verify challenge status was NOT updated (rollback occurred)
      const updatedChallenge = await Challenge.findByPk(challenge.id);
      expect(updatedChallenge.status).not.toBe(ChallengeStatus.ENDED_PHASE_TWO);
    } finally {
      // Restore mock
      PeerReviewVote.bulkCreate = originalBulkCreate;
    }
  });

  it('should handle partial votes - only unvoted assignments become abstain', async () => {
    const challenge = await Challenge.create({
      title: 'Partial Votes Test',
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 3,
      status: ChallengeStatus.STARTED_PHASE_TWO,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000),
    });
    createdChallenges.push(challenge.id);

    // Create reviewer
    const uniqueId = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const reviewer = await User.create({
      username: `reviewer_${uniqueId}`,
      email: `reviewer_${uniqueId}@example.com`,
      password: 'password',
      firstName: 'Reviewer',
      lastName: 'Student',
      role: 'student',
    });
    createdUsers.push(reviewer.id);

    const reviewerParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: reviewer.id,
    });

    // Create three submitters and submissions
    const matchSetting = await MatchSetting.create({
      problemTitle: 'Test Problem',
      problemDescription: 'Desc',
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
        username: `submitter_${uniqueId}_${i}`,
        email: `submitter_${uniqueId}_${i}@example.com`,
        password: 'password',
        firstName: `Submitter${i}`,
        lastName: 'Student',
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
        code: `console.log("code ${i}")`,
        status: 'probably_correct',
        isFinal: true,
      });

      const assignment = await PeerReviewAssignment.create({
        reviewerId: reviewerParticipant.id,
        submissionId: submission.id,
      });

      assignments.push(assignment);
    }

    // Vote on the first assignment only
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignments[0].id,
      vote: 'correct',
      testCaseInput: null,
      expectedOutput: null,
    });

    // Finalize
    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);

    // Check votes
    const vote0 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[0].id },
    });
    expect(vote0.vote).toBe('correct'); // Should remain correct

    const vote1 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[1].id },
    });
    expect(vote1.vote).toBe('abstain'); // Should be abstain

    const vote2 = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignments[2].id },
    });
    expect(vote2.vote).toBe('abstain'); // Should be abstain
  });

  it('should handle finalization with all votes already submitted - no changes', async () => {
    const { challenge, assignment } = await createChallengeAndParticipants();

    // Create votes for all assignments
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote: 'incorrect',
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '["result"]',
    });

    // Get vote ID before finalization
    await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    const voteCountBefore = await PeerReviewVote.count();

    // Finalize
    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(200);

    // Verify no new votes were created
    const voteCountAfter = await PeerReviewVote.count();
    expect(voteCountAfter).toBe(voteCountBefore);

    // Verify existing vote unchanged
    const voteAfter = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(voteAfter.vote).toBe('incorrect');
    expect(voteAfter.testCaseInput).toBe('[1, 2, 3]');
    expect(voteAfter.expectedOutput).toBe('["result"]');
  });

  it('should handle error when challenge has no participants gracefully', async () => {
    // Create a challenge with no participants
    const challenge = await Challenge.create({
      title: 'No Participants Test',
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(new Date().getTime() + 3600000),
      durationPeerReview: 10,
      allowedNumberOfReview: 2,
      status: ChallengeStatus.STARTED_PHASE_TWO,
      startPhaseTwoDateTime: new Date(new Date().getTime() - 20 * 60000),
    });
    createdChallenges.push(challenge.id);

    const res = await request(app)
      .post('/api/rest/peer-review/finalize-challenge')
      .send({ challengeId: challenge.id });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/participants/i);
  });
});
