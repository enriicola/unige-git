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

const pastDateIso = new Date(Date.now() - 60 * 1000).toISOString();

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

const buildResultResponse = (newlyUnlocked) => ({
  success: true,
  data: {
    challenge: {
      id: 42,
      title: 'Milestone Challenge',
      status: ChallengeStatus.ENDED_PHASE_TWO,
      scoringStatus: 'completed',
      endPhaseTwoDateTime: pastDateIso,
    },
    matchSetting: {
      id: 11,
      problemTitle: 'Sort an array',
    },
    studentSubmission: {
      id: 10,
      code: 'int main() { return 0; }',
      createdAt: new Date('2026-01-01T10:00:00.000Z').toISOString(),
      publicTestResults: [],
      privateTestResults: [],
    },
    scoreBreakdown: {
      totalScore: 90,
      implementationScore: 45,
      codeReviewScore: 45,
    },
    otherSubmissions: [],
    peerReviewTests: [],
    badges: {
      completedChallenges: 3,
      newlyUnlocked,
    },
  },
});

const renderResultPage = (store) =>
  render(
    <Provider store={store}>
      <DurationProvider value={{ status: ChallengeStatus.ENDED_PHASE_TWO }}>
        <ChallengeResultPage />
      </DurationProvider>
    </Provider>
  );

describe('ChallengeResultPage badge flow (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows newly unlocked milestone badges immediately and marks each badge as seen on close', async () => {
    const user = userEvent.setup();
    const unlockedBadges = [
      {
        id: 301,
        key: 'challenge_3',
        name: 'Challenge 3',
        description: 'Complete 3 challenges',
        iconKey: 'challenge-3',
        threshold: 3,
        metric: 'challenges_completed',
      },
      {
        id: 305,
        key: 'challenge_5',
        name: 'Challenge 5',
        description: 'Complete 5 challenges',
        iconKey: 'challenge-5',
        threshold: 5,
        metric: 'challenges_completed',
      },
    ];

    mockGetChallengeResults.mockResolvedValue(
      buildResultResponse(unlockedBadges)
    );

    const store = getMockedStore(baseState);
    renderResultPage(store);

    expect(await screen.findByText('Badge Unlocked!')).toBeInTheDocument();
    expect(screen.getByText('Challenge 3')).toBeInTheDocument();
    expect(
      screen.getByText("You've completed 3 challenges completed!")
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(await screen.findByText('Challenge 5')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
    });

    const { badgeSeen } = store.getState().auth;
    expect(badgeSeen[1][301]).toBe(true);
    expect(badgeSeen[1][305]).toBe(true);
  });

  it('does not reopen badges already marked as seen after remounting', async () => {
    const user = userEvent.setup();
    const unlockedBadges = [
      {
        id: 301,
        key: 'challenge_3',
        name: 'Challenge 3',
        description: 'Complete 3 challenges',
        iconKey: 'challenge-3',
        threshold: 3,
        metric: 'challenges_completed',
      },
    ];

    mockGetChallengeResults.mockResolvedValue(
      buildResultResponse(unlockedBadges)
    );

    const store = getMockedStore(baseState);
    const firstMount = renderResultPage(store);

    expect(await screen.findByText('Challenge 3')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close' }));

    await waitFor(() => {
      expect(store.getState().auth.badgeSeen[1][301]).toBe(true);
    });

    firstMount.unmount();
    renderResultPage(store);

    await screen.findByText('Milestone Challenge');
    expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
    expect(screen.queryByText('Challenge 3')).not.toBeInTheDocument();
  });

  describe('review badges', () => {
    it('shows review milestone badge with threshold message', async () => {
      const user = userEvent.setup();
      const reviewMilestoneBadge = {
        id: 401,
        key: 'review_bronze_3',
        name: 'Review Bronze (3)',
        description: 'Complete 3 peer reviews',
        iconKey: 'review_bronze_3',
        threshold: 3,
        metric: 'reviews_completed',
      };

      mockGetChallengeResults.mockResolvedValue(
        buildResultResponse([reviewMilestoneBadge])
      );

      const store = getMockedStore(baseState);
      renderResultPage(store);

      expect(await screen.findByText('Badge Unlocked!')).toBeInTheDocument();
      expect(screen.getByText('Review Bronze (3)')).toBeInTheDocument();
      expect(
        screen.getByText("You've completed 3 reviews completed!")
      ).toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => {
        expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
      });
      expect(store.getState().auth.badgeSeen[1][401]).toBe(true);
    });

    it('shows review quality badge without threshold line', async () => {
      const user = userEvent.setup();
      const qualityBadge = {
        id: 402,
        key: 'quality_rookie',
        name: 'Quality Rookie',
        description: 'First correct peer review',
        iconKey: 'quality_rookie',
      };

      mockGetChallengeResults.mockResolvedValue(
        buildResultResponse([qualityBadge])
      );

      const store = getMockedStore(baseState);
      renderResultPage(store);

      expect(await screen.findByText('Badge Unlocked!')).toBeInTheDocument();
      expect(screen.getByText('Quality Rookie')).toBeInTheDocument();
      expect(screen.getByText('First correct peer review')).toBeInTheDocument();
      expect(
        screen.queryByText(/You've completed \d+/)
      ).not.toBeInTheDocument();

      await user.click(screen.getByRole('button', { name: 'Close' }));
      await waitFor(() => {
        expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
      });
      expect(store.getState().auth.badgeSeen[1][402]).toBe(true);
    });

    it('shows scoring and review badges in sequence and marks both seen', async () => {
      const user = userEvent.setup();
      const scoringBadge = {
        id: 301,
        key: 'challenge_3',
        name: 'Challenge 3',
        description: 'Complete 3 challenges',
        iconKey: 'challenge-3',
        threshold: 3,
        metric: 'challenges_completed',
      };
      const reviewBadge = {
        id: 401,
        key: 'review_bronze_3',
        name: 'Review Bronze (3)',
        description: 'Complete 3 peer reviews',
        iconKey: 'review_bronze_3',
        threshold: 3,
        metric: 'reviews_completed',
      };

      mockGetChallengeResults.mockResolvedValue(
        buildResultResponse([scoringBadge, reviewBadge])
      );

      const store = getMockedStore(baseState);
      renderResultPage(store);

      expect(await screen.findByText('Challenge 3')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Close' }));

      expect(await screen.findByText('Review Bronze (3)')).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: 'Close' }));

      await waitFor(() => {
        expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
      });

      const { badgeSeen } = store.getState().auth;
      expect(badgeSeen[1][301]).toBe(true);
      expect(badgeSeen[1][401]).toBe(true);
    });

    it('does not show review badge already marked as seen after remount', async () => {
      const reviewBadge = {
        id: 401,
        key: 'review_bronze_3',
        name: 'Review Bronze (3)',
        description: 'Complete 3 peer reviews',
        iconKey: 'review_bronze_3',
        threshold: 3,
        metric: 'reviews_completed',
      };

      mockGetChallengeResults.mockResolvedValue(
        buildResultResponse([reviewBadge])
      );

      const stateWithSeenReviewBadge = {
        ...baseState,
        auth: {
          ...baseState.auth,
          badgeSeen: { 1: { 401: true } },
        },
      };
      const store = getMockedStore(stateWithSeenReviewBadge);
      renderResultPage(store);

      await screen.findByText('Milestone Challenge');
      expect(screen.queryByText('Badge Unlocked!')).not.toBeInTheDocument();
      expect(screen.queryByText('Review Bronze (3)')).not.toBeInTheDocument();
    });
  });
});
