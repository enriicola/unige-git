import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

import { ChallengeStatus } from '#js/constants';
import PeerReviewPage from '../app/student/challenges/[challengeId]/peer-review/page';

vi.mock('next/dynamic', () => ({
  default: () => {
    function FakeMonaco({ value }) {
      return <pre>{value}</pre>;
    }
    return FakeMonaco;
  },
}));

const {
  mockPush,
  mockRouter,
  mockToast,
  mockUseRoleGuard,
  mockGetStudentPeerReviewAssignments,
  mockGetStudentVotes,
  mockGetPeerReviewSummary,
  mockSubmitPeerReviewVote,
  mockFinalizePeerReview,
  mockExitPeerReview,
  mockRedirectOnError,
} = vi.hoisted(() => {
  const push = vi.fn();
  const redirectOnError = vi.fn();
  return {
    mockPush: push,
    mockRouter: {
      push,
    },
    mockToast: {
      success: vi.fn(),
      error: vi.fn(),
      dismiss: vi.fn(),
      loading: vi.fn(),
      custom: vi.fn(),
    },
    mockUseRoleGuard: vi.fn(),
    mockGetStudentPeerReviewAssignments: vi.fn(),
    mockGetStudentVotes: vi.fn(),
    mockGetPeerReviewSummary: vi.fn(),
    mockSubmitPeerReviewVote: vi.fn(),
    mockFinalizePeerReview: vi.fn(),
    mockExitPeerReview: vi.fn(),
    mockRedirectOnError: redirectOnError,
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useParams: () => ({
    challengeId: '123',
  }),
}));

vi.mock('react-hot-toast', () => ({
  default: mockToast,
}));

vi.mock('#js/useRoleGuard', () => ({
  __esModule: true,
  default: () => mockUseRoleGuard(),
}));

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getStudentPeerReviewAssignments: mockGetStudentPeerReviewAssignments,
    getStudentVotes: mockGetStudentVotes,
    getPeerReviewSummary: mockGetPeerReviewSummary,
    submitPeerReviewVote: mockSubmitPeerReviewVote,
    finalizePeerReview: mockFinalizePeerReview,
    exitPeerReview: mockExitPeerReview,
  }),
}));

vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => mockRedirectOnError,
}));

vi.mock('#components/common/Button', () => {
  function Button({ children, onClick, disabled, ...props }) {
    return (
      <button type='button' onClick={onClick} disabled={disabled} {...props}>
        {children}
      </button>
    );
  }
  return { Button };
});

vi.mock('#components/common/card', () => {
  function Card({ children }) {
    return <div>{children}</div>;
  }
  function CardHeader({ children }) {
    return <div>{children}</div>;
  }
  function CardTitle({ children }) {
    return <h2>{children}</h2>;
  }
  function CardContent({ children }) {
    return <div>{children}</div>;
  }
  function CardDescription({ children }) {
    return <p>{children}</p>;
  }
  return { Card, CardHeader, CardTitle, CardContent, CardDescription };
});

vi.mock('#components/peerReview/PeerReviewSummaryDialog', () => {
  function PeerReviewSummaryDialog({ open, onClose }) {
    if (!open) return null;
    return (
      <div data-testid='summary-dialog'>
        <p>Summary Dialog</p>
        <button type='button' onClick={onClose}>
          Close
        </button>
      </div>
    );
  }
  return { default: PeerReviewSummaryDialog };
});

const createTestStore = () =>
  configureStore({
    reducer: {
      ui: (state = { theme: 'light' }) => state,
    },
  });

const baseChallenge = {
  id: 123,
  status: ChallengeStatus.STARTED_PHASE_TWO,
  startPhaseTwoDateTime: new Date(Date.now() - 1000 * 60).toISOString(),
  durationPeerReview: 30,
};

const assignmentsMock = [
  {
    id: 1,
    submissionId: 11,
    code: 'console.log("solution 1");',
    matchSetting: { publicTests: [] },
  },
  {
    id: 2,
    submissionId: 22,
    code: 'console.log("solution 2");',
    matchSetting: { publicTests: [] },
  },
  {
    id: 3,
    submissionId: 33,
    code: 'console.log("solution 3");',
    matchSetting: { publicTests: [] },
  },
];

const renderWithRedux = (component) =>
  render(<Provider store={createTestStore()}>{component}</Provider>);

