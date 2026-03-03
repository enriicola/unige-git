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
import PeerReviewVote from '#root/models/peer-review-vote.js';
import User from '#root/models/user.js';
import {
  ChallengeStatus,
  SubmissionStatus,
  VoteType,
} from '#root/models/enum/enums.js';

const createExitTestScenario = async ({
  participantCount = 3,
  assignmentsPerReviewer = 2,
  existingVotes = [],
}) => {
  const suffix = Date.now() + Math.floor(Math.random() * 1000);

  const matchSetting = await MatchSetting.create({
    problemTitle: `Exit Test Problem ${suffix}`,
    problemDescription: 'Test problem for exit endpoint',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [{ input: ['1'], output: '1' }],
    privateTests: [{ input: ['2'], output: '2' }],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Exit Test Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(Date.now() - 60 * 60 * 1000),
    endDatetime: new Date(Date.now() + 60 * 60 * 1000),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.STARTED_PHASE_TWO,
    startPhaseTwoDateTime: new Date(Date.now() - 5 * 60 * 1000),
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const users = [];
  const participants = [];
  const matches = [];
  const submissions = [];
  const assignments = [];

  for (let i = 0; i < participantCount; i += 1) {
    const user = await User.create({
      username: `student_${suffix}_${i}`,
      password: 'password123',
      email: `student_${suffix}_${i}@mail.com`,
      role: 'student',
    });
    users.push(user);

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

    const submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: participant.id,
      code: `int main() { return ${i}; }`,
      status: SubmissionStatus.PROBABLY_CORRECT,
      isFinal: true,
    });
    submissions.push(submission);
  }

  const reviewer = participants[0];
  const otherParticipants = participants.slice(1);

  for (let i = 0; i < assignmentsPerReviewer; i += 1) {
    if (i < otherParticipants.length) {
      const submission = submissions[i + 1];
      const assignment = await PeerReviewAssignment.create({
        submissionId: submission.id,
        reviewerId: reviewer.id,
        isExtra: false,
      });
      assignments.push(assignment);
    }
  }

  for (const voteData of existingVotes) {
    const assignment = assignments.find(
      (a) => a.submissionId === voteData.submissionId
    );
    if (assignment) {
      await PeerReviewVote.create({
        peerReviewAssignmentId: assignment.id,
        vote: voteData.vote,
        testCaseInput: voteData.testCaseInput || null,
        expectedOutput: voteData.expectedOutput || null,
      });
    }
  }

  return {
    challenge,
    matchSetting,
    challengeMatchSetting,
    users,
    participants,
    matches,
    submissions,
    assignments,
    reviewer,
  };
};

