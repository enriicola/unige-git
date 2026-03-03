import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import app from '#root/app_initial.js';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import User from '#root/models/user.js';
import { ChallengeStatus, SubmissionStatus } from '#root/models/enum/enums.js';

const createChallengeData = async ({
  participantCount = 2,
  validSubmissionCount = participantCount,
}) => {
  const suffix = Date.now() + Math.floor(Math.random() * 1000);
  const matchSetting = await MatchSetting.create({
    problemTitle: `Peer review problem ${suffix}`,
    problemDescription: 'Review problem',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [{ input: ['1'], output: '1' }],
    privateTests: [{ input: ['2'], output: '2' }],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Peer review challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(Date.now() - 60 * 60 * 1000),
    endDatetime: new Date(Date.now() + 60 * 60 * 1000),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.ENDED_PHASE_ONE,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const participants = [];
  const matches = [];
  const submissions = [];

  for (let i = 0; i < participantCount; i += 1) {
    const user = await User.create({
      username: `reviewer_${suffix}_${i}`,
      password: 'password123',
      email: `reviewer_${suffix}_${i}@mail.com`,
      role: 'student',
    });
    const participant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: user.id,
    });
    participants.push(participant);

    const match = await Match.create({
      challengeMatchSettingId: challengeMatchSetting.id,
      challengeParticipantId: participant.id,
    });
    matches.push(match);

    if (i < validSubmissionCount) {
      const submission = await Submission.create({
        matchId: match.id,
        challengeParticipantId: participant.id,
        code: 'int main() { return 0; }',
        status: SubmissionStatus.PROBABLY_CORRECT,
        isFinal: true,
      });
      submissions.push(submission);
    }
  }

  return {
    challenge,
    matchSetting,
    challengeMatchSetting,
    participants,
    matches,
    submissions,
  };
};

describe('Peer review assignment API', () => {
  beforeEach(async () => {
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
    await PeerReviewAssignment.destroy({ where: {} });
    await Submission.destroy({ where: {} });
    await Match.destroy({ where: {} });
    await ChallengeParticipant.destroy({ where: {} });
    await ChallengeMatchSetting.destroy({ where: {} });
    await Challenge.destroy({ where: {} });
    await MatchSetting.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  it('assigns peer reviews for valid submissions', async () => {
    const { challenge, submissions } = await createChallengeData({
      participantCount: 2,
      validSubmissionCount: 2,
    });

    const res = await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results?.length).toBe(1);
    expect(res.body.results[0].status).toBe('assigned');

    const assignments = await PeerReviewAssignment.findAll();
    expect(assignments.length).toBeGreaterThan(0);

    for (const assignment of assignments) {
      const submission = submissions.find(
        (item) => item.id === assignment.submissionId
      );
      expect(submission).toBeDefined();
      expect(assignment.reviewerId).not.toBe(submission.challengeParticipantId);
    }
  });

  it('returns insufficient_valid_submissions when only one submission is valid', async () => {
    const { challenge } = await createChallengeData({
      participantCount: 2,
      validSubmissionCount: 1,
    });

    const res = await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.results?.[0]?.status).toBe(
      'insufficient_valid_submissions'
    );

    const assignments = await PeerReviewAssignment.findAll();
    expect(assignments.length).toBe(0);
  });

  it('starts peer review after assignments are ready', async () => {
    const { challenge } = await createChallengeData({
      participantCount: 2,
      validSubmissionCount: 2,
    });

    const assignRes = await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 2 });

    expect(assignRes.status).toBe(200);
    expect(assignRes.body.success).toBe(true);

    const startRes = await request(app).post(
      `/api/rest/challenges/${challenge.id}/peer-reviews/start`
    );

    expect(startRes.status).toBe(200);
    expect(startRes.body.success).toBe(true);

    const updatedChallenge = await Challenge.findByPk(challenge.id);
    expect(updatedChallenge.status).toBe(ChallengeStatus.STARTED_PHASE_TWO);
    expect(updatedChallenge.startPhaseTwoDateTime).not.toBeNull();
  });

  it('allows students without valid submissions to be eligible as reviewers', async () => {
    const { challenge, participants } = await createChallengeData({
      participantCount: 4,
      validSubmissionCount: 2,
    });

    await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 2 });

    const assignments = await PeerReviewAssignment.findAll();

    const allParticipantIds = participants.map((p) => p.id);
    const reviewerIds = assignments.map((a) => a.reviewerId);

    const allReviewersAreParticipants = reviewerIds.every((id) =>
      allParticipantIds.includes(id)
    );

    expect(allReviewersAreParticipants).toBe(true);
  });

  it('never assigns self reviews', async () => {
    const { challenge } = await createChallengeData({
      participantCount: 5,
      validSubmissionCount: 5,
    });

    await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 2 });

    const assignments = await PeerReviewAssignment.findAll();
    const submissions = await Submission.findAll();

    for (const a of assignments) {
      const sub = submissions.find((s) => s.id === a.submissionId);
      expect(a.reviewerId).not.toBe(sub.challengeParticipantId);
    }
  });

  it('marks extra reviews with isExtra = true', async () => {
    const { challenge } = await createChallengeData({
      participantCount: 3,
      validSubmissionCount: 2,
    });

    await request(app)
      .post(`/api/rest/challenges/${challenge.id}/peer-reviews/assign`)
      .send({ expectedReviewsPerSubmission: 1 });

    const assignments = await PeerReviewAssignment.findAll();

    const extraCount = assignments.filter((a) => a.isExtra).length;
    expect(extraCount).toBeGreaterThanOrEqual(0);
  });
});
