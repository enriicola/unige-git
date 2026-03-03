import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ChallengeStatus } from '#js/constants';
import ChallengeResultPage from '../app/student/challenges/[challengeId]/result/page';
import ProfilePage from '../app/student/page';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { getMockedStore } from './test-redux-provider';

const mockGetChallengeResults = vi.fn();
const mockGetStudentVotes = vi.fn();
const mockGetProfile = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getChallengeResults: mockGetChallengeResults,
    getStudentVotes: mockGetStudentVotes,
  }),
}));

vi.mock('#js/useProfile', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    getProfile: mockGetProfile,
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
  useParams: () => ({ challengeId: '88' }),
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

const buildResultResponse = () => ({
  success: true,
  data: {
    challenge: {
      id: 88,
      title: 'Milestone Badge Challenge',
      status: ChallengeStatus.ENDED_PHASE_TWO,
      scoringStatus: 'completed',
      endPhaseTwoDateTime: pastDateIso,
    },
    matchSetting: {
      id: 9,
      problemTitle: 'Palindrome Number',
    },
    studentSubmission: {
      id: 12,
      code: 'int main() { return 0; }',
      createdAt: new Date('2026-01-02T09:00:00.000Z').toISOString(),
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
      newlyUnlocked: [
        {
          id: 401,
          key: 'challenge_3',
          name: 'Challenge 3',
          description: 'Complete 3 successful challenges',
          iconKey: 'challenge-3',
          threshold: 3,
          metric: 'challenges_completed',
        },
      ],
    },
  },
});

const buildProfileResponse = (totalChallenges) => ({
  success: true,
  data: {
    user: {
      id: 1,
      username: 'student-one',
      email: 'student-one@example.com',
    },
    title: {
      name: 'Beginner',
      description: 'Starting your coding journey',
      nextTitle: 'Practitioner',
    },
    badges: {
      milestone: [
        {
          key: 'challenge_3',
          name: 'Challenge 3',
          category: 'challenge_milestone',
          iconKey: 'challenge-3',
          earnedAt: new Date('2026-01-02T09:00:00.000Z').toISOString(),
        },
      ],
      codeReview: [],
      reviewQuality: [],
    },
    stats: {
      totalChallenges,
      avgTotalScore: 90,
      avgImplementation: 45,
      avgCodeReview: 45,
      reviewsGiven: 6,
      reviewAccuracy: 100,
      badgesEarned: 1,
    },
    challengeHistory: [],
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

describe('Badge milestone student journey (e2e-style)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('awards milestone badge on challenge completion and keeps it visible in profile over time', async () => {
    const user = userEvent.setup();
    const store = getMockedStore(baseState);

    mockGetChallengeResults.mockResolvedValue(buildResultResponse());
    mockGetProfile
      .mockResolvedValueOnce(buildProfileResponse(3))
      .mockResolvedValueOnce(buildProfileResponse(4));

    const resultView = renderResultPage(store);

    expect(
      await screen.findByText('Badge Unlocked!', {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByText('Challenge 3')).toBeInTheDocument();
    expect(
      screen.getByText("You've completed 3 challenges completed!")
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(store.getState().auth.badgeSeen[1][401]).toBe(true);

    resultView.unmount();

    const firstProfileView = render(<ProfilePage />);

    expect(await screen.findByText('Earned Badges')).toBeInTheDocument();
    expect(screen.getByText('Challenge milestones')).toBeInTheDocument();
    expect(screen.getByText('Challenge 3')).toBeInTheDocument();

    const totalChallengesCard = screen
      .getByText('Total Challenges')
      .closest('div');

    expect(totalChallengesCard).not.toBeNull();
    expect(within(totalChallengesCard).getByText('3')).toBeInTheDocument();

    firstProfileView.unmount();
    render(<ProfilePage />);

    await waitFor(() => {
      expect(mockGetProfile).toHaveBeenCalledTimes(2);
    });

    expect(await screen.findByText('Challenge 3')).toBeInTheDocument();
    expect(screen.getByText('Total Challenges')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });
});
