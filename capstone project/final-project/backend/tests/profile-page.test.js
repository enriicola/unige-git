import { beforeEach, describe, expect, it } from 'vitest';
import request from 'supertest';

import app from '#root/app_initial.js';
import sequelize from '#root/services/sequelize.js';
import studentProfile from '#root/services/student-profile.js';
import User from '#root/models/user.js';
import Title from '#root/models/title.js';
import Badge from '#root/models/badge.js';
import StudentBadge from '#root/models/student-badges.js';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import SubmissionScoreBreakdown from '#root/models/submission-score-breakdown.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';

const PASSWORD = 'password123';

const buildChallengeTimes = () => {
  const now = Date.now();
  return {
    startDatetime: new Date(now - 4 * 60 * 60 * 1000),
    endDatetime: new Date(now - 3 * 60 * 60 * 1000),
    endPhaseTwoDateTime: new Date(now - 60 * 60 * 1000),
  };
};

async function createStudent({ suffix, titleKey = 'newbie' }) {
  const title = await Title.findOne({ where: { key: titleKey } });
  return User.create({
    username: `student_profile_${suffix}`,
    email: `student_profile_${suffix}@test.dev`,
    password: PASSWORD,
    role: 'student',
    titleId: title?.id ?? null,
  });
}

async function loginAs(agent, user) {
  const response = await agent.post('/api/login').send({
    email: user.email,
    password: PASSWORD,
  });
  expect(response.status).toBe(200);
  expect(response.body.success).toBe(true);
}

async function createCompletedChallengeForStudent({
  student,
  suffix,
  totalScore,
  implementationScore,
  codeReviewScore,
  createdAt = new Date(),
}) {
  const challengeTimes = buildChallengeTimes();
  const matchSetting = await MatchSetting.create({
    problemTitle: `Profile Problem ${suffix}`,
    problemDescription: 'Return expected output',
    referenceSolution: 'function solve() { return true; }',
    publicTests: [{ input: ['1'], output: '1' }],
    privateTests: [{ input: ['2'], output: '2' }],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Profile Challenge ${suffix}`,
    duration: 45,
    startDatetime: challengeTimes.startDatetime,
    endDatetime: challengeTimes.endDatetime,
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.ENDED_PHASE_TWO,
    scoringStatus: 'completed',
    endPhaseTwoDateTime: challengeTimes.endPhaseTwoDateTime,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const participant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: student.id,
  });

  const match = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: participant.id,
  });

  const submission = await Submission.create({
    matchId: match.id,
    challengeParticipantId: participant.id,
    code: 'function solve() { return true; }',
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal: true,
    createdAt,
    updatedAt: createdAt,
  });

  await SubmissionScoreBreakdown.create({
    challengeParticipantId: participant.id,
    submissionId: submission.id,
    totalScore,
    implementationScore,
    codeReviewScore,
    createdAt,
    updatedAt: createdAt,
  });

  return {
    challenge,
    participant,
    submission,
  };
}

async function assignBadgeToStudent({ studentId, badgeKey, earnedAt }) {
  const badge = await Badge.findOne({ where: { key: badgeKey } });
  expect(badge).toBeTruthy();

  await StudentBadge.create({
    studentId,
    badgeId: badge.id,
    earnedAt,
  });
}

async function createReviewVoteForStudent({
  reviewerStudent,
  suffix,
  isVoteCorrect,
}) {
  const challengeTimes = buildChallengeTimes();
  const matchSetting = await MatchSetting.create({
    problemTitle: `Review Vote Problem ${suffix}`,
    problemDescription: 'Review the submission',
    referenceSolution: 'return 1;',
    publicTests: [{ input: ['1'], output: '1' }],
    privateTests: [{ input: ['2'], output: '2' }],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Review Vote Challenge ${suffix}`,
    duration: 30,
    startDatetime: challengeTimes.startDatetime,
    endDatetime: challengeTimes.endDatetime,
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.ENDED_PHASE_TWO,
    scoringStatus: 'completed',
    endPhaseTwoDateTime: challengeTimes.endPhaseTwoDateTime,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewerStudent.id,
  });

  const reviewee = await User.create({
    username: `reviewee_${suffix}`,
    email: `reviewee_${suffix}@test.dev`,
    password: PASSWORD,
    role: 'student',
  });

  const revieweeParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewee.id,
  });

  const revieweeMatch = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: revieweeParticipant.id,
  });

  const revieweeSubmission = await Submission.create({
    matchId: revieweeMatch.id,
    challengeParticipantId: revieweeParticipant.id,
    code: 'function solve() { return 1; }',
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal: true,
  });

  const assignment = await PeerReviewAssignment.create({
    submissionId: revieweeSubmission.id,
    reviewerId: reviewerParticipant.id,
  });

  await PeerReviewVote.create({
    peerReviewAssignmentId: assignment.id,
    vote: VoteType.CORRECT,
    isVoteCorrect,
  });
}

