import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { ChallengeStatus } from '#js/constants';
import ChallengeResultPage from '../app/student/challenges/[challengeId]/result/page';
import ProfilePage from '../app/student/page';
import StudentLeaderboardPage from '../app/student/leaderboard/page';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { getMockedStore } from './test-redux-provider';

const mockGetChallengeResults = vi.fn();
const mockGetStudentVotes = vi.fn();
const mockGetChallengesForStudent = vi.fn();
const mockGetChallengeLeaderboard = vi.fn();
const mockGetProfile = vi.fn();
const mockEvaluateTitle = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getChallengeResults: mockGetChallengeResults,
    getStudentVotes: mockGetStudentVotes,
    getChallengesForStudent: mockGetChallengesForStudent,
    getChallengeLeaderboard: mockGetChallengeLeaderboard,
  }),
}));

vi.mock('#js/useProfile', () => ({
  __esModule: true,
  default: () => ({
    loading: false,
    getProfile: mockGetProfile,
  }),
}));

vi.mock('#js/useTitle', () => ({
  __esModule: true,
  default: () => ({
    evaluateTitle: mockEvaluateTitle,
    loading: false,
  }),
}));

vi.mock('#js/useRoleGuard', () => ({
  __esModule: true,
  default: () => ({
    user: { id: 1, role: 'student' },
    isAuthorized: true,
    loading: false,
  }),
}));

vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => () => false,
}));

vi.mock('#components/challenge/ChallengeSelector', () => ({
  default: ({ challenges, activeId, onSelect }) => (
    <div data-testid='challenge-selector'>
      {challenges.map((challenge) => (
        <button
          key={challenge.id}
          type='button'
          disabled={challenge.id === activeId}
          onClick={() => onSelect(challenge)}
        >
          {challenge.title}
        </button>
      ))}
    </div>
  ),
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
  usePathname: () => '/student/challenges/88/result',
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
      id: 88,
      title: 'Milestone Title Challenge',
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
      newlyUnlocked: [],
    },
  },
});

const buildProfileResponse = (titleName, titleDescription, nextTitle) => ({
  success: true,
  data: {
    user: {
      id: 1,
      username: 'student-one',
      email: 'student-one@example.com',
    },
    title: {
      name: titleName,
      description: titleDescription,
      nextTitle,
    },
    badges: {
      milestone: [],
      codeReview: [],
      reviewQuality: [],
    },
    stats: {
      totalChallenges: 12,
      avgTotalScore: 86,
      avgImplementation: 43,
      avgCodeReview: 43,
      reviewsGiven: 8,
      reviewAccuracy: 88,
      badgesEarned: 4,
    },
    challengeHistory: [],
  },
});

const buildLeaderboardData = (skillTitle) => ({
  success: true,
  data: {
    summary: {
      totalParticipants: 1,
      averageScore: 92,
      yourRank: 1,
    },
    leaderboard: [
      {
        studentId: 1,
        username: 'student-one',
        totalScore: 92,
        implementationScore: 46,
        codeReviewScore: 46,
        rank: 1,
        skillTitle,
        badges: [],
      },
    ],
    personalSummary: {
      rank: 1,
      totalScore: 92,
      implementationScore: 46,
      codeReviewScore: 46,
      gapToPrevious: 0,
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

describe('Skill title student journey (e2e-style)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetChallengeResults.mockResolvedValue(buildResultResponse());
    mockGetStudentVotes.mockResolvedValue({ success: true, votes: [] });
    mockGetChallengesForStudent.mockResolvedValue({
      success: true,
      data: [
        {
          id: 88,
          title: 'Milestone Title Challenge',
          status: ChallengeStatus.ENDED_PHASE_TWO,
          scoringStatus: 'completed',
        },
      ],
    });
  });

  it('announces a newly unlocked title and keeps it visible on profile and leaderboard', async () => {
    const user = userEvent.setup();
    const store = getMockedStore(baseState);

    mockEvaluateTitle.mockResolvedValue({
      success: true,
      eligible: true,
      titleChanged: true,
      title: {
        name: 'Expert',
        description: 'Skilled coder with proven excellence',
        minChallenges: 30,
        minAvgScore: 80,
        minBadges: 10,
      },
    });
    mockGetProfile.mockResolvedValue(
      buildProfileResponse(
        'Expert',
        'Skilled coder with proven excellence',
        'Master'
      )
    );
    mockGetChallengeLeaderboard.mockResolvedValue(
      buildLeaderboardData('Expert')
    );

    const resultView = renderResultPage(store);

    expect(await screen.findByText(/title unlocked!/i)).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(
      screen.getByText('Skilled coder with proven excellence')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Continue' }));
    await waitFor(() => {
      expect(screen.queryByText(/title unlocked!/i)).not.toBeInTheDocument();
    });
    expect(mockEvaluateTitle).toHaveBeenCalledTimes(1);

    resultView.unmount();
    const profileView = render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );

    expect(await screen.findByText('Current Skill Title')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
    expect(
      screen.getByText('“Skilled coder with proven excellence”')
    ).toBeInTheDocument();

    profileView.unmount();
    render(
      <Provider store={store}>
        <StudentLeaderboardPage />
      </Provider>
    );

    expect(await screen.findByTestId('challenge-selector')).toBeInTheDocument();
    expect(await screen.findByText('student-one')).toBeInTheDocument();
    expect(screen.getByText('Expert')).toBeInTheDocument();
  });

  it('does not show the modal when no new title is earned and keeps current title unchanged', async () => {
    const store = getMockedStore(baseState);

    mockEvaluateTitle.mockResolvedValue({
      success: true,
      eligible: false,
      titleChanged: false,
      title: null,
    });
    mockGetProfile.mockResolvedValue(
      buildProfileResponse('Newbie', 'Just getting started', 'Pupil')
    );
    mockGetChallengeLeaderboard.mockResolvedValue(
      buildLeaderboardData('Newbie')
    );

    const resultView = renderResultPage(store);

    await screen.findByText('Milestone Title Challenge');
    await waitFor(() => {
      expect(mockEvaluateTitle).toHaveBeenCalledTimes(1);
    });
    expect(screen.queryByText(/title unlocked!/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'Continue' })
    ).not.toBeInTheDocument();

    resultView.unmount();
    const profileView = render(
      <Provider store={store}>
        <ProfilePage />
      </Provider>
    );
    expect(await screen.findByText('Current Skill Title')).toBeInTheDocument();
    expect(screen.getByText('Newbie')).toBeInTheDocument();

    profileView.unmount();
    render(
      <Provider store={store}>
        <StudentLeaderboardPage />
      </Provider>
    );
    expect(await screen.findByTestId('challenge-selector')).toBeInTheDocument();
    expect(await screen.findByText('student-one')).toBeInTheDocument();
    expect(screen.getByText('Newbie')).toBeInTheDocument();
  });
});
