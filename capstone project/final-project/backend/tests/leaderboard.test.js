import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from 'vitest';
import request from 'supertest';

let app;
let sequelize;
let Challenge;
let ChallengeParticipant;
let User;
let Submission;
let SubmissionScoreBreakdown;
let Title;
let Badge;
let Match;
let ChallengeMatchSetting;
let MatchSetting;

let createdChallengeIds = [];
let createdUserIds = [];
let createdMatchSettingIds = [];
let createdBadgeIds = [];

beforeAll(async () => {
  const appModule = await import('#root/app_initial.js');
  const sequelizeModule = await import('#root/services/sequelize.js');
  const challengeModule = await import('#root/models/challenge.js');
  const challengeParticipantModule =
    await import('#root/models/challenge-participant.js');
  const userModule = await import('#root/models/user.js');
  const submissionModule = await import('#root/models/submission.js');
  const scoreBreakdownModule =
    await import('#root/models/submission-score-breakdown.js');
  const titleModule = await import('#root/models/title.js');
  const badgeModule = await import('#root/models/badge.js');
  const matchModule = await import('#root/models/match.js');
  const challengeMatchSettingModule =
    await import('#root/models/challenge-match-setting.js');
  const matchSettingModule = await import('#root/models/match-setting.js');

  app = appModule.default;
  sequelize = sequelizeModule.default;
  Challenge = challengeModule.default;
  ChallengeParticipant = challengeParticipantModule.default;
  User = userModule.default;
  Submission = submissionModule.default;
  SubmissionScoreBreakdown = scoreBreakdownModule.default;
  Title = titleModule.default;
  Badge = badgeModule.default;
  Match = matchModule.default;
  ChallengeMatchSetting = challengeMatchSettingModule.default;
  MatchSetting = matchSettingModule.default;

  await Title.seed();
});

beforeEach(() => {
  createdChallengeIds = [];
  createdUserIds = [];
  createdMatchSettingIds = [];
  createdBadgeIds = [];
});

afterEach(async () => {
  try {
    if (createdChallengeIds.length > 0) {
      await Challenge.destroy({
        where: { id: createdChallengeIds },
        force: true,
      });
    }
    if (createdUserIds.length > 0) {
      await User.destroy({ where: { id: createdUserIds }, force: true });
    }
    if (createdMatchSettingIds.length > 0) {
      await MatchSetting.destroy({
        where: { id: createdMatchSettingIds },
        force: true,
      });
    }
    if (createdBadgeIds.length > 0) {
      await Badge.destroy({ where: { id: createdBadgeIds }, force: true });
    }
  } catch (error) {
    console.error('Cleanup error:', error);
  }
});

afterAll(async () => {
  if (sequelize) await sequelize.close();
});

const setupFinishedChallenge = async (
  title = 'Finished Challenge',
  scoringStatus = 'completed'
) => {
  const challenge = await Challenge.create({
    title,
    duration: 60,
    startDatetime: new Date('2025-01-01T09:00:00Z'),
    endDatetime: new Date('2025-01-01T11:00:00Z'),
    durationPeerReview: 60,
    status: 'ended_phase_two',
    scoringStatus,
  });
  createdChallengeIds.push(challenge.id);

  const matchSetting = await MatchSetting.create({
    problemTitle: 'Prob ' + Date.now(),
    problemDescription: 'Desc',
    referenceSolution: 'code',
    publicTests: [],
    privateTests: [],
    status: 'ready',
  });
  createdMatchSettingIds.push(matchSetting.id);

  const cms = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  return { challenge, cms };
};

const createStudentWithScore = async (
  challengeId,
  cmsId,
  username,
  totalScore,
  implScore,
  reviewScore
) => {
  const titleNewbie = await Title.findOne({ where: { key: 'newbie' } });
  const user = await User.create({
    username,
    email: `${username}_${Date.now()}@test.com`,
    password: 'password',
    role: 'student',
    titleId: titleNewbie.id,
  });
  createdUserIds.push(user.id);

  const participant = await ChallengeParticipant.create({
    challengeId,
    studentId: user.id,
  });

  const match = await Match.create({
    challengeMatchSettingId: cmsId,
    challengeParticipantId: participant.id,
  });

  const submission = await Submission.create({
    matchId: match.id,
    challengeParticipantId: participant.id,
    code: 'some code',
    status: 'probably_correct',
    isFinal: true,
  });

  await SubmissionScoreBreakdown.create({
    submissionId: submission.id,
    challengeParticipantId: participant.id,
    totalScore,
    implementationScore: implScore,
    codeReviewScore: reviewScore,
  });

  return user;
};