describe('Student profile backend coverage for profile page user story', () => {
  beforeEach(async () => {
    await sequelize.truncate({ cascade: true, restartIdentity: true });
    await Promise.all([Title.seed(), Badge.seed()]);
  });

  it('loads profile data with all sections required by the profile page', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix, titleKey: 'pupil' });
    const firstChallenge = await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-challenge`,
      totalScore: 88,
      implementationScore: 42,
      codeReviewScore: 46,
      createdAt: new Date('2026-02-01T10:00:00.000Z'),
    });

    await assignBadgeToStudent({
      studentId: student.id,
      badgeKey: 'challenge_3',
      earnedAt: new Date('2026-02-02T10:00:00.000Z'),
    });
    await assignBadgeToStudent({
      studentId: student.id,
      badgeKey: 'review_3',
      earnedAt: new Date('2026-02-03T10:00:00.000Z'),
    });
    await createReviewVoteForStudent({
      reviewerStudent: student,
      suffix: `${suffix}-vote`,
      isVoteCorrect: true,
    });

    const agent = request.agent(app);
    await loginAs(agent, student);

    const response = await agent.get('/api/rest/students/me/profile');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const { data } = response.body;
    expect(data.user).toMatchObject({
      id: student.id,
      username: student.username,
      email: student.email,
    });

    expect(data.title).toMatchObject({
      name: 'Pupil',
      description: 'Developing fundamentals',
      nextTitle: 'Specialist',
    });

    expect(data.badges.milestone).toHaveLength(1);
    expect(data.badges.codeReview).toHaveLength(1);
    expect(Array.isArray(data.badges.reviewQuality)).toBe(true);

    expect(data.stats).toMatchObject({
      totalChallenges: 1,
      badgesEarned: 2,
      reviewsGiven: 1,
      reviewAccuracy: 100,
    });
    expect(data.stats.avgTotalScore).toBeCloseTo(88, 5);
    expect(data.stats.avgImplementation).toBeCloseTo(42, 5);
    expect(data.stats.avgCodeReview).toBeCloseTo(46, 5);

    expect(data.challengeHistory).toHaveLength(1);
    expect(data.challengeHistory[0]).toMatchObject({
      id: firstChallenge.challenge.id,
      title: firstChallenge.challenge.title,
    });
    expect(typeof data.challengeHistory[0].createdAt).toBe('string');
  });

  it('supports detailed breakdown navigation by using profile history challenge id on results endpoint', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix });
    const challengeData = await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-history`,
      totalScore: 91,
      implementationScore: 45,
      codeReviewScore: 46,
      createdAt: new Date('2026-02-04T12:00:00.000Z'),
    });

    const agent = request.agent(app);
    await loginAs(agent, student);

    const profileResponse = await agent.get('/api/rest/students/me/profile');
    expect(profileResponse.status).toBe(200);
    expect(profileResponse.body.success).toBe(true);

    const challengeIdForBreakdown =
      profileResponse.body.data.challengeHistory[0].id;
    const scoreResponse = await agent.get(
      `/api/rest/challenges/${challengeIdForBreakdown}/results?studentId=${student.id}`
    );

    expect(scoreResponse.status).toBe(200);
    expect(scoreResponse.body.success).toBe(true);
    expect(scoreResponse.body.data.challenge.id).toBe(
      challengeData.challenge.id
    );
    expect(scoreResponse.body.data.scoreBreakdown.totalScore).toBeCloseTo(
      91,
      5
    );
  });

  it('updates profile immediately after a newly completed challenge is added', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix });

    await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-first`,
      totalScore: 80,
      implementationScore: 40,
      codeReviewScore: 40,
      createdAt: new Date('2026-02-01T09:00:00.000Z'),
    });

    const agent = request.agent(app);
    await loginAs(agent, student);

    const beforeResponse = await agent.get('/api/rest/students/me/profile');
    expect(beforeResponse.status).toBe(200);
    expect(beforeResponse.body.data.stats.totalChallenges).toBe(1);
    expect(beforeResponse.body.data.challengeHistory).toHaveLength(1);
    expect(beforeResponse.body.data.stats.avgTotalScore).toBeCloseTo(80, 5);

    await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-second`,
      totalScore: 100,
      implementationScore: 50,
      codeReviewScore: 50,
      createdAt: new Date('2026-02-02T09:00:00.000Z'),
    });

    const afterResponse = await agent.get('/api/rest/students/me/profile');
    expect(afterResponse.status).toBe(200);
    expect(afterResponse.body.success).toBe(true);
    expect(afterResponse.body.data.stats.totalChallenges).toBe(2);
    expect(afterResponse.body.data.challengeHistory).toHaveLength(2);
    expect(afterResponse.body.data.stats.avgTotalScore).toBeCloseTo(90, 5);
    expect(afterResponse.body.data.stats.avgImplementation).toBeCloseTo(45, 5);
    expect(afterResponse.body.data.stats.avgCodeReview).toBeCloseTo(45, 5);
  });

  it('calculates profile statistics correctly in studentProfile service', async () => {
    const suffix = Date.now();
    const student = await createStudent({ suffix });

    await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-stats-1`,
      totalScore: 60,
      implementationScore: 20,
      codeReviewScore: 40,
      createdAt: new Date('2026-01-10T09:00:00.000Z'),
    });
    await createCompletedChallengeForStudent({
      student,
      suffix: `${suffix}-stats-2`,
      totalScore: 80,
      implementationScore: 40,
      codeReviewScore: 40,
      createdAt: new Date('2026-01-11T09:00:00.000Z'),
    });

    await assignBadgeToStudent({
      studentId: student.id,
      badgeKey: 'challenge_3',
      earnedAt: new Date('2026-01-12T09:00:00.000Z'),
    });
    await assignBadgeToStudent({
      studentId: student.id,
      badgeKey: 'review_3',
      earnedAt: new Date('2026-01-13T09:00:00.000Z'),
    });

    await createReviewVoteForStudent({
      reviewerStudent: student,
      suffix: `${suffix}-stats-vote-1`,
      isVoteCorrect: true,
    });
    await createReviewVoteForStudent({
      reviewerStudent: student,
      suffix: `${suffix}-stats-vote-2`,
      isVoteCorrect: false,
    });

    const result = await studentProfile({ studentId: student.id });

    expect(result.status).toBe('ok');
    expect(result.data.stats.totalChallenges).toBe(2);
    expect(result.data.stats.avgTotalScore).toBeCloseTo(70, 5);
    expect(result.data.stats.avgImplementation).toBeCloseTo(30, 5);
    expect(result.data.stats.avgCodeReview).toBeCloseTo(40, 5);
    expect(result.data.stats.reviewsGiven).toBe(2);
    expect(result.data.stats.reviewAccuracy).toBe(50);
    expect(result.data.stats.badgesEarned).toBe(2);
  });
});
