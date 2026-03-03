import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

const { mockExecuteCodeTests } = vi.hoisted(() => ({
  mockExecuteCodeTests: vi.fn().mockImplementation(async ({ testCases }) => ({
    testResults: Array.isArray(testCases)
      ? testCases.map((testCase, index) => ({
          testIndex: index,
          passed: true,
          exitCode: 0,
          stdout: '',
          stderr: '',
          expectedOutput: testCase?.expectedOutput ?? '',
          actualOutput: testCase?.expectedOutput ?? '',
          executionTime: 0,
        }))
      : [],
    summary: {
      total: Array.isArray(testCases) ? testCases.length : 0,
      passed: Array.isArray(testCases) ? testCases.length : 0,
      failed: 0,
      allPassed: true,
    },
    isCompiled: true,
    isPassed: true,
    errors: [],
  })),
}));
vi.mock('#root/services/execute-code-tests.js', () => ({
  executeCodeTests: (...args) => mockExecuteCodeTests(...args),
}));

const createUser = async (suffix) =>
  User.create({
    username: `student_${suffix}`,
    password: 'password123',
    email: `student_${suffix}@mail.com`,
    role: 'student',
  });

const createMatchSetting = async (suffix) =>
  MatchSetting.create({
    problemTitle: `Problem ${suffix}`,
    problemDescription: 'Solve the problem.',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [{ input: ['1'], output: '1' }],
    privateTests: [{ input: ['2'], output: '2' }],
    status: 'ready',
  });

