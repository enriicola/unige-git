import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { ChallengeStatus } from '#js/constants';
import ChallengeResultPage from '../app/student/challenges/[challengeId]/result/page';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { renderWithProviders } from './test-utils';

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

const pastDateIso = new Date(Date.now() - 60 * 1000).toISOString();

const buildResultsResponse = ({
  challenge = {},
  finalization = {},
  scoreBreakdown,
  includeScoreBreakdown = true,
} = {}) => {
  const data = {
    challenge: {
      id: 42,
      title: 'Score Breakdown Challenge',
      status: ChallengeStatus.ENDED_PHASE_TWO,
      scoringStatus: 'completed',
      endPhaseTwoDateTime: pastDateIso,
      ...challenge,
    },
    finalization: {
      totalMatches: 4,
      finalSubmissionCount: 4,
      pendingFinalCount: 0,
      resultsReady: true,
      ...finalization,
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
    otherSubmissions: [],
    peerReviewTests: [],
    badges: {
      completedChallenges: 3,
      newlyUnlocked: [],
    },
  };

  if (includeScoreBreakdown) {
    data.scoreBreakdown = scoreBreakdown || {
      totalScore: 0,
      implementationScore: 0,
      codeReviewScore: 0,
      updatedAt: new Date('2026-01-01T11:00:00.000Z').toISOString(),
      stats: {
        codeReview: { E: 0, C: 0, W: 0, totalReviewed: 0 },
        implementation: {
          teacherPassed: 0,
          teacherTotal: 0,
          peerPenalties: 0,
          peerTotal: 0,
        },
      },
    };
  }

  return {
    success: true,
    data,
  };
};

const renderPage = (status = ChallengeStatus.ENDED_PHASE_TWO) => {
  renderWithProviders(
    <DurationProvider value={{ status }}>
      <ChallengeResultPage />
    </DurationProvider>,
    {
      preloadedState: baseState,
    }
  );
};

describe('Score breakdown visibility and details', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockEvaluateTitle.mockResolvedValue({
      success: true,
      eligible: false,
      titleChanged: false,
      title: null,
    });
  });

  it('shows total score and detailed scoring formulas after peer review and scoring completion', async () => {
    mockGetChallengeResults.mockResolvedValue(
      buildResultsResponse({
        scoreBreakdown: {
          totalScore: 72.5,
          implementationScore: 35,
          codeReviewScore: 37.5,
          updatedAt: new Date('2026-01-02T12:00:00.000Z').toISOString(),
          stats: {
            codeReview: {
              E: 2,
              C: 1,
              W: 1,
              totalReviewed: 5,
            },
            implementation: {
              teacherPassed: 4,
              teacherTotal: 5,
              peerPenalties: 1,
              peerTotal: 2,
            },
          },
        },
      })
    );

    renderPage();

    expect(
      await screen.findByText('Score Breakdown Challenge')
    ).toBeInTheDocument();
    expect(screen.getByText(/Total Score out of 100/i)).toBeInTheDocument();
    expect(screen.getByText(/Coding Phase Score/i)).toBeInTheDocument();
    expect(screen.getByText(/Peer Review Score/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        /Only test cases that exposed real bugs in your solution/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/You reviewed/i)).toBeInTheDocument();
    expect(screen.getByText(/5 peer solutions/i)).toBeInTheDocument();
    expect(screen.getAllByText(/1\/2/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/Earned = 2×2 \+ 1×1 - 1×0\.5 =/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/4\.5 points/i)).toBeInTheDocument();
  });

  it('shows peer review waiting message and hides score breakdown when phase two is still active', async () => {
    renderPage(ChallengeStatus.STARTED_PHASE_TWO);

    expect(
      await screen.findByText(/Scoring is not available yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please wait until the peer review phase has ended/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Total Score out of 100/i)
    ).not.toBeInTheDocument();
  });

  it('shows scoring-in-progress message and hides score breakdown while computation is running', async () => {
    mockGetChallengeResults.mockResolvedValue(
      buildResultsResponse({
        challenge: {
          scoringStatus: 'computing',
        },
        finalization: {
          totalMatches: 4,
          finalSubmissionCount: 2,
          pendingFinalCount: 2,
          resultsReady: false,
        },
      })
    );

    renderPage();

    expect(
      await screen.findByText(/Scoring is not available yet/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Please wait until scoring is computed/i)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/Total Score out of 100/i)
    ).not.toBeInTheDocument();
  });
});
