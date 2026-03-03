import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ChallengeStatus } from '#js/constants';
import ChallengeResultPage from '../app/student/challenges/[challengeId]/result/page';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { getMockedStore } from './test-redux-provider';

const mockGetChallengeResults = vi.fn();
const mockGetStudentVotes = vi.fn();
const mockEvaluateTitle = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getChallengeResults: mockGetChallengeResults,
    getStudentVotes: mockGetStudentVotes,
  }),
}));

vi.mock('#js/useTitle', () => ({
  __esModule: true,
  default: () => ({
    evaluateTitle: mockEvaluateTitle,
    loading: false,
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

const baseState = {
  auth: {
    user: { id: 1, role: 'student' },
    isLoggedIn: true,
    loading: false,
    roles: ['student'],
    error: null,
    loginRedirectPath: null,
    permissions: null,
    badgeSeen: {},
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

const buildResultResponse = () => ({
  success: true,
  data: {
    challenge: {
      id: 42,
      title: 'Title Challenge',
      status: ChallengeStatus.ENDED_PHASE_TWO,
      scoringStatus: 'completed',
      endPhaseTwoDateTime: new Date(Date.now() - 60 * 1000).toISOString(),
    },
    finalization: {
      totalMatches: 1,
      finalSubmissionCount: 1,
      pendingFinalCount: 0,
      resultsReady: true,
    },
    matchSetting: {
      id: 11,
      problemTitle: 'Two Sum',
    },
    studentSubmission: {
      id: 10,
      code: 'int main() { return 0; }',
      createdAt: new Date('2026-01-01T10:00:00.000Z').toISOString(),
      publicTestResults: [],
      privateTestResults: [],
    },
    scoreBreakdown: {
      totalScore: 92,
      implementationScore: 46,
      codeReviewScore: 46,
    },
    otherSubmissions: [],
    peerReviewTests: [],
    badges: {
      completedChallenges: 3,
      newlyUnlocked: [],
    },
  },
});

const renderResultPage = () => {
  const store = getMockedStore(baseState);
  return render(
    <Provider store={store}>
      <DurationProvider value={{ status: ChallengeStatus.ENDED_PHASE_TWO }}>
        <ChallengeResultPage />
      </DurationProvider>
    </Provider>
  );
};

describe('ChallengeResultPage title modal flow (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetChallengeResults.mockResolvedValue(buildResultResponse());
    mockGetStudentVotes.mockResolvedValue({ success: true, votes: [] });
  });

  it('shows and closes the title modal when a new title is unlocked', async () => {
    const user = userEvent.setup();
    mockEvaluateTitle.mockResolvedValue({
      success: true,
      eligible: true,
      titleChanged: true,
      title: {
        name: 'Specialist',
        description: 'Building solid expertise',
        minChallenges: 15,
        minAvgScore: 70,
        minBadges: 3,
      },
    });

    renderResultPage();

    expect(await screen.findByText(/title unlocked!/i)).toBeInTheDocument();
    expect(screen.getByText('Specialist')).toBeInTheDocument();
    expect(screen.getByText('Building solid expertise')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.queryByText(/title unlocked!/i)).not.toBeInTheDocument();
    });
    expect(mockEvaluateTitle).toHaveBeenCalledTimes(1);
  });

  it('does not show the title modal when no title change is returned', async () => {
    mockEvaluateTitle.mockResolvedValue({
      success: true,
      eligible: false,
      titleChanged: false,
      title: null,
    });

    renderResultPage();

    await screen.findByText('Title Challenge');

    await waitFor(() => {
      expect(mockEvaluateTitle).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText(/title unlocked!/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Continue' })
    ).not.toBeInTheDocument();
  });
});