describe('Peer Review Exit Functionality', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPush.mockClear();
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    mockRedirectOnError.mockReturnValue(false);

    mockUseRoleGuard.mockReturnValue({
      user: { id: 1, role: 'student' },
      isAuthorized: true,
    });

    mockGetStudentVotes.mockResolvedValue({
      success: true,
      votes: [],
    });

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    mockExitPeerReview.mockResolvedValue({
      success: true,
      data: {
        votesSaved: 0,
        abstainVotesCreated: 3,
      },
    });

    mockFinalizePeerReview.mockResolvedValue({
      success: true,
      data: { finalized: true },
    });

    mockGetPeerReviewSummary.mockResolvedValue({
      success: true,
      summary: {
        total: 3,
        voted: 0,
        correct: 0,
        incorrect: 0,
        abstain: 0,
        unvoted: 3,
      },
    });
  });

  describe('Exit button visibility based on timer state', () => {
    it('shows Exit button when timer is active (timeLeft > 0)', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(
        () => {
          expect(
            screen.getByRole('button', { name: /exit/i })
          ).toBeInTheDocument();
        },
        { timeout: 10000 }
      );
    });

    it('hides Exit button when timer reaches zero', async () => {
      const challengeWithZeroTime = {
        ...baseChallenge,
        startPhaseTwoDateTime: new Date(
          Date.now() - 1000 * 60 * 31
        ).toISOString(),
        durationPeerReview: 30,
      };

      mockGetStudentPeerReviewAssignments.mockResolvedValue({
        success: true,
        assignments: assignmentsMock,
        challenge: challengeWithZeroTime,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        const exitButton = screen.queryByRole('button', { name: /exit/i });
        expect(exitButton).not.toBeInTheDocument();
      });
    });

    it('hides Exit button when student has already exited', async () => {
      const votesWithAllCompleted = [
        { submissionId: 11, vote: 'correct' },
        {
          submissionId: 22,
          vote: 'incorrect',
          testCaseInput: '[1]',
          expectedOutput: '[2]',
        },
        { submissionId: 33, vote: 'abstain' },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes: votesWithAllCompleted,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        const exitButton = screen.queryByRole('button', { name: /exit/i });
        expect(exitButton).not.toBeInTheDocument();
      });
    });
  });

  describe('Confirmation dialog displays correct vote counts and summary', () => {
    it('opens confirmation dialog when Exit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });
    });

    it('displays correct vote counts in confirmation dialog', async () => {
      const votes = [
        { submissionId: 11, vote: 'correct' },
        {
          submissionId: 22,
          vote: 'incorrect',
          testCaseInput: '[1]',
          expectedOutput: '[2]',
        },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/You have reviewed 2 of 3 solutions/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Your votes so far/i)).toBeInTheDocument();

      const allCorrectTexts = screen.getAllByText(/Correct/i);
      expect(allCorrectTexts.length).toBeGreaterThan(0);

      const allIncorrectTexts = screen.getAllByText(/Incorrect/i);
      expect(allIncorrectTexts.length).toBeGreaterThan(0);

      const allAbstainTexts = screen.getAllByText(/Abstain/i);
      expect(allAbstainTexts.length).toBeGreaterThan(0);
    });

    it('shows zero counts for unvoted assignments', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/You have reviewed 0 of 3 solutions/i)
      ).toBeInTheDocument();
    });
  });

  describe('Continue Reviewing saves votes and continues', () => {
    it('saves votes when Continue Reviewing is clicked', async () => {
      const votes = [
        { submissionId: 11, vote: 'correct' },
        {
          submissionId: 22,
          vote: 'incorrect',
          testCaseInput: '[1]',
          expectedOutput: '[2]',
        },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', {
        name: /Continue Reviewing/i,
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledWith(
          '123',
          1,
          expect.arrayContaining([
            expect.objectContaining({
              submissionId: 11,
              vote: 'correct',
            }),
            expect.objectContaining({
              submissionId: 22,
              vote: 'incorrect',
              testCaseInput: '[1]',
              expectedOutput: '[2]',
            }),
          ])
        );
      });
    });

    it('closes dialog and stays on page after Continue Reviewing', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', {
        name: /Continue Reviewing/i,
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(
          screen.queryByText(/Exit Peer Review\?/i)
        ).not.toBeInTheDocument();
      });

      expect(mockPush).not.toHaveBeenCalled();
      expect(
        screen.getByText(/Review solutions and submit your assessment/i)
      ).toBeInTheDocument();
    });

    it('shows success message when votes are saved via Continue Reviewing', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', {
        name: /Continue Reviewing/i,
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Votes saved successfully.'
        );
      });
    });

    it('shows error message if saving fails via Continue Reviewing', async () => {
      mockExitPeerReview.mockResolvedValue({
        success: false,
        error: 'Failed to save',
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', {
        name: /Continue Reviewing/i,
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });
    });
  });

  describe('Exit Anyway saves votes and exits', () => {
    it('saves votes and redirects when Exit Anyway is clicked', async () => {
      const votes = [
        { submissionId: 11, vote: 'correct' },
        { submissionId: 22, vote: 'abstain' },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledWith(
          '123',
          1,
          expect.arrayContaining([
            expect.objectContaining({
              submissionId: 11,
              vote: 'correct',
            }),
            expect.objectContaining({
              submissionId: 22,
              vote: 'abstain',
            }),
          ])
        );
      });

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Thanks for your participation.'
        );
      });

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1600);
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/student/challenges/123/result');
      });
    });

    it('shows error message if exit fails', async () => {
      mockExitPeerReview.mockResolvedValue({
        success: false,
        error: 'Failed to exit',
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalled();
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('Votes remain unchanged after exiting', () => {
    it('sends all votes to backend when exiting', async () => {
      const votes = [
        { submissionId: 11, vote: 'correct' },
        {
          submissionId: 22,
          vote: 'incorrect',
          testCaseInput: '[1]',
          expectedOutput: '[2]',
        },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledWith(
          '123',
          1,
          expect.arrayContaining([
            expect.objectContaining({
              submissionId: 11,
              vote: 'correct',
            }),
            expect.objectContaining({
              submissionId: 22,
              vote: 'incorrect',
              testCaseInput: '[1]',
              expectedOutput: '[2]',
            }),
          ])
        );
      });
    });

    it('sends only voted assignments to backend', async () => {
      const votes = [{ submissionId: 11, vote: 'correct' }];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledWith(
          '123',
          1,
          expect.arrayContaining([
            expect.objectContaining({
              submissionId: 11,
              vote: 'correct',
            }),
          ])
        );
      });

      const callArgs = mockExitPeerReview.mock.calls[0];
      expect(callArgs[2]).toHaveLength(1);
    });
  });

  describe('User cannot return to peer review after exiting', () => {
    it('redirects to result page if all assignments have votes on load', async () => {
      const votesWithAllCompleted = [
        { submissionId: 11, vote: 'correct' },
        {
          submissionId: 22,
          vote: 'incorrect',
          testCaseInput: '[1]',
          expectedOutput: '[2]',
        },
        { submissionId: 33, vote: 'abstain' },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes: votesWithAllCompleted,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Thanks for your participation.'
        );
      });

      await act(async () => {
        await new Promise((resolve) => {
          setTimeout(resolve, 1600);
        });
      });

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/student/challenges/123/result');
      });
    });

    it('disables voting after exit', async () => {
      const votes = [{ submissionId: 11, vote: 'correct' }];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalled();
      });

      await waitFor(() => {
        const correctRadios = screen.queryAllByRole('radio', {
          name: /correct/i,
        });
        if (correctRadios.length > 0) {
          correctRadios.forEach((radio) => {
            expect(radio).toBeDisabled();
          });
        } else {
          expect(mockPush).toHaveBeenCalled();
        }
      });
    });
  });

  describe('Confirmation message is displayed after exit', () => {
    it('shows "Thanks for your participation" message after Exit Anyway', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockToast.success).toHaveBeenCalledWith(
          'Thanks for your participation.'
        );
      });
    });
  });

  describe('Additional edge cases', () => {
    it('handles exit with no votes submitted', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledWith('123', 1, []);
      });
    });

    it('prevents multiple exit attempts', async () => {
      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });

      await user.click(exitAnywayButton);
      await user.click(exitAnywayButton);
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockExitPeerReview).toHaveBeenCalledTimes(1);
      });
    });

    it('handles network error during Continue Reviewing', async () => {
      mockExitPeerReview.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const continueButton = screen.getByRole('button', {
        name: /Continue Reviewing/i,
      });
      await user.click(continueButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Unable to save votes. Please try again.'
        );
      });
    });

    it('handles network error during Exit Anyway', async () => {
      mockExitPeerReview.mockRejectedValue(new Error('Network error'));

      const user = userEvent.setup();
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /exit/i })
        ).toBeInTheDocument();
      });

      const exitButton = screen.getByRole('button', { name: /exit/i });
      await user.click(exitButton);

      await waitFor(() => {
        expect(screen.getByText(/Exit Peer Review\?/i)).toBeInTheDocument();
      });

      const exitAnywayButton = screen.getByRole('button', {
        name: /Exit Anyway/i,
      });
      await user.click(exitAnywayButton);

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          'Unable to exit peer review. Please try again.'
        );
      });

      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});
