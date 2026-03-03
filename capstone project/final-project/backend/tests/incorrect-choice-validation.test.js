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

// Mock execute-code-tests module before importing submitVote
vi.mock('#root/services/execute-code-tests.js');

import { submitVote } from '#root/services/peer-review-submit-vote.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';

/*
 * RT-162: For incorrect choice - Test the input test case against the code runner and output to validate
 */

const createVotingScenario = async () => {
  const suffix = Date.now() + Math.floor(Math.random() * 1000);

  const matchSetting = await MatchSetting.create({
    problemTitle: `Vote Problem ${suffix}`,
    problemDescription: 'Desc',
    referenceSolution: 'int main() { return 0; }',
    publicTests: [],
    privateTests: [],
    status: 'ready',
  });

  const challenge = await Challenge.create({
    title: `Vote Challenge ${suffix}`,
    duration: 30,
    startDatetime: new Date(),
    endDatetime: new Date(),
    durationPeerReview: 20,
    allowedNumberOfReview: 2,
    status: ChallengeStatus.STARTED_PHASE_TWO,
  });

  const challengeMatchSetting = await ChallengeMatchSetting.create({
    challengeId: challenge.id,
    matchSettingId: matchSetting.id,
  });

  const author = await User.create({
    username: `author_${suffix}`,
    password: 'pw',
    email: `author_${suffix}@mail.com`,
    role: 'student',
  });

  const reviewer = await User.create({
    username: `reviewer_${suffix}`,
    password: 'pw',
    email: `reviewer_${suffix}@mail.com`,
    role: 'student',
  });

  const authorParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: author.id,
  });

  const reviewerParticipant = await ChallengeParticipant.create({
    challengeId: challenge.id,
    studentId: reviewer.id,
  });

  const match = await Match.create({
    challengeMatchSettingId: challengeMatchSetting.id,
    challengeParticipantId: authorParticipant.id,
  });

  const submission = await Submission.create({
    matchId: match.id,
    challengeParticipantId: authorParticipant.id,
    code: 'function solve(nums) { return nums[0]; }', // Intentionally incorrect code
    status: SubmissionStatus.PROBABLY_CORRECT,
    isFinal: true,
  });

  const assignment = await PeerReviewAssignment.create({
    submissionId: submission.id,
    reviewerId: reviewerParticipant.id,
    isExtra: false,
  });

  return {
    assignment,
    reviewer,
    authorParticipant,
    reviewerParticipant,
    submission,
    matchSetting,
  };
};

describe('RT-162: Incorrect Choice Validation with Code Runner', () => {
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

    // Clear all mocks before each test
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

  it('rejects invalid test case that actually passes the submitted code', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    // Mock the code runner to indicate the test case passes
    vi.mocked(executeCodeTests).mockResolvedValue({
      testResults: [
        {
          passed: true, // The code passes this test case - so voting "incorrect" is invalid
          actualOutput: '1',
          exitCode: 0,
        },
      ],
    });

    // Try to vote "incorrect" with a test case that the code actually passes
    await expect(
      submitVote(reviewer.id, assignment.id, {
        vote: 'incorrect',
        testCaseInput: '[1, 2, 3]',
        expectedOutput: '[1]',
      })
    ).rejects.toThrow(
      /actually passes with the provided expected output|code is correct/i
    );

    // Verify no vote was created
    const votesCreated = await PeerReviewVote.count({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(votesCreated).toBe(0);
  });

  it('rejects test case when code has compilation/runtime error', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    // Mock code runner showing compilation error
    vi.mocked(executeCodeTests).mockResolvedValue({
      testResults: [
        {
          passed: false,
          actualOutput: '', // Empty output from error
          exitCode: 1, // Non-zero exit code
          stderr: 'Compilation error',
        },
      ],
    });

    // Try to vote "incorrect" but code has compilation error
    await expect(
      submitVote(reviewer.id, assignment.id, {
        vote: 'incorrect',
        testCaseInput: '[1, 2, 3]',
        expectedOutput: '[3, 2, 1]',
      })
    ).rejects.toThrow(/compilation error|runtime error|may not be valid/i);

    const votesCreated = await PeerReviewVote.count({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(votesCreated).toBe(0);
  });

  it('allows voting "incorrect" when test case correctly exposes a bug', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    // Mock code runner showing test case fails
    vi.mocked(executeCodeTests).mockResolvedValue({
      testResults: [
        {
          passed: false, // Test case fails - vote is valid
          actualOutput: '1',
          exitCode: 0, // Code compiled successfully
        },
      ],
    });

    // Vote "incorrect" with a valid test case
    const result = await submitVote(reviewer.id, assignment.id, {
      vote: 'incorrect',
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '[3, 2, 1]',
    });

    expect(result).toBe(true);

    // Verify vote was created
    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote).toBeDefined();
    expect(vote.vote).toBe('incorrect');
    expect(vote.testCaseInput).toBe('[1, 2, 3]');
    expect(vote.expectedOutput).toBe('[3, 2, 1]');
  });

  it('allows voting "correct" without code runner validation', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    // Code runner should not be called for "correct" votes
    const result = await submitVote(reviewer.id, assignment.id, {
      vote: 'correct',
    });

    expect(result).toBe(true);

    // Verify code runner was not invoked
    expect(vi.mocked(executeCodeTests)).not.toHaveBeenCalled();

    // Verify vote was created
    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote).toBeDefined();
    expect(vote.vote).toBe('correct');
  });

  it('allows voting "abstain" without code runner validation', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    const result = await submitVote(reviewer.id, assignment.id, {
      vote: 'abstain',
    });

    expect(result).toBe(true);

    // Verify code runner was not invoked
    expect(vi.mocked(executeCodeTests)).not.toHaveBeenCalled();

    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote).toBeDefined();
    expect(vote.vote).toBe('abstain');
  });

  it('gracefully handles code runner errors and logs them', async () => {
    const { assignment, reviewer } = await createVotingScenario();

    // Mock code runner throwing an error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    vi.mocked(executeCodeTests).mockRejectedValue(
      new Error('Code runner service unavailable')
    );

    // Vote should still be allowed (graceful degradation)
    const result = await submitVote(reviewer.id, assignment.id, {
      vote: 'incorrect',
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '[3, 2, 1]',
    });

    expect(result).toBe(true);

    // Verify error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error validating test case'),
      expect.any(Error)
    );

    // Verify vote was created despite code runner error
    const vote = await PeerReviewVote.findOne({
      where: { peerReviewAssignmentId: assignment.id },
    });
    expect(vote).toBeDefined();
    expect(vote.vote).toBe('incorrect');

    consoleErrorSpy.mockRestore();
  });

  it('validates code runner was called with correct parameters', async () => {
    const { assignment, reviewer, submission } = await createVotingScenario();

    vi.mocked(executeCodeTests).mockResolvedValue({
      testResults: [
        {
          passed: false,
          actualOutput: '1',
          exitCode: 0,
        },
      ],
    });

    await submitVote(reviewer.id, assignment.id, {
      vote: 'incorrect',
      testCaseInput: '[1, 2, 3]',
      expectedOutput: '[3, 2, 1]',
    });

    // Verify code runner was called with submission code and correct parameters
    expect(vi.mocked(executeCodeTests)).toHaveBeenCalledWith({
      code: submission.code,
      testCases: [
        {
          input: [1, 2, 3],
          output: '[3, 2, 1]',
        },
      ],
    });
  });
});
