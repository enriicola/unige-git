import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChallengeStatus } from '#js/constants';
import toast from 'react-hot-toast';
import PeerReviewPage from '../app/student/challenges/[challengeId]/peer-review/page';

// Mocks
vi.mock('next/dynamic', () => ({
  default: () => {
    function FakeMonaco({ value }) {
      return <pre>{value}</pre>;
    }
    return FakeMonaco;
  },
}));

const mockPush = vi.fn();
const mockRouter = { push: mockPush };
vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useParams: () => ({ challengeId: '123' }),
}));

const mockUseRoleGuard = vi.fn();
vi.mock('#js/useRoleGuard', () => ({
  __esModule: true,
  default: () => mockUseRoleGuard(),
}));

const mockGetStudentPeerReviewAssignments = vi.fn();
const mockGetStudentVotes = vi.fn();
const mockGetPeerReviewSummary = vi.fn();
const mockSubmitPeerReviewVote = vi.fn();
const mockFinalizePeerReview = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getStudentPeerReviewAssignments: mockGetStudentPeerReviewAssignments,
    getStudentVotes: mockGetStudentVotes,
    getPeerReviewSummary: mockGetPeerReviewSummary,
    submitPeerReviewVote: mockSubmitPeerReviewVote,
    finalizePeerReview: mockFinalizePeerReview,
  }),
}));

const mockRedirectOnError = vi.fn();
vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => mockRedirectOnError,
}));

vi.mock('#components/common/Button', () => ({
  Button: ({ children, ...props }) => (
    <button type='button' {...props}>
      {children}
    </button>
  ),
}));

vi.mock('#components/common/card', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <h2>{children}</h2>,
  CardContent: ({ children }) => <div>{children}</div>,
  CardDescription: ({ children }) => <p>{children}</p>,
}));