describe('Peer Review Exit API', () => {
  beforeEach(async () => {
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

  describe('POST /api/rest/peer-review/exit', () => {
    it('should reject request without challengeId', async () => {
      const res = await request(app).post('/api/rest/peer-review/exit').send({
        studentId: 1,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('challengeId is required');
    });

    it('should reject request without studentId', async () => {
      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: 1,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('studentId is required');
    });

    it('should reject request for non-existent challenge', async () => {
      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: 99999,
        studentId: 1,
      });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Challenge not found');
    });

    it('should reject request when challenge is not in STARTED_PHASE_TWO', async () => {
      const { challenge, reviewer } = await createExitTestScenario({
        participantCount: 3,
        assignmentsPerReviewer: 2,
      });

      await challenge.update({ status: ChallengeStatus.ENDED_PHASE_TWO });

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
      });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Peer review phase must be active to exit');
    });

    it('should reject request for non-existent participant', async () => {
      const { challenge } = await createExitTestScenario({
        participantCount: 3,
        assignmentsPerReviewer: 2,
      });

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: 99999,
      });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Participant not found');
    });

    it('should create abstain votes for all unvoted assignments', async () => {
      const { challenge, reviewer, assignments } = await createExitTestScenario(
        {
          participantCount: 3,
          assignmentsPerReviewer: 2,
        }
      );

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(0);
      expect(res.body.data.abstainVotesCreated).toBe(assignments.length);

      const votes = await PeerReviewVote.findAll({
        where: {
          peerReviewAssignmentId: assignments.map((a) => a.id),
        },
      });

      expect(votes.length).toBe(assignments.length);
      votes.forEach((vote) => {
        expect(vote.vote).toBe(VoteType.ABSTAIN);
        expect(vote.testCaseInput).toBeNull();
        expect(vote.expectedOutput).toBeNull();
      });
    });

    it('should save votes from request and create abstain for unvoted', async () => {
      const { challenge, reviewer, assignments, submissions } =
        await createExitTestScenario({
          participantCount: 3,
          assignmentsPerReviewer: 2,
        });

      const votesToSubmit = [
        {
          submissionId: submissions[1].id,
          vote: VoteType.CORRECT,
        },
      ];

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
        votes: votesToSubmit,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(1);
      expect(res.body.data.abstainVotesCreated).toBe(assignments.length - 1);

      const allVotes = await PeerReviewVote.findAll({
        where: {
          peerReviewAssignmentId: assignments.map((a) => a.id),
        },
      });

      expect(allVotes.length).toBe(assignments.length);

      const correctVote = allVotes.find((v) =>
        assignments.find(
          (a) =>
            a.id === v.peerReviewAssignmentId &&
            a.submissionId === submissions[1].id
        )
      );
      expect(correctVote).toBeDefined();
      expect(correctVote.vote).toBe(VoteType.CORRECT);

      const abstainVotes = allVotes.filter((v) => v.vote === VoteType.ABSTAIN);
      expect(abstainVotes.length).toBe(assignments.length - 1);
    });

    it('should update existing votes when provided in request', async () => {
      const scenario = await createExitTestScenario({
        participantCount: 3,
        assignmentsPerReviewer: 2,
      });

      const { challenge, reviewer, assignments, submissions } = scenario;

      const existingAssignment = assignments.find(
        (a) => a.submissionId === submissions[1].id
      );

      await PeerReviewVote.create({
        peerReviewAssignmentId: existingAssignment.id,
        vote: VoteType.CORRECT,
      });

      const votesToSubmit = [
        {
          submissionId: submissions[1].id,
          vote: VoteType.INCORRECT,
          testCaseInput: '[1, 2]',
          expectedOutput: '[3]',
        },
      ];

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
        votes: votesToSubmit,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(1);

      const updatedVote = await PeerReviewVote.findOne({
        where: {
          peerReviewAssignmentId: assignments.find(
            (a) => a.submissionId === submissions[1].id
          ).id,
        },
      });

      expect(updatedVote).toBeDefined();
      expect(updatedVote.vote).toBe(VoteType.INCORRECT);
      expect(updatedVote.testCaseInput).toBe('[1, 2]');
      expect(updatedVote.expectedOutput).toBe('[3]');
    });

    it('should handle multiple votes correctly', async () => {
      const { challenge, reviewer, assignments, submissions } =
        await createExitTestScenario({
          participantCount: 4,
          assignmentsPerReviewer: 3,
        });

      const votesToSubmit = [
        {
          submissionId: submissions[1].id,
          vote: VoteType.CORRECT,
        },
        {
          submissionId: submissions[2].id,
          vote: VoteType.INCORRECT,
          testCaseInput: '[5, 6]',
          expectedOutput: '[11]',
        },
        {
          submissionId: submissions[3].id,
          vote: VoteType.ABSTAIN,
        },
      ];

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
        votes: votesToSubmit,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(3);
      expect(res.body.data.abstainVotesCreated).toBe(assignments.length - 3);

      const allVotes = await PeerReviewVote.findAll({
        where: {
          peerReviewAssignmentId: assignments.map((a) => a.id),
        },
      });

      expect(allVotes.length).toBe(assignments.length);

      const correctVote = allVotes.find((v) =>
        assignments.find(
          (a) =>
            a.id === v.peerReviewAssignmentId &&
            a.submissionId === submissions[1].id
        )
      );
      expect(correctVote.vote).toBe(VoteType.CORRECT);

      const incorrectVote = allVotes.find((v) =>
        assignments.find(
          (a) =>
            a.id === v.peerReviewAssignmentId &&
            a.submissionId === submissions[2].id
        )
      );
      expect(incorrectVote.vote).toBe(VoteType.INCORRECT);
      expect(incorrectVote.testCaseInput).toBe('[5, 6]');
      expect(incorrectVote.expectedOutput).toBe('[11]');

      const abstainVote = allVotes.find((v) =>
        assignments.find(
          (a) =>
            a.id === v.peerReviewAssignmentId &&
            a.submissionId === submissions[3].id
        )
      );
      expect(abstainVote.vote).toBe(VoteType.ABSTAIN);
    });

    it('should ignore votes for assignments not assigned to reviewer', async () => {
      const { challenge, reviewer, assignments, submissions } =
        await createExitTestScenario({
          participantCount: 3,
          assignmentsPerReviewer: 2,
        });

      const votesToSubmit = [
        {
          submissionId: submissions[0].id,
          vote: VoteType.CORRECT,
        },
        {
          submissionId: submissions[1].id,
          vote: VoteType.CORRECT,
        },
      ];

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
        votes: votesToSubmit,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const allVotes = await PeerReviewVote.findAll({
        where: {
          peerReviewAssignmentId: assignments.map((a) => a.id),
        },
      });

      const validVoteCount = allVotes.filter((v) =>
        assignments.some(
          (a) =>
            a.id === v.peerReviewAssignmentId &&
            a.submissionId === submissions[1].id
        )
      ).length;

      expect(validVoteCount).toBe(1);
    });

    it('should handle empty votes array', async () => {
      const { challenge, reviewer, assignments } = await createExitTestScenario(
        {
          participantCount: 3,
          assignmentsPerReviewer: 2,
        }
      );

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
        votes: [],
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(0);
      expect(res.body.data.abstainVotesCreated).toBe(assignments.length);
    });

    it('should handle missing votes field', async () => {
      const { challenge, reviewer, assignments } = await createExitTestScenario(
        {
          participantCount: 3,
          assignmentsPerReviewer: 2,
        }
      );

      const res = await request(app).post('/api/rest/peer-review/exit').send({
        challengeId: challenge.id,
        studentId: reviewer.studentId,
      });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.votesSaved).toBe(0);
      expect(res.body.data.abstainVotesCreated).toBe(assignments.length);
    });
  });
});
