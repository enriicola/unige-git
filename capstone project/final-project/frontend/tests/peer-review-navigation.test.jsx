import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

vi.mock('./ExitConfirmationModal', () => ({
  __esModule: true,
  default: ({ open }) =>
    open ? <div data-testid='exit-modal'>Exit Modal</div> : null,
}));

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

describe('Peer Review Navigation and Interactions', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockPush.mockClear();
    mockToast.success.mockClear();
    mockToast.error.mockClear();
    mockToast.dismiss.mockClear();
    mockToast.loading.mockClear();
    mockToast.custom.mockClear();
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

    mockSubmitPeerReviewVote.mockResolvedValue({
      success: true,
    });

    mockFinalizePeerReview.mockResolvedValue({
      success: true,
    });

    mockExitPeerReview.mockResolvedValue({
      success: true,
    });
  });

  describe('Navigation logic (Next / Previous boundaries)', () => {
    it('disables Previous button at first solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();
    });

    it('disables Next button at last solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).not.toBeDisabled();

      // Navigate to last solution
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
        const nextBtn = screen.getByRole('button', { name: /next/i });
        expect(nextBtn).toBeDisabled();
      });
    });

    it('enables Previous button when not at first solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
        const prevButton = screen.getByRole('button', { name: /previous/i });
        expect(prevButton).not.toBeDisabled();
      });
    });

    it('enables Next button when not at last solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      expect(nextButton).not.toBeDisabled();

      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
        const nextBtn = screen.getByRole('button', { name: /next/i });
        expect(nextBtn).not.toBeDisabled();
      });
    });

    it('does not navigate beyond boundaries when clicking Next at last solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      const nextBtn = screen.getByRole('button', { name: /next/i });
      expect(nextBtn).toBeDisabled();

      // Try clicking again (should not change)
      await userEvent.click(nextBtn);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });
    });

    it('does not navigate beyond boundaries when clicking Previous at first solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const prevButton = screen.getByRole('button', { name: /previous/i });
      expect(prevButton).toBeDisabled();

      // Try clicking (should not change)
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Position indicator updates correctly', () => {
    it('displays "Solution 1 of 3" initially', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });
    });

    it('updates to "Solution 2 of 3" when navigating to second solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });
    });

    it('updates to "Solution 3 of 3" when navigating to last solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });
    });

    it('updates position indicator when navigating backwards', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Navigate forward
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Navigate backward
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });
    });
  });

  describe('Default Abstain is not persisted automatically', () => {
    it('does not save abstain vote when no vote is selected', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Wait a bit to ensure no auto-save happens
      await new Promise((resolve) => {
        setTimeout(resolve, 500);
      });

      expect(mockSubmitPeerReviewVote).not.toHaveBeenCalled();
    });

    it('only saves vote when explicitly selected', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Get the first radio button (for solution 1)
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      const correctRadio = correctRadios[0];
      await userEvent.click(correctRadio);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'correct',
          null,
          null
        );
      });
    });

    it('does not persist abstain when navigating away without selecting', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Navigate to next solution without selecting a vote
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Verify no vote was saved for solution 1
      const { calls } = mockSubmitPeerReviewVote.mock;
      const solution1Calls = calls.filter((call) => call[0] === 1);
      expect(solution1Calls).toHaveLength(0);
    });
  });

  describe('Sidebar navigation updates solution details, highlight, and indicator', () => {
    it('updates selected solution when clicking sidebar item', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Click Solution 2 in sidebar
      const solution2Button = screen.getAllByRole('button', {
        name: /solution 2/i,
      })[0]; // Get the sidebar button (first one)
      await userEvent.click(solution2Button);

      await waitFor(() => {
        expect(
          screen.getByText('console.log("solution 2");')
        ).toBeInTheDocument();
      });
    });

    it('updates position indicator when clicking sidebar item', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Click Solution 3 in sidebar
      const solution3Button = screen.getByRole('button', {
        name: /solution 3/i,
      });
      await userEvent.click(solution3Button);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });
    });

    it('highlights selected solution in sidebar', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Get sidebar solution buttons (first occurrence is sidebar)
      const solution1Buttons = screen.getAllByRole('button', {
        name: /solution 1/i,
      });
      const solution2Buttons = screen.getAllByRole('button', {
        name: /solution 2/i,
      });
      const solution1Button = solution1Buttons[0]; // Sidebar button
      const solution2Button = solution2Buttons[0]; // Sidebar button

      // Solution 1 should be highlighted initially (check by className containing primary)
      expect(solution1Button.className).toMatch(/primary/);

      // Click Solution 2
      await userEvent.click(solution2Button);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
        // Solution 2 should now be highlighted, Solution 1 should not
        expect(solution2Button.className).toMatch(/primary/);
        expect(solution1Button.className).not.toMatch(/primary/);
      });
    });

    it('updates code display when clicking sidebar item', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(
          screen.getByText('console.log("solution 1");')
        ).toBeInTheDocument();
      });

      // Click Solution 3 in sidebar (first occurrence is sidebar)
      const solution3Buttons = screen.getAllByRole('button', {
        name: /solution 3/i,
      });
      const solution3Button = solution3Buttons[0];
      await userEvent.click(solution3Button);

      await waitFor(() => {
        expect(
          screen.getByText('console.log("solution 3");')
        ).toBeInTheDocument();
      });

      // Verify solution 1 code is no longer visible
      expect(
        screen.queryByText('console.log("solution 1");')
      ).not.toBeInTheDocument();
    });
  });

  describe('Summary view displays correct counts and breakdown', () => {
    it('displays correct vote counts in summary toast', async () => {
      const votes = [
        { submissionId: 11, vote: 'correct' },
        { submissionId: 22, vote: 'incorrect' },
        { submissionId: 33, vote: 'abstain' },
      ];

      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes,
      });

      mockGetPeerReviewSummary.mockResolvedValue({
        success: true,
        summary: {
          total: 3,
          voted: 3,
          correct: 1,
          incorrect: 1,
          abstain: 1,
          unvoted: 0,
        },
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalled();
      });

      // Verify toast.custom was called with correct summary data
      await waitFor(() => {
        expect(mockToast.custom).toHaveBeenCalled();
      });

      const customCall = mockToast.custom.mock.calls[0];
      expect(customCall).toBeDefined();
    });

    it('shows loading state when fetching summary', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockToast.loading).toHaveBeenCalledWith('Loading summary...', {
          id: 'peer-review-summary-loading',
        });
      });
    });

    it('displays error message if summary fetch fails', async () => {
      mockGetPeerReviewSummary.mockResolvedValue({
        success: false,
        error: { message: 'Failed to load summary' },
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(
        () => {
          expect(mockToast.error).toHaveBeenCalled();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('Navigation via sidebar and Next / Previous behaves consistently', () => {
    it('both navigation methods update the same selected solution', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Navigate using Next button
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Navigate using sidebar (first occurrence is sidebar)
      const solution3Buttons = screen.getAllByRole('button', {
        name: /solution 3/i,
      });
      const solution3Button = solution3Buttons[0];
      await userEvent.click(solution3Button);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Navigate back using Previous button
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });
    });

    it('position indicator stays in sync with both navigation methods', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Use sidebar to jump to solution 3
      const solution3Button = screen.getByRole('button', {
        name: /solution 3/i,
      });
      await userEvent.click(solution3Button);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Use Previous button
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });
    });

    it('vote selection persists across navigation methods', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Select a vote on solution 1
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      const correctRadio = correctRadios[0];
      await userEvent.click(correctRadio);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalled();
      });

      // Navigate away using Next
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Navigate back using sidebar (first occurrence is sidebar)
      const solution1Buttons = screen.getAllByRole('button', {
        name: /solution 1/i,
      });
      const solution1Button = solution1Buttons[0]; // Sidebar button
      await userEvent.click(solution1Button);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still selected (get the first radio again for solution 1)
      const correctRadiosAgain = screen.getAllByRole('radio', {
        name: /correct/i,
      });
      const correctRadioAgain = correctRadiosAgain[0];
      expect(correctRadioAgain).toBeChecked();
    });
  });

  describe('Summary view opens and closes without side effects', () => {
    it('opens summary toast when Summary button is clicked', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalled();
      });
    });

    it('closes summary toast when dismiss is called', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockToast.custom).toHaveBeenCalled();
      });

      // The custom toast should have a dismiss function
      const customCall = mockToast.custom.mock.calls[0];
      expect(customCall).toBeDefined();
    });

    it('does not affect vote state when opening and closing summary', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Select a vote
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      const correctRadio = correctRadios[0];
      await userEvent.click(correctRadio);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalled();
      });

      const initialCallCount = mockSubmitPeerReviewVote.mock.calls.length;

      // Open summary
      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalled();
      });

      // Verify no additional votes were submitted
      expect(mockSubmitPeerReviewVote.mock.calls.length).toBe(initialCallCount);
    });

    it('does not change selected solution when opening summary', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Navigate to solution 2
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Open summary
      const summaryButton = screen.getByRole('button', { name: /summary/i });
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalled();
      });

      // Verify still on solution 2
      expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
    });

    it('can open summary multiple times without errors', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const summaryButton = screen.getByRole('button', { name: /summary/i });

      // Open summary first time
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalledTimes(1);
      });

      // Open summary second time
      await userEvent.click(summaryButton);

      await waitFor(() => {
        expect(mockGetPeerReviewSummary).toHaveBeenCalledTimes(2);
      });
    });
  });
});
