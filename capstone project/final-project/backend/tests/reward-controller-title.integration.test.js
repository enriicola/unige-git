import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import sequelize from '#root/services/sequelize.js';
import User from '#root/models/user.js';
import Title from '#root/models/title.js';
import Badge from '#root/models/badge.js';
import StudentBadge from '#root/models/student-badges.js';
import Challenge from '#root/models/challenge.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import SubmissionScoreBreakdown from '#root/models/submission-score-breakdown.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';

const PASSWORD = 'password123';

const buildChallengeTimes = () => {
  const now = Date.now();
  return {
    startDatetime: new Date(now - 4 * 60 * 60 * 1000),
    endDatetime: new Date(now - 3 * 60 * 60 * 1000),
    endPhaseTwoDateTime: new Date(now - 60 * 60 * 1000),
  };
};

async function loginAs(agent, user) {
  const response = await agent.post('/api/login').send({
    email: user.email,
    password: PASSWORD,
  });
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
}

async function createStudent({ suffix, titleKey = 'newbie' }) {
  const title = await Title.findOne({ where: { key: titleKey } });
  return User.create({
    username: `title_student_${suffix}`,
    email: `title_student_${suffix}@codymatch.test`,
    password: PASSWORD,
    role: 'student',
    titleId: title?.id ?? null,
  });
}

async function createCompletedScoreRowForStudent({ studentId, suffix, score }) {
  const challengeTimes = buildChallengeTimes();
  const challenge = await Challenge.create({
    title: `Title Challenge ${suffix}`,
    duration: 45,
    startDatetime: challengeTimes.startDatetime,
    endDatetime: challengeTimes.endDatetime,
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.ENDED_PHASE_TWO,
    scoringStatus: 'completed',
    endPhaseTwoDateTime: challengeTimes.endPhaseTwoDateTime,
  });

  const participant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId,
  });

  const scoreDate = new Date();
  await SubmissionScoreBreakdown.create({
    challengeParticipantId: participant.id,
    submissionId: null,
    totalScore: score,
    implementationScore: score / 2,
    codeReviewScore: score / 2,
    createdAt: scoreDate,
    updatedAt: scoreDate,
  });
}

async function assignBadgesToStudent({ studentId, badgeKeys }) {
  const earnedAt = new Date();
  for (const badgeKey of badgeKeys) {
    const badge = await Badge.findOne({ where: { key: badgeKey } });
    expect(badge).toBeTruthy();
    await StudentBadge.create({
      studentId,
      badgeId: badge.id,
      earnedAt,
    });
  }
}

async function configureCompactTitleThresholds() {
  await Title.update(
    {
      minChallenges: 0,
      minAvgScore: 0,
      minBadges: 0,
    },
    { where: { key: 'newbie' } }
  );
  await Title.update(
    {
      minChallenges: 1,
      minAvgScore: 50,
      minBadges: 0,
    },
    { where: { key: 'pupil' } }
  );
  await Title.update(
    {
      minChallenges: 2,
      minAvgScore: 70,
      minBadges: 1,
    },
    { where: { key: 'specialist' } }
  );
  await Title.update(
    {
      minChallenges: 3,
      minAvgScore: 80,
      minBadges: 2,
    },
    { where: { key: 'expert' } }
  );
  await Title.update(
    {
      minChallenges: 4,
      minAvgScore: 90,
      minBadges: 3,
    },
    { where: { key: 'master' } }
  );
}

describe('Reward API - title progression integration', () => {
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await Promise.all([Title.seed(), Badge.seed()]);
    await configureCompactTitleThresholds();
  });

  it('awards the highest eligible title when a student crosses multiple levels at once', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix, titleKey: 'newbie' });

    await createCompletedScoreRowForStudent({
      studentId: student.id,
      suffix: `${suffix}-one`,
      score: 90,
    });
    await createCompletedScoreRowForStudent({
      studentId: student.id,
      suffix: `${suffix}-two`,
      score: 84,
    });
    await createCompletedScoreRowForStudent({
      studentId: student.id,
      suffix: `${suffix}-three`,
      score: 88,
    });
    await assignBadgesToStudent({
      studentId: student.id,
      badgeKeys: ['challenge_3', 'review_3'],
    });

    const agent = request.agent(app);
    await loginAs(agent, student);

    const response = await agent.post('/api/rest/rewards/evaluate-title');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.eligible).toBe(true);
    expect(response.body.titleChanged).toBe(true);
    expect(response.body.title).toMatchObject({
      name: 'Expert',
      description: 'Skilled coder with proven excellence',
      rank: 4,
    });

    const updatedStudent = await User.findByPk(student.id);
    const expertTitle = await Title.findOne({ where: { key: 'expert' } });
    expect(updatedStudent.titleId).toBe(expertTitle.id);

    const profileResponse = await agent.get('/api/rest/students/me/profile');
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.success).toBe(true);
    expect(profileResponse.body.data.title.name).toBe('Expert');
  });

  it('returns unauthorized when the user is not logged in', async () => {
    const response = await request(app).post(
      '/api/rest/rewards/evaluate-title'
    );

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe('Not logged in');
  });

  it('does not change title when requirements for the next title are not met', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix, titleKey: 'newbie' });
    const newbieTitle = await Title.findOne({ where: { key: 'newbie' } });

    await createCompletedScoreRowForStudent({
      studentId: student.id,
      suffix: `${suffix}-single`,
      score: 40,
    });

    const agent = request.agent(app);
    await loginAs(agent, student);

    const response = await agent.post('/api/rest/rewards/evaluate-title');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.eligible).toBe(false);
    expect(response.body.titleChanged).toBe(false);
    expect(response.body.title).toBeNull();

    const unchangedStudent = await User.findByPk(student.id);
    expect(unchangedStudent.titleId).toBe(newbieTitle.id);
  });
});