describe('Leaderboard API - RT-18 Acceptance Criteria', () => {
  it('AC1 & AC10: should return empty state if challenge is not ended', async () => {
    const challenge = await Challenge.create({
      title: 'In Progress',
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(Date.now() + 3600000),
      durationPeerReview: 60,
      status: 'started_phase_one',
      scoringStatus: 'pending',
    });
    createdChallengeIds.push(challenge.id);

    const res = await request(app).get(
      `/api/rest/challenges/${challenge.id}/leaderboard`
    );
    expect(res.body.data.leaderboard).toHaveLength(0);
    expect(res.body.data.summary.totalParticipants).toBe(0);
  });

  it('AC1 & AC10: should return empty state if scoring is still computing', async () => {
    const { challenge } = await setupFinishedChallenge(
      'Computing',
      'computing'
    );
    const res = await request(app).get(
      `/api/rest/challenges/${challenge.id}/leaderboard`
    );
    expect(res.body.data.leaderboard).toHaveLength(0);
    expect(res.body.data.summary.totalParticipants).toBe(0);
  });

  it('AC2 & AC6: should rank by total score descending and alphabetical username for ties', async () => {
    const { challenge, cms } = await setupFinishedChallenge();

    await createStudentWithScore(challenge.id, cms.id, 'Charlie', 80, 40, 40);
    await createStudentWithScore(challenge.id, cms.id, 'Alice', 90, 45, 45);
    await createStudentWithScore(challenge.id, cms.id, 'Bob', 80, 40, 40);

    const res = await request(app).get(
      `/api/rest/challenges/${challenge.id}/leaderboard`
    );
    const leaderboard = res.body.data.leaderboard;

    expect(leaderboard[0].username).toBe('Alice'); // 90
    expect(leaderboard[1].username).toBe('Bob'); // 80 (B < C)
    expect(leaderboard[2].username).toBe('Charlie'); // 80
  });

  it('AC3: should include all required fields in each leaderboard entry', async () => {
    const { challenge, cms } = await setupFinishedChallenge();
    await createStudentWithScore(challenge.id, cms.id, 'Dave', 75, 35, 40);

    const res = await request(app).get(
      `/api/rest/challenges/${challenge.id}/leaderboard`
    );
    const entry = res.body.data.leaderboard[0];

    expect(entry).toHaveProperty('rank');
    expect(entry).toHaveProperty('username');
    expect(entry).toHaveProperty('totalScore');
    expect(entry).toHaveProperty('implementationScore');
    expect(entry).toHaveProperty('codeReviewScore');
    expect(entry).toHaveProperty('skillTitle');
    expect(entry).toHaveProperty('badges');
  });

  it('AC4 & AC5: should highlight the current user and calculate gap to next position', async () => {
    const { challenge, cms } = await setupFinishedChallenge();
    await createStudentWithScore(challenge.id, cms.id, 'Alice', 95, 48, 47);
    const bob = await createStudentWithScore(
      challenge.id,
      cms.id,
      'Bob',
      85,
      40,
      45
    );

    const res = await request(app)
      .get(`/api/rest/challenges/${challenge.id}/leaderboard`)
      .query({ studentId: bob.id });

    const { leaderboard, personalSummary } = res.body.data;

    // Bob is rank 2
    expect(leaderboard[1].isCurrentUser).toBe(true);
    expect(personalSummary.rank).toBe(2);
    expect(personalSummary.gapToPrevious).toBe(10); // 95 - 85
  });

  it('AC8: should handle top rank (Rank 1) correctly without gap to previous', async () => {
    const { challenge, cms } = await setupFinishedChallenge();
    const alice = await createStudentWithScore(
      challenge.id,
      cms.id,
      'Alice',
      100,
      50,
      50
    );

    const res = await request(app)
      .get(`/api/rest/challenges/${challenge.id}/leaderboard`)
      .query({ studentId: alice.id });

    expect(res.body.data.personalSummary.rank).toBe(1);
    expect(res.body.data.personalSummary.gapToPrevious).toBeNull();
  });

  it('AC9: should calculate correct average score and total participants in summary', async () => {
    const { challenge, cms } = await setupFinishedChallenge();
    await createStudentWithScore(challenge.id, cms.id, 'S1', 100, 50, 50);
    await createStudentWithScore(challenge.id, cms.id, 'S2', 50, 25, 25);

    const res = await request(app).get(
      `/api/rest/challenges/${challenge.id}/leaderboard`
    );
    expect(res.body.data.summary.totalParticipants).toBe(2);
    expect(res.body.data.summary.averageScore).toBe(75.0);
  });

  it('Security: should deny access to private challenge leaderboard for non-privileged users', async () => {
    const challenge = await Challenge.create({
      title: 'Private Challenge',
      duration: 60,
      startDatetime: new Date(),
      endDatetime: new Date(Date.now() + 3600000),
      durationPeerReview: 60,
      status: 'private',
      scoringStatus: 'completed',
    });
    createdChallengeIds.push(challenge.id);

    // Mock student user (non-teacher)
    const res = await request(app)
      .get(`/api/rest/challenges/${challenge.id}/leaderboard`)
      // Note: In real app, the session/cookie would be checked.
      // The controller uses shouldHidePrivate(req) which checks role.
      .set('Cookie', ['role=student']);

    // Assuming the test setup uses a middleware that respects this or
    // we bypass it to test the logic in the controller.
    expect(res.status).toBe(403);
    expect(res.body.error).toBe('Challenge is private');
  });
});
