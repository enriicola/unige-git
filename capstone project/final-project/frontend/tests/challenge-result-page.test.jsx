import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
// import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { ChallengeStatus } from '#js/constants';
import ChallengeResultPage from '../app/student/challenges/[challengeId]/result/page';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { renderWithProviders } from './test-utils';

const mockGetChallengeResults = vi.fn();
const mockGetStudentVotes = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getChallengeResults: mockGetChallengeResults,
    getStudentVotes: mockGetStudentVotes,
  }),
}));

vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => () => false,
}));

const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useParams: () => ({ challengeId: '42' }),
  useRouter: () => mockRouter,
}));

describe('ChallengeResultPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderPage = ({ durationValue, preloadedState } = {}) => {
    const baseState = {
      auth: {
        user: { id: 1, role: 'student' },
        isLoggedIn: true,
        loading: false,
        roles: ['student'],
        error: null,
        loginRedirectPath: null,
        permissions: null,
      },
      ui: {
        theme: null,
        challengeDrafts: {},
        challengeTimers: {},
        challengeCountdowns: {},
        peerReviewExits: {},
        solutionFeedbackVisibility: {},
        codeReviewVotesVisibility: {},
      },
    };
    const mergedState = {
      ...baseState,
      ...preloadedState,
      auth: {
        ...baseState.auth,
        ...(preloadedState?.auth || {}),
      },
      ui: {
        ...baseState.ui,
        ...(preloadedState?.ui || {}),
      },
    };

    renderWithProviders(
      durationValue ? (
        <DurationProvider value={durationValue}>
          <ChallengeResultPage />
        </DurationProvider>
      ) : (
        <ChallengeResultPage />
      ),
      {
        preloadedState: mergedState,
      }
    );
  };

  /*
  it('renders ended challenge details with private tests and peer review feedback', async () => {
    const user = userEvent.setup();
    mockGetStudentVotes.mockResolvedValue({ success: true, votes: [] });
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        challenge: {
          id: 42,
          title: 'Sorting Challenge',
          status: 'ended_phase_two',
          scoringStatus: 'completed',
          endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000).toISOString(),
        },
        matchSetting: { id: 5, problemTitle: 'Sort an array' },
        studentSubmission: {
          id: 99,
          code: 'int main() { return 0; }',
          createdAt: new Date('2025-12-01T10:00:00Z').toISOString(),
          publicTestResults: [
            {
              testIndex: 0,
              passed: true,
              expectedOutput: '1 2',
              actualOutput: '1 2',
            },
          ],
          privateTestResults: [
            {
              testIndex: 0,
              passed: true,
              expectedOutput: '1 2',
              actualOutput: '1 2',
            },
          ],
        },
        otherSubmissions: [
          {
            id: 101,
            code: 'int main() { return 1; }',
            createdAt: new Date('2025-12-01T10:05:00Z').toISOString(),
            student: { id: 2, username: 'peer' },
          },
        ],
        peerReviewTests: [
          {
            id: 201,
            reviewer: { id: 2, username: 'peer' },
            tests: [
              {
                input: '2 1',
                expectedOutput: '1 2',
                notes: 'Check ordering',
              },
            ],
          },
        ],
        scoreBreakdown: {
          totalScore: 100,
          implementationScore: 50,
          codeReviewScore: 50,
        },
      },
    });

    renderPage({
      durationValue: {
        status: ChallengeStatus.ENDED_PHASE_TWO,
      },
    });

    expect(await screen.findByText('Sorting Challenge')).toBeInTheDocument();
    expect(
      await screen.findByText(/Problem: Sort an array/i)
    ).toBeInTheDocument();

    const toggleButton = screen.getByRole('button', {
      name: /View Your Solution & Feedback/i,
    });
    expect(toggleButton).toBeInTheDocument();

    expect(
      screen.queryByText(/int main\(\) { return 0; }/i)
    ).not.toBeInTheDocument();

    await user.click(toggleButton);

    expect(
      await screen.findByRole('button', {
        name: /Hide Your Solution & Feedback/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/Your submission details/i)).toBeInTheDocument();
    expect(screen.getByText(/int main\(\) { return 0; }/i)).toBeInTheDocument();
    expect(screen.getByText(/Public test results/i)).toBeInTheDocument();
    expect(screen.getByText(/Private test results/i)).toBeInTheDocument();
    expect(screen.getAllByText('1 2').length).toBeGreaterThan(0);

    expect(screen.queryByText(/Received Tests/i)).not.toBeInTheDocument();
    const codeReviewToggle = screen.getByRole('button', {
      name: /View Your Peer Review Votes/i,
    });
    await user.click(codeReviewToggle);

    expect(await screen.findByText(/Received Tests/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer:\s*peer/i)).toBeInTheDocument();
    expect(screen.getByText(/2 1/)).toBeInTheDocument();

    expect(
      screen.getByText(/Other participant solutions/i)
    ).toBeInTheDocument();

    expect(screen.getAllByText('peer').length).toBeGreaterThan(0);
  });

  it('toggles peer review votes and renders vote breakdown', async () => {
    const user = userEvent.setup();
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        challenge: {
          id: 42,
          title: 'Sorting Challenge',
          status: 'ended_phase_two',
          scoringStatus: 'completed',
          endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000).toISOString(),
        },
        matchSetting: { id: 5, problemTitle: 'Sort an array' },
        studentSubmission: {
          id: 99,
          code: 'int main() { return 0; }',
          createdAt: new Date('2025-12-01T10:00:00Z').toISOString(),
          publicTestResults: [],
          privateTestResults: [],
        },
        scoreBreakdown: {
          totalScore: 100,
          implementationScore: 50,
          codeReviewScore: 50,
        },
      },
    });
    mockGetStudentVotes.mockResolvedValue({
      success: true,
      votes: [
        {
          assignmentId: 901,
          submissionId: 500,
          reviewedSubmission: {
            id: 500,
            student: { id: 2, username: 'peer' },
            problemTitle: 'Sort an array',
          },
          vote: 'incorrect',
          expectedEvaluation: 'incorrect',
          isCorrect: true,
          testCaseInput: '[5]',
          expectedOutput: '[10]',
          referenceOutput: '[10]',
          actualOutput: '[3]',
          isExpectedOutputCorrect: true,
          isVoteCorrect: true,
        },
      ],
    });

    renderPage({
      durationValue: {
        status: ChallengeStatus.ENDED_PHASE_TWO,
      },
    });

    const votesToggle = await screen.findByRole('button', {
      name: /View Your Peer Review Votes/i,
    });
    await user.click(votesToggle);

    expect(
      screen.getByRole('button', { name: /Hide Your Peer Review Votes/i })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Your Peer Review Votes/i).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Your vote:/i)).toBeInTheDocument();
    expect(screen.getByText(/Expected evaluation:/i)).toBeInTheDocument();
    expect(screen.getByText(/Test provided/i)).toBeInTheDocument();
    expect(screen.getByText(/Reference output/i)).toBeInTheDocument();
    expect(screen.getByText(/Reviewed output/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Correct/i).length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole('button', { name: /Hide Your Peer Review Votes/i })
    );
    expect(
      screen.queryByText(/Your Peer Review Votes/i, { selector: 'div' })
    ).not.toBeInTheDocument();
  }); */

  it('respects persisted solution feedback visibility', async () => {
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        challenge: {
          id: 42,
          title: 'Sorting Challenge',
          status: 'ended_phase_two',
          scoringStatus: 'completed',
          endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000).toISOString(),
        },
        matchSetting: { id: 5, problemTitle: 'Sort an array' },
        studentSubmission: {
          id: 99,
          code: 'int main() { return 0; }',
          createdAt: new Date('2025-12-01T10:00:00Z').toISOString(),
          publicTestResults: [
            {
              testIndex: 0,
              passed: true,
              expectedOutput: '1 2',
              actualOutput: '1 2',
            },
          ],
          privateTestResults: [
            {
              testIndex: 0,
              passed: false,
              expectedOutput: '1 2',
              actualOutput: '2 1',
              stderr: 'Wrong order',
            },
          ],
        },
        scoreBreakdown: {
          totalScore: 100,
          implementationScore: 50,
          codeReviewScore: 50,
        },
      },
    });

    renderPage({
      durationValue: {
        status: ChallengeStatus.ENDED_PHASE_TWO,
      },
      preloadedState: {
        ui: {
          solutionFeedbackVisibility: {
            1: {
              42: true,
            },
          },
        },
      },
    });

    expect(
      await screen.findByRole('button', {
        name: /Hide Your Solution & Feedback/i,
      })
    ).toBeInTheDocument();
    expect(screen.getByText(/int main\(\) { return 0; }/i)).toBeInTheDocument();
    expect(screen.getByText(/Private test results/i)).toBeInTheDocument();
    expect(screen.getByText(/Wrong order/i)).toBeInTheDocument();
  });

  it('shows an error message when the API fails', async () => {
    mockGetChallengeResults.mockResolvedValue({
      success: false,
      error: { message: 'Something went wrong.' },
    });

    renderPage({
      durationValue: {
        status: ChallengeStatus.ENDED_PHASE_TWO,
      },
    });

    await waitFor(() => {
      expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
    });
  });

  it('shows a waiting screen while peer review is active', async () => {
    renderPage({
      durationValue: {
        status: ChallengeStatus.STARTED_PHASE_TWO,
      },
    });
    expect(
      await screen.findByText(/Scoring is not available yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please wait until the peer review phase has ended/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Snake break/i)).toBeInTheDocument();
  });

  it('shows a processing screen when results are not ready', async () => {
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        challenge: {
          id: 42,
          title: 'Sorting Challenge',
          status: 'ended_phase_two',
          endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000).toISOString(),
          scoringStatus: 'computing',
        },
        finalization: {
          totalMatches: 4,
          finalSubmissionCount: 2,
          pendingFinalCount: 2,
          resultsReady: false,
        },
      },
    });

    renderPage({
      durationValue: {
        status: ChallengeStatus.ENDED_PHASE_TWO,
      },
    });

    expect(
      await screen.findByText(/Scoring is not available yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please wait until scoring is computed/i)
    ).toBeInTheDocument();

    expect(screen.getByText(/Snake break/i)).toBeInTheDocument();
    expect(screen.getByText(/Finalized submissions/i)).toBeInTheDocument();
  });
});
