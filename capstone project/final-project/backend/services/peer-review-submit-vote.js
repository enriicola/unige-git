import PeerReviewAssignment from '#root/models/peer_review_assignment.js';
import PeerReviewVote from '#root/models/peer-review-vote.js';
import ChallengeParticipant from '#root/models/challenge-participant.js';
import Submission from '#root/models/submission.js';
import Match from '#root/models/match.js';
import ChallengeMatchSetting from '#root/models/challenge-match-setting.js';
import MatchSetting from '#root/models/match-setting.js';
import Challenge from '#root/models/challenge.js';
import { ChallengeStatus } from '#root/models/enum/enums.js';
import { executeCodeTests } from '#root/services/execute-code-tests.js';

export const submitVote = async (
  userId,
  assignmentId,
  { vote, testCaseInput, expectedOutput }
) => {
  const validVotes = ['correct', 'incorrect', 'abstain'];
  if (!validVotes.includes(vote)) {
    const error = new Error('Invalid vote type');
    error.code = 'INVALID_INPUT';
    throw error;
  }

  const assignment = await PeerReviewAssignment.findByPk(assignmentId, {
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
                include: [
                  {
                    model: MatchSetting,
                    as: 'matchSetting',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        model: ChallengeParticipant,
        as: 'reviewer',
      },
    ],
  });

  if (!assignment) {
    const error = new Error('Assignment not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const challengeId =
    assignment.submission?.match?.challengeMatchSetting?.challengeId;

  if (!challengeId) {
    const error = new Error('Challenge not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  const challenge = await Challenge.findByPk(challengeId);

  if (!challenge) {
    const error = new Error('Challenge not found');
    error.code = 'NOT_FOUND';
    throw error;
  }

  if (challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
    const error = new Error('Peer review phase has ended');
    error.code = 'FORBIDDEN';
    throw error;
  }

  if (String(assignment.reviewer.studentId) !== String(userId)) {
    const error = new Error(
      'You are not the assigned reviewer for this solution'
    );
    error.code = 'FORBIDDEN';
    throw error;
  }

  let cleanInput = null;
  let cleanOutput = null;

  if (vote === 'incorrect') {
    if (!testCaseInput?.trim() || !expectedOutput?.trim()) {
      const error = new Error(
        "This vote won't count until you provide both input and expected output"
      );
      error.code = 'INVALID_INPUT';
      throw error;
    }

    let inputJson, outputJson;
    try {
      inputJson = JSON.parse(testCaseInput);
      outputJson = JSON.parse(expectedOutput);
    } catch (e) {
      const error = new Error(
        'Input and output must be valid array values (e.g., [1,2]).'
      );
      error.code = 'INVALID_INPUT';
      throw error;
    }

    if (!Array.isArray(inputJson) || !Array.isArray(outputJson)) {
      const error = new Error('Input and output must be valid array values.');
      error.code = 'INVALID_INPUT';
      throw error;
    }

    if (inputJson.length === 0) {
      const error = new Error('Input array cannot be empty.');
      error.code = 'INVALID_INPUT';
      throw error;
    }

    const matchSetting =
      assignment.submission?.match?.challengeMatchSetting?.matchSetting;
    const publicTests = matchSetting?.publicTests || [];

    const isPublic = publicTests.some((pt) => {
      const ptInput =
        typeof pt.input === 'string' ? JSON.parse(pt.input) : pt.input;
      return JSON.stringify(ptInput) === JSON.stringify(inputJson);
    });

    if (isPublic) {
      const error = new Error(
        'You cannot use public test cases. Please provide a different test case.'
      );
      error.code = 'INVALID_INPUT';
      throw error;
    }

    // RT-162: Test the input test case against the code runner and output to validate
    const submissionCode = assignment.submission?.code;

    if (submissionCode) {
      try {
        const testResults = await executeCodeTests({
          code: submissionCode,
          testCases: [
            {
              input: inputJson,
              output: expectedOutput,
            },
          ],
        });

        // Check if the test case actually exposes a bug (test should fail)
        const testResult = testResults.testResults?.[0];

        if (testResult) {
          // If the code passes the test case, the vote is invalid
          if (testResult.passed) {
            const error = new Error(
              'This test case actually passes with the provided expected output. The code is correct for this input, so you cannot vote "incorrect" with this test case.'
            );
            error.code = 'INVALID_TEST_CASE';
            throw error;
          }

          // Warning: if the actual output is empty or the code has compilation errors
          if (testResult.exitCode !== 0 || !testResult.actualOutput?.trim()) {
            const error = new Error(
              'The code failed to execute on this test case (compilation error or runtime error). This test case may not be valid.'
            );
            error.code = 'INVALID_TEST_CASE';
            throw error;
          }
        }
      } catch (error) {
        // Re-throw validation errors as-is
        if (error.code === 'INVALID_TEST_CASE') throw error;

        // For unexpected errors, log but allow the vote (code runner might be unavailable)
        // This prevents service disruption
        // Log the error object so callers can inspect stack/message
        console.error('Error validating test case', error);
      }
    }

    cleanInput = testCaseInput;
    cleanOutput = expectedOutput;
  }

  const existingVote = await PeerReviewVote.findOne({
    where: { peerReviewAssignmentId: assignment.id },
  });

  if (existingVote) {
    existingVote.vote = vote;

    existingVote.testCaseInput = cleanInput;
    existingVote.expectedOutput = cleanOutput;

    await existingVote.save();
  } else {
    await PeerReviewVote.create({
      peerReviewAssignmentId: assignment.id,
      vote,
      testCaseInput: cleanInput,
      expectedOutput: cleanOutput,
    });
  }

  return true;
};