const createChallengeWithSetting = async ({ status, suffix }) => {
  const matchSetting = await createMatchSetting(suffix);
  const challenge = await Challenge.create({
    title: `Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(Date.now() - 60 * 60 * 1000),
    endDatetime: new Date(Date.now() + 60 * 60 * 1000),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status,
  });
  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });
  return { challenge, matchSetting, challengeMatchSetting };
};

const createParticipantWithMatch = async ({
  challenge,
  challengeMatchSetting,
  student,
}) => {
  const participant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: student.id,
  });
  const match = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: participant.id,
  });
  return { participant, match };
};

const createSubmission = async ({
  match,
  participant,
  code,
  isFinal = true,
  publicTestResults = [],
  privateTestResults = [],
}) =>
  Submission.create({
    matchId: match.id,
    challengeParticipantId: participant.id,
    code,
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal,
    publicTestResults: JSON.stringify(publicTestResults),
    privateTestResults: JSON.stringify(privateTestResults),
  });

const resetTables = async () => {
  await PeerReviewAssignment.destroy({ where: {} });
  await Submission.destroy({ where: {} });
  await Match.destroy({ where: {} });
  await ChallengeParticipant.destroy({ where: {} });
  await ChallengeMatchSetting.destroy({ where: {} });
  await Challenge.destroy({ where: {} });
  await MatchSetting.destroy({ where: {} });
  await User.destroy({ where: {} });
};

describe('Student challenge endpoints', () => {
  beforeEach(async () => {
    vi.resetAllMocks();
    await resetTables();
  });

  afterEach(async () => {
    await resetTables();
  });

  describe('GET /api/rest/challenges/for-student', () => {
    it('returns challenges with joined status', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-list`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.PUBLIC,
        suffix: `${suffix}-c1`,
      });
      const { challenge: otherChallenge } = await createChallengeWithSetting({
        status: ChallengeStatus.STARTED_PHASE_ONE,
        suffix: `${suffix}-c2`,
      });

      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      const res = await request(app).get(
        `/api/rest/challenges/for-student?studentId=${student.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      const data = res.body.data || [];
      const joinedChallenge = data.find((item) => item.id === challenge.id);
      const otherItem = data.find((item) => item.id === otherChallenge.id);

      expect(joinedChallenge?.joined).toBe(true);
      expect(otherItem?.joined).toBe(false);
    });

    it('returns 400 for invalid studentId', async () => {
      const res = await request(app).get(
        '/api/rest/challenges/for-student?studentId=invalid'
      );

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/rest/challenges/:challengeId/custom-tests/run', () => {
    it('runs custom tests during the coding phase', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-custom`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.STARTED_PHASE_ONE,
        suffix: `${suffix}-custom`,
      });
      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      mockExecuteCodeTests.mockResolvedValue({
        testResults: [
          {
            testIndex: 0,
            passed: true,
            expectedOutput: '1',
            actualOutput: '1',
          },
        ],
        summary: { total: 1, passed: 1, failed: 0, allPassed: true },
        isCompiled: true,
        isPassed: true,
        errors: [],
      });

      const res = await request(app)
        .post(`/api/rest/challenges/${challenge.id}/custom-tests/run`)
        .send({
          studentId: student.id,
          code: 'int main() { return 0; }',
          tests: [{ input: '1', output: '1' }],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.results.length).toBe(1);
    });

    it('rejects custom tests when challenge is not in the coding phase', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-custom2`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.ENDED_PHASE_ONE,
        suffix: `${suffix}-custom2`,
      });
      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      const res = await request(app)
        .post(`/api/rest/challenges/${challenge.id}/custom-tests/run`)
        .send({
          studentId: student.id,
          code: 'int main() { return 0; }',
          tests: [{ input: '1', output: '1' }],
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects when no custom tests are provided', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-custom3`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.STARTED_PHASE_ONE,
        suffix: `${suffix}-custom3`,
      });
      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      const res = await request(app)
        .post(`/api/rest/challenges/${challenge.id}/custom-tests/run`)
        .send({
          studentId: student.id,
          code: 'int main() { return 0; }',
          tests: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('returns compile error details when compilation fails', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-custom4`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.STARTED_PHASE_ONE,
        suffix: `${suffix}-custom4`,
      });
      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      mockExecuteCodeTests.mockResolvedValue({
        testResults: [],
        summary: { total: 0, passed: 0, failed: 0, allPassed: false },
        isCompiled: false,
        isPassed: false,
        errors: [{ error: 'Compilation failed.' }],
      });

      const res = await request(app)
        .post(`/api/rest/challenges/${challenge.id}/custom-tests/run`)
        .send({
          studentId: student.id,
          code: 'int main() { return 0; }',
          tests: [{ input: '1', output: '1' }],
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toMatch(/Compilation failed/i);
    });
  });

  describe('POST /api/rest/challenges/:challengeId/peer-reviews/:assignmentId/tests', () => {
    it('saves feedback tests for the reviewer', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-reviewer`);
      const author = await createUser(`${suffix}-author`);
      const { challenge, challengeMatchSetting } =
        await createChallengeWithSetting({
          status: ChallengeStatus.STARTED_PHASE_TWO,
          suffix: `${suffix}-review`,
        });

      const { participant: authorParticipant, match } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student: author,
        });
      const { participant: reviewerParticipant } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student,
        });

      const submission = await createSubmission({
        match,
        participant: authorParticipant,
        code: 'int main() { return 0; }',
      });

      const assignment = await PeerReviewAssignment.create({
        submissionId: submission.id,
        reviewerId: reviewerParticipant.id,
        isExtra: false,
      });

      const res = await request(app)
        .post(
          `/api/rest/challenges/${challenge.id}/peer-reviews/${assignment.id}/tests`
        )
        .send({
          studentId: student.id,
          tests: [
            {
              input: '2 1',
              expectedOutput: '1 2',
              notes: 'Sort order',
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.feedbackTests.length).toBe(1);
    });

    it('rejects non-reviewers from saving tests', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-reviewer2`);
      const author = await createUser(`${suffix}-author2`);
      const outsider = await createUser(`${suffix}-outsider`);
      const { challenge, challengeMatchSetting } =
        await createChallengeWithSetting({
          status: ChallengeStatus.STARTED_PHASE_TWO,
          suffix: `${suffix}-review2`,
        });

      const { participant: authorParticipant, match } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student: author,
        });
      const { participant: reviewerParticipant } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student,
        });
      await createParticipantWithMatch({
        challenge,
        challengeMatchSetting,
        student: outsider,
      });

      const submission = await createSubmission({
        match,
        participant: authorParticipant,
        code: 'int main() { return 0; }',
      });

      const assignment = await PeerReviewAssignment.create({
        submissionId: submission.id,
        reviewerId: reviewerParticipant.id,
        isExtra: false,
      });

      const res = await request(app)
        .post(
          `/api/rest/challenges/${challenge.id}/peer-reviews/${assignment.id}/tests`
        )
        .send({
          studentId: outsider.id,
          tests: [{ input: '1', expectedOutput: '1' }],
        });

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/rest/challenges/:challengeId/results', () => {
    it('returns results for ended challenges', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-result`);
      const reviewer = await createUser(`${suffix}-reviewer`);
      const { challenge, challengeMatchSetting } =
        await createChallengeWithSetting({
          status: ChallengeStatus.ENDED_PHASE_TWO,
          suffix: `${suffix}-result`,
        });
      await challenge.update({
        endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000),
      });

      const { participant: participant, match } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student,
        });
      const { participant: reviewerParticipant, match: reviewerMatch } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student: reviewer,
        });

      const publicTestResults = [
        {
          testIndex: 0,
          passed: true,
          expectedOutput: '1',
          actualOutput: '1',
        },
      ];
      const privateTestResults = [
        {
          testIndex: 0,
          passed: true,
          expectedOutput: '1',
          actualOutput: '1',
        },
      ];
      const studentSubmission = await createSubmission({
        match,
        participant,
        code: 'int main() { return 0; }',
        publicTestResults,
        privateTestResults,
      });
      await createSubmission({
        match: reviewerMatch,
        participant: reviewerParticipant,
        code: 'int main() { return 1; }',
      });

      await PeerReviewAssignment.create({
        submissionId: studentSubmission.id,
        reviewerId: reviewerParticipant.id,
        feedbackTests: [
          { input: '3 2', expectedOutput: '2 3', notes: 'Sort check' },
        ],
      });

      const res = await request(app).get(
        `/api/rest/challenges/${challenge.id}/results?studentId=${student.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentSubmission.publicTestResults.length).toBe(1);
      expect(res.body.data.studentSubmission.privateTestResults.length).toBe(1);
      expect(res.body.data.otherSubmissions.length).toBeGreaterThan(0);
      expect(res.body.data.peerReviewTests.length).toBeGreaterThan(0);
    });

    it('hides other submissions until the challenge fully ends', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-result-phase-one`);
      const reviewer = await createUser(`${suffix}-result-peer`);
      const { challenge, challengeMatchSetting } =
        await createChallengeWithSetting({
          status: ChallengeStatus.ENDED_PHASE_ONE,
          suffix: `${suffix}-result-phase-one`,
        });

      const { participant, match } = await createParticipantWithMatch({
        challenge,
        challengeMatchSetting,
        student,
      });
      const { participant: reviewerParticipant, match: reviewerMatch } =
        await createParticipantWithMatch({
          challenge,
          challengeMatchSetting,
          student: reviewer,
        });

      const studentSubmission = await createSubmission({
        match,
        participant,
        code: 'int main() { return 0; }',
      });
      await createSubmission({
        match: reviewerMatch,
        participant: reviewerParticipant,
        code: 'int main() { return 1; }',
      });

      await PeerReviewAssignment.create({
        submissionId: studentSubmission.id,
        reviewerId: reviewerParticipant.id,
        feedbackTests: [{ input: '1', expectedOutput: '1' }],
      });

      const res = await request(app).get(
        `/api/rest/challenges/${challenge.id}/results?studentId=${student.id}`
      );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentSubmission).toBeTruthy();
      expect(res.body.data.otherSubmissions).toEqual([]);
      expect(res.body.data.peerReviewTests).toEqual([]);
    });

    it('rejects results when challenge has not ended', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-result2`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.STARTED_PHASE_ONE,
        suffix: `${suffix}-result2`,
      });
      await ChallengeParticipant.create({
        challengeId: challenge.id,
        studentId: student.id,
      });

      const res = await request(app).get(
        `/api/rest/challenges/${challenge.id}/results?studentId=${student.id}`
      );

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('rejects results when student is not a participant', async () => {
      const suffix = Date.now();
      const student = await createUser(`${suffix}-result3`);
      const { challenge } = await createChallengeWithSetting({
        status: ChallengeStatus.ENDED_PHASE_ONE,
        suffix: `${suffix}-result3`,
      });

      const res = await request(app).get(
        `/api/rest/challenges/${challenge.id}/results?studentId=${student.id}`
      );

      expect(res.status).toBe(403);
      expect(res.body.success).toBe(false);
    });
  });
});
