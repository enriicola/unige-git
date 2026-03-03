/**
 * RT-181: Integration tests for complete voting flow
 *
 * Tests the end-to-end voting process including:
 * - Complete voting flow for all vote types
 * - Vote persistence in database
 * - Vote update (changing votes)
 * - Multiple votes across different submissions
 * - Vote retrieval API
 */

import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  beforeAll,
  vi,
} from 'vitest';
import Challenge from '#root/models/challenge.js';
import MatchSetting from '#root/models/match-setting.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Match from '#root/models/match.js';
import Submission from '#root/models/submission.js';
import User from '#root/models/user.js';
import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import { ChallengeStatus, SubmissionStatus } from '#root/models/enum/enums.js';
import initModels from '#root/models/init-models.js';
import { submitVote } from '#root/services/peer-review-submit-vote.js';

// Mock execute-code-tests module
vi.mock('#root/services/execute-code-tests.js');
import { executeCodeTests } from '#root/services/execute-code-tests.js';

const createMultipleAssignmentsScenario = async () => {
  const suffix = Date.now() + Math.floor(Math.random() * 1000);

  const matchSetting = await MatchSetting.create({
    problemTitle: `Integration Test Problem ${suffix}`,
    problemDescription: 'Integration test description',
    referenceSolution: 'function solve(arr) { return arr; }',
    publicTests: [
      { input: '[1, 2]', output: '[1, 2]' },
      { input: '[3, 4]', output: '[3, 4]' },
    ],
    privateTests: [],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Integration Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(),
    endDatetime: new Date(),
    durationPeerReview: 20,
    allowedNumberOfReview: 3,
    status: ChallengeStatus.STARTED_PHASE_TWO,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const reviewer = await User.create({
    username: `reviewer_${suffix}`,
    password: 'pw',
    email: `reviewer_${suffix}@mail.com`,
    role: 'student',
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewer.id,
  });

  // Create 3 submissions from different authors
  const assignments = [];
  for (let i = 1; i <= 3; i++) {
    const author = await User.create({
      username: `author_${suffix}_${i}`,
      password: 'pw',
      email: `author_${suffix}_${i}@mail.com`,
      role: 'student',
    });

    const authorParticipant = await ChallengeParticipant.create({
      challengeId: challenge.id,
      studentId: author.id,
    });

    const match = await Match.create({
      challengeMatchSettingId: challengeMatchSetting.id,
      challengeParticipantId: authorParticipant.id,
    });

    const submission = await Submission.create({
      matchId: match.id,
      challengeParticipantId: authorParticipant.id,
      code: `function solve(arr) { return arr; } // Solution ${i}`,
      status: SubmissionStatus.PROBABLY_CORRECT,
      isFinal: true,
    });

    const assignment = await PeerReviewAssignment.create({
      submissionId: submission.id,
      reviewerId: reviewerParticipant.id,
      isExtra: false,
    });

    assignments.push(assignment);
  }

  return {
    reviewer,
    assignments,
    matchSetting,
  };
};

describe('RT-181: Complete Voting Flow Integration Tests', () => {
  beforeAll(async () => {
    await initModels.init();
  });

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

    vi.clearAllMocks();
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

    vi.restoreAllMocks();
  });

  describe('Complete voting workflow', () => {
    it('allows reviewer to vote on all assigned submissions', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Mock code runner for incorrect votes
      vi.mocked(executeCodeTests).mockResolvedValue({
        testResults: [
          {
            passed: false,
            actualOutput: '[1]',
            exitCode: 0,
          },
        ],
      });

      // Vote Correct on first submission
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'correct',
      });

      // Vote Incorrect on second submission
      await submitVote(reviewer.id, assignments[1].id, {
        vote: 'incorrect',
        testCaseInput: '[5, 6]',
        expectedOutput: '[10]',
      });

      // Vote Abstain on third submission
      await submitVote(reviewer.id, assignments[2].id, {
        vote: 'abstain',
      });

      // Verify all votes were created
      const votes = await PeerReviewVote.findAll({
        order: [['peerReviewAssignmentId', 'ASC']],
      });

      expect(votes).toHaveLength(3);
      expect(votes[0].vote).toBe('correct');
      expect(votes[0].testCaseInput).toBeNull();
      expect(votes[0].expectedOutput).toBeNull();

      expect(votes[1].vote).toBe('incorrect');
      expect(votes[1].testCaseInput).toBe('[5, 6]');
      expect(votes[1].expectedOutput).toBe('[10]');

      expect(votes[2].vote).toBe('abstain');
      expect(votes[2].testCaseInput).toBeNull();
      expect(votes[2].expectedOutput).toBeNull();
    });

    it('allows changing a vote from Correct to Incorrect', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Initially vote Correct
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'correct',
      });

      let vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(vote.vote).toBe('correct');

      // Change to Incorrect
      vi.mocked(executeCodeTests).mockResolvedValue({
        testResults: [
          {
            passed: false,
            actualOutput: '[1, 2]',
            exitCode: 0,
          },
        ],
      });

      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'incorrect',
        testCaseInput: '[5, 6]',
        expectedOutput: '[11]',
      });

      vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      expect(vote.vote).toBe('incorrect');
      expect(vote.testCaseInput).toBe('[5, 6]');
      expect(vote.expectedOutput).toBe('[11]');

      // Verify only one vote exists (updated, not duplicated)
      const allVotes = await PeerReviewVote.findAll({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(allVotes).toHaveLength(1);
    });

    it('allows changing a vote from Incorrect to Abstain', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Initially vote Incorrect
      vi.mocked(executeCodeTests).mockResolvedValue({
        testResults: [
          {
            passed: false,
            actualOutput: '[1]',
            exitCode: 0,
          },
        ],
      });

      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'incorrect',
        testCaseInput: '[5, 6]',
        expectedOutput: '[11]',
      });

      let vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(vote.vote).toBe('incorrect');

      // Change to Abstain
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'abstain',
      });

      vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      expect(vote.vote).toBe('abstain');
      expect(vote.testCaseInput).toBeNull();
      expect(vote.expectedOutput).toBeNull();

      // Verify only one vote exists
      const allVotes = await PeerReviewVote.findAll({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(allVotes).toHaveLength(1);
    });

    it('allows changing a vote from Abstain to Correct', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Initially vote Abstain
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'abstain',
      });

      let vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(vote.vote).toBe('abstain');

      // Change to Correct
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'correct',
      });

      vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      expect(vote.vote).toBe('correct');

      // Verify only one vote exists
      const allVotes = await PeerReviewVote.findAll({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(allVotes).toHaveLength(1);
    });

    it('clears test case fields when changing from Incorrect to Correct', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Vote Incorrect with test case
      vi.mocked(executeCodeTests).mockResolvedValue({
        testResults: [
          {
            passed: false,
            actualOutput: '[1]',
            exitCode: 0,
          },
        ],
      });

      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'incorrect',
        testCaseInput: '[5, 6]',
        expectedOutput: '[11]',
      });

      let vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(vote.testCaseInput).toBe('[5, 6]');
      expect(vote.expectedOutput).toBe('[11]');

      // Change to Correct
      await submitVote(reviewer.id, assignments[0].id, {
        vote: 'correct',
      });

      vote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      expect(vote.vote).toBe('correct');
      expect(vote.testCaseInput).toBeNull();
      expect(vote.expectedOutput).toBeNull();
    });
  });

  describe('Vote persistence and retrieval', () => {
    it('persists votes across multiple submissions', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      vi.mocked(executeCodeTests).mockResolvedValue({
        testResults: [
          {
            passed: false,
            actualOutput: '[1]',
            exitCode: 0,
          },
        ],
      });

      // Vote on all submissions
      await submitVote(reviewer.id, assignments[0].id, { vote: 'correct' });
      await submitVote(reviewer.id, assignments[1].id, {
        vote: 'incorrect',
        testCaseInput: '[7, 8]',
        expectedOutput: '[15]',
      });
      await submitVote(reviewer.id, assignments[2].id, { vote: 'abstain' });

      // Retrieve all votes
      const votes = await PeerReviewVote.findAll({
        include: [
          {
            model: PeerReviewAssignment,
            as: 'assignment',
          },
        ],
        order: [['peerReviewAssignmentId', 'ASC']],
      });

      expect(votes).toHaveLength(3);

      // Verify each vote is correctly associated
      expect(votes[0].assignment.id).toBe(assignments[0].id);
      expect(votes[0].vote).toBe('correct');

      expect(votes[1].assignment.id).toBe(assignments[1].id);
      expect(votes[1].vote).toBe('incorrect');

      expect(votes[2].assignment.id).toBe(assignments[2].id);
      expect(votes[2].vote).toBe('abstain');
    });

    // --- HO AGGIUNTO IL TIMEOUT QUI SOTTO (20000) ---
    it('maintains vote timestamps on creation and update', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Create initial vote
      await submitVote(reviewer.id, assignments[0].id, { vote: 'correct' });

      const initialVote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      expect(initialVote.createdAt).toBeDefined();
      expect(initialVote.updatedAt).toBeDefined();

      const createdAt = initialVote.createdAt;

      // Wait a bit to ensure different timestamp
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Update vote
      await submitVote(reviewer.id, assignments[0].id, { vote: 'abstain' });

      const updatedVote = await PeerReviewVote.findOne({
        where: { peerReviewAssignmentId: assignments[0].id },
      });

      // CreatedAt should remain the same
      expect(updatedVote.createdAt.getTime()).toBe(createdAt.getTime());

      // UpdatedAt should be different
      expect(updatedVote.updatedAt.getTime()).toBeGreaterThan(
        createdAt.getTime()
      );
    }, 20000);
  });

  describe('Validation enforcement', () => {
    it('rejects voting after peer review phase ends', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Update challenge status to ended
      const assignment = await PeerReviewAssignment.findByPk(
        assignments[0].id,
        {
          include: [
            {
              model: Submission,
              as: 'submission',
              include: [
                {
                  model: Match,
                  as: 'match',
                  include: [
                    {
                      model: ChallengeMatchSetting,
                      as: 'challengeMatchSetting',
                    },
                  ],
                },
              ],
            },
          ],
        }
      );

      const challengeId =
        assignment.submission.match.challengeMatchSetting.challengeId;
      await Challenge.update(
        { status: ChallengeStatus.ENDED_PHASE_TWO },
        { where: { id: challengeId } }
      );

      // Attempt to vote
      await expect(
        submitVote(reviewer.id, assignments[0].id, { vote: 'correct' })
      ).rejects.toThrow(/Peer review phase has ended/i);

      // Verify no vote was created
      const votes = await PeerReviewVote.count({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(votes).toBe(0);
    });

    it('rejects voting by non-assigned reviewer', async () => {
      const { assignments } = await createMultipleAssignmentsScenario();

      // Create a different user
      const otherUser = await User.create({
        username: 'other_user',
        password: 'pw',
        email: 'other@mail.com',
        role: 'student',
      });

      // Attempt to vote as different user
      await expect(
        submitVote(otherUser.id, assignments[0].id, { vote: 'correct' })
      ).rejects.toThrow(/not the assigned reviewer/i);

      // Verify no vote was created
      const votes = await PeerReviewVote.count({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(votes).toBe(0);
    });

    it('rejects incorrect vote with public test case input', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // Attempt to use public test case ([1, 2] is in publicTests)
      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: '[1, 2]',
          expectedOutput: '[3]',
        })
      ).rejects.toThrow(/public test/i);

      // Verify no vote was created
      const votes = await PeerReviewVote.count({
        where: { peerReviewAssignmentId: assignments[0].id },
      });
      expect(votes).toBe(0);
    });

    it('rejects incorrect vote with empty input field', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: '   ',
          expectedOutput: '[3]',
        })
      ).rejects.toThrow(/won't count/i);
    });

    it('rejects incorrect vote with empty output field', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: '[1, 2]',
          expectedOutput: '',
        })
      ).rejects.toThrow(/won't count/i);
    });

    it('rejects incorrect vote with invalid JSON in input', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: 'not json',
          expectedOutput: '[3]',
        })
      ).rejects.toThrow(/valid array values/i);
    });

    it('rejects incorrect vote with non-array JSON in output', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: '[1, 2]',
          expectedOutput: '{"result": 3}',
        })
      ).rejects.toThrow(/valid array values/i);
    });

    it('rejects incorrect vote with empty array input', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      await expect(
        submitVote(reviewer.id, assignments[0].id, {
          vote: 'incorrect',
          testCaseInput: '[]',
          expectedOutput: '[3]',
        })
      ).rejects.toThrow(/empty/i);
    });
  });

  describe('Progress tracking', () => {
    it('counts votes correctly for progress calculation', async () => {
      const { reviewer, assignments } =
        await createMultipleAssignmentsScenario();

      // No votes initially
      let voteCount = await PeerReviewVote.count();
      expect(voteCount).toBe(0);

      // Vote on first submission
      await submitVote(reviewer.id, assignments[0].id, { vote: 'correct' });

      voteCount = await PeerReviewVote.count();
      expect(voteCount).toBe(1);

      // Vote on second submission
      await submitVote(reviewer.id, assignments[1].id, { vote: 'abstain' });

      voteCount = await PeerReviewVote.count();
      expect(voteCount).toBe(2);

      // Vote on third submission (changing a vote shouldn't increase count)
      await submitVote(reviewer.id, assignments[0].id, { vote: 'abstain' });

      voteCount = await PeerReviewVote.count();
      expect(voteCount).toBe(2); // Still 2, vote was updated not added
    });
  });
});