vi.mock('#components/peerReview/PeerReviewSummaryDialog', () => ({
  __esModule: true,
  default: ({ open, onClose, summary }) =>
    open ? (
      <div data-testid='summary-dialog'>
        <h3>Peer Review Summary</h3>
        <p>Total: {summary?.total || 0}</p>
        <p>Voted: {summary?.voted || 0}</p>
        <button type='button' onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('./ExitConfirmationModal', () => ({
  __esModule: true,
  default: ({ isOpen, onConfirm, onCancel }) =>
    isOpen ? (
      <div data-testid='exit-modal'>
        <h3>Confirm Exit</h3>
        <button type='button' onClick={onConfirm}>
          Confirm
        </button>
        <button type='button' onClick={onCancel}>
          Cancel
        </button>
      </div>
    ) : null,
}));

// Mock toast
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: vi.fn(),
    error: vi.fn(),
    dismiss: vi.fn(),
    loading: vi.fn(),
    custom: vi.fn(),
  },
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
  startPhaseTwoDateTime: new Date().toISOString(),
  durationPeerReview: 1, // 1 minute duration
};

const createExpiredStartTime = (durationMinutes) => {
  const bufferSeconds = 5;
  const secondsAgo = durationMinutes * 60 + bufferSeconds + 5;
  return new Date(Date.now() - secondsAgo * 1000).toISOString();
};

describe('Peer Review Finalization', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRoleGuard.mockReturnValue({
      user: { id: 1, role: 'student' },
      isAuthorized: true,
    });

    mockGetStudentVotes.mockResolvedValue({ success: true, votes: [] });
    // Default success mock, override in tests
    mockFinalizePeerReview.mockResolvedValue({ success: true });

    mockGetPeerReviewSummary.mockResolvedValue({
      success: true,
      summary: {
        total: 1,
        voted: 1,
        correct: 1,
        incorrect: 0,
        abstain: 0,
        unvoted: 0,
      },
    });
  });

  const renderWithRedux = (component) =>
    render(<Provider store={createTestStore()}>{component}</Provider>);

  it('triggers finalization when challenge is expired', async () => {
    // Challenge expired 1 minute ago
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Since it's already expired, useEffect should fire finalize immediately (or on next tick)
    await waitFor(() => {
      expect(mockFinalizePeerReview).toHaveBeenCalledWith('123');
    });
  });

  it('fetches summary after finalization', async () => {
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    await waitFor(() => {
      expect(mockFinalizePeerReview).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(mockGetPeerReviewSummary).toHaveBeenCalled();
    });
  });

  it('disables voting controls after finalization (status changed)', async () => {
    // Even if not expired calculation-wise, if status is ENDED, controls should be disabled.
    const completedChallenge = {
      ...baseChallenge,
      status: ChallengeStatus.ENDED_PHASE_TWO,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: completedChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('code')).toBeInTheDocument();
    });

    const radio = await screen.findByDisplayValue('correct');
    expect(radio).toBeDisabled();
  });

  it('displays timer countdown correctly', async () => {
    // Challenge started 30 seconds ago with 1 minute duration...so 30 seconds remaining
    const activeChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: new Date(Date.now() - 30 * 1000).toISOString(),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: activeChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Wait for timer to be rendered
    await waitFor(() => {
      const timerElement = screen.getByText(/00:00:/);
      expect(timerElement).toBeInTheDocument();
      // Should show approximately 35 seconds remaining (5s countdown buffer)
      expect(timerElement.textContent).toMatch(/00:00:3[0-9]/);
    });
  });

  it('shows confirmation dialog after finalization', async () => {
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Wait for finalization to complete
    await waitFor(() => {
      expect(mockFinalizePeerReview).toHaveBeenCalled();
    });

    // Verify summary was fetched after finalization
    await waitFor(() => {
      expect(mockGetPeerReviewSummary).toHaveBeenCalled();
    });
  });

  it('handles finalization API error gracefully', async () => {
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    // Simulate finalization failure
    mockFinalizePeerReview.mockRejectedValue(new Error('Network error'));

    renderWithRedux(<PeerReviewPage />);

    // Wait for error to be displayed
    await waitFor(() => {
      expect(
        screen.getByText(/Unable to finalize peer review/i)
      ).toBeInTheDocument();
    });
  });

  it('handles summary fetch error after finalization', async () => {
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    mockFinalizePeerReview.mockResolvedValue({ success: true });
    mockGetPeerReviewSummary.mockResolvedValue({
      success: false,
      error: 'Failed to load summary',
    });

    renderWithRedux(<PeerReviewPage />);

    await waitFor(() => {
      expect(mockFinalizePeerReview).toHaveBeenCalled();
    });

    // Should show error toast
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load summary');
    });
  });

  it('redirects to result page after closing summary', async () => {
    const expiredChallenge = {
      ...baseChallenge,
      startPhaseTwoDateTime: createExpiredStartTime(1),
      durationPeerReview: 1,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: expiredChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Wait for finalization
    await waitFor(() => {
      expect(mockFinalizePeerReview).toHaveBeenCalled();
    });

    // Wait for summary fetch
    await waitFor(() => {
      expect(mockGetPeerReviewSummary).toHaveBeenCalled();
    });

    // Wait for finalization and summary dialog
    await waitFor(() => {
      expect(screen.getByTestId('summary-dialog')).toBeInTheDocument();
    });

    // Close the dialog
    const closeBtn = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeBtn);

    // Verify redirect
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/student/challenges/123/result');
    });
  }, 10000);

  it('blocks access when challenge status is ENDED_PHASE_TWO', async () => {
    const completedChallenge = {
      ...baseChallenge,
      status: ChallengeStatus.ENDED_PHASE_TWO,
    };

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [{ id: 1, submissionId: 11, code: 'code' }],
      challenge: completedChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    // Wait for content to load
    await waitFor(() => {
      expect(screen.getByText('code')).toBeInTheDocument();
    });

    // Verify all voting controls are disabled
    const correctRadio = await screen.findByDisplayValue('correct');
    const incorrectRadio = await screen.findByDisplayValue('incorrect');
    const abstainRadio = await screen.findByDisplayValue('abstain');

    expect(correctRadio).toBeDisabled();
    expect(incorrectRadio).toBeDisabled();
    expect(abstainRadio).toBeDisabled();
  });
});
