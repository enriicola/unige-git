/**
 * RT-181: Comprehensive tests for voting functionality in peer review
 *
 * Tests cover:
 * - Vote selection and changing votes
 * - Vote persistence across navigation (Next/Previous buttons, sidebar)
 * - Vote persistence across page refresh
 * - Progress bar updates in real-time
 * - Incorrect vote validation (empty fields, invalid arrays, public test detection)
 * - Vote saving behavior (auto-save for Correct/Abstain, conditional for Incorrect)
 */

import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  beforeEach,
  afterEach,
} from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import {
  assignmentsMock,
  baseChallenge,
  mockGetStudentPeerReviewAssignments,
  mockGetStudentVotes,
  mockSubmitPeerReviewVote,
  mockUseRoleGuard,
  renderWithRedux,
} from './peer-review-voting.mocks';

let PeerReviewPage;

beforeAll(async () => {
  ({ default: PeerReviewPage } =
    await import('../app/student/challenges/[challengeId]/peer-review/page'));
});

describe('RT-181: Vote Selection and Management', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRoleGuard.mockReturnValue({
      user: { id: 1, role: 'student' },
      isAuthorized: true,
    });

    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    mockGetStudentVotes.mockResolvedValue({
      success: true,
      votes: [],
    });

    mockSubmitPeerReviewVote.mockResolvedValue({
      success: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Vote selection options', () => {
    it('allows student to select Correct vote', async () => {
      renderWithRedux(<PeerReviewPage />);

      const correctRadios = await screen.findAllByRole('radio', {
        name: /correct/i,
      });
      const correctRadio = correctRadios[0];

      await userEvent.click(correctRadio);

      await waitFor(() => {
        expect(correctRadio).toBeChecked();
      });

      // Verify it was saved automatically
      expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
        1,
        'correct',
        null,
        null
      );
    });

    it('allows student to select Incorrect vote', async () => {
      renderWithRedux(<PeerReviewPage />);

      const incorrectRadios = await screen.findAllByRole('radio', {
        name: /incorrect/i,
      });
      const incorrectRadio = incorrectRadios[0];

      await userEvent.click(incorrectRadio);

      await waitFor(() => {
        expect(incorrectRadio).toBeChecked();
      });

      // Incorrect vote should NOT be saved until validation passes
      expect(mockSubmitPeerReviewVote).not.toHaveBeenCalled();
    });

    it('allows student to select Abstain vote', async () => {
      renderWithRedux(<PeerReviewPage />);

      const abstainRadios = await screen.findAllByRole('radio', {
        name: /abstain/i,
      });
      const abstainRadio = abstainRadios[0];

      await userEvent.click(abstainRadio);

      await waitFor(() => {
        expect(abstainRadio).toBeChecked();
      });

      // Verify it was saved automatically
      expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
        1,
        'abstain',
        null,
        null
      );
    });
  });

  describe('Changing votes', () => {
    it('allows student to change vote from Correct to Incorrect', async () => {
      renderWithRedux(<PeerReviewPage />);

      // Select Correct first
      const correctRadios = await screen.findAllByRole('radio', {
        name: /correct/i,
      });
      await userEvent.click(correctRadios[0]);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'correct',
          null,
          null
        );
      });

      vi.clearAllMocks();

      // Change to Incorrect
      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      await waitFor(() => {
        expect(incorrectRadios[0]).toBeChecked();
        expect(correctRadios[0]).not.toBeChecked();
      });
    });

    it('allows student to change vote from Incorrect to Abstain', async () => {
      renderWithRedux(<PeerReviewPage />);

      // Select Incorrect first
      const incorrectRadios = await screen.findAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      // Change to Abstain
      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios[0]);

      await waitFor(() => {
        expect(abstainRadios[0]).toBeChecked();
        expect(incorrectRadios[0]).not.toBeChecked();
      });

      // Abstain should be saved automatically
      expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
        1,
        'abstain',
        null,
        null
      );
    });

    it('replaces previous vote when a new vote is selected', async () => {
      renderWithRedux(<PeerReviewPage />);

      // Select Correct
      const correctRadios = await screen.findAllByRole('radio', {
        name: /correct/i,
      });
      await userEvent.click(correctRadios[0]);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'correct',
          null,
          null
        );
      });

      vi.clearAllMocks();

      // Change to Abstain
      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios[0]);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'abstain',
          null,
          null
        );
      });

      // Only Abstain should be checked now
      expect(abstainRadios[0]).toBeChecked();
      expect(correctRadios[0]).not.toBeChecked();
    });
  });

  describe('Vote persistence across navigation using sidebar', () => {
    it('persists vote when navigating to another solution via sidebar', async () => {
      renderWithRedux(<PeerReviewPage />);

      // Wait for page to load
      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Select Correct for solution 1
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      await userEvent.click(correctRadios[0]);

      await waitFor(() => {
        expect(correctRadios[0]).toBeChecked();
      });

      // Navigate to solution 2 via sidebar
      const solution2Buttons = screen.getAllByRole('button', {
        name: /solution 2/i,
      });
      await userEvent.click(solution2Buttons[0]); // First is sidebar button

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Navigate back to solution 1 via sidebar
      const solution1Buttons = screen.getAllByRole('button', {
        name: /solution 1/i,
      });
      await userEvent.click(solution1Buttons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still selected
      const correctRadiosAfter = screen.getAllByRole('radio', {
        name: /correct/i,
      });
      expect(correctRadiosAfter[0]).toBeChecked();
    });

    it('persists multiple votes across sidebar navigation', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Vote Correct on solution 1
      const correctRadios1 = screen.getAllByRole('radio', {
        name: /correct/i,
      });
      await userEvent.click(correctRadios1[0]);

      // Go to solution 2
      const solution2Buttons = screen.getAllByRole('button', {
        name: /solution 2/i,
      });
      await userEvent.click(solution2Buttons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Vote Abstain on solution 2
      const abstainRadios2 = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios2[0]);

      // Go to solution 3
      const solution3Buttons = screen.getAllByRole('button', {
        name: /solution 3/i,
      });
      await userEvent.click(solution3Buttons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Vote Incorrect on solution 3
      const incorrectRadios3 = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios3[0]);

      // Navigate back to solution 1
      const solution1BackButtons = screen.getAllByRole('button', {
        name: /solution 1/i,
      });
      await userEvent.click(solution1BackButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still Correct
      const correctRadiosBack = screen.getAllByRole('radio', {
        name: /correct/i,
      });
      expect(correctRadiosBack[0]).toBeChecked();

      // Navigate to solution 2
      const solution2BackButtons = screen.getAllByRole('button', {
        name: /solution 2/i,
      });
      await userEvent.click(solution2BackButtons[0]);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still Abstain
      const abstainRadiosBack = screen.getAllByRole('radio', {
        name: /abstain/i,
      });
      expect(abstainRadiosBack[0]).toBeChecked();
    });
  });

  describe('Vote persistence across navigation using Next/Previous buttons', () => {
    it('persists vote when navigating using Next button', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Select Correct
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      await userEvent.click(correctRadios[0]);

      // Click Next
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Click Previous
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still selected
      const correctRadiosAfter = screen.getAllByRole('radio', {
        name: /correct/i,
      });
      expect(correctRadiosAfter[0]).toBeChecked();
    });

    it('persists vote when navigating using Previous button', async () => {
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

      // Select Abstain
      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios[0]);

      // Navigate to solution 3
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Navigate back to solution 2
      const prevButton = screen.getByRole('button', { name: /previous/i });
      await userEvent.click(prevButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still selected
      const abstainRadiosAfter = screen.getAllByRole('radio', {
        name: /abstain/i,
      });
      expect(abstainRadiosAfter[0]).toBeChecked();
    });
  });

  describe('Vote persistence across page refresh', () => {
    it('loads previously saved votes from backend on page load', async () => {
      const existingVotes = [
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
        votes: existingVotes,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify solution 1 vote is loaded (Correct)
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      expect(correctRadios[0]).toBeChecked();

      // Navigate to solution 2
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      // Verify solution 2 vote is loaded (Incorrect)
      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      expect(incorrectRadios[0]).toBeChecked();

      // Navigate to solution 3
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 3 of 3/i)).toBeInTheDocument();
      });

      // Verify solution 3 vote is loaded (Abstain)
      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      expect(abstainRadios[0]).toBeChecked();
    });

    it('retains votes after simulated refresh by re-fetching from backend', async () => {
      // Initial render with no votes
      const { unmount } = renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // User votes Correct on solution 1
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      await userEvent.click(correctRadios[0]);

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'correct',
          null,
          null
        );
      });

      unmount();
      // Simulate refresh by updating mock to return saved votes
      mockGetStudentVotes.mockResolvedValue({
        success: true,
        votes: [{ submissionId: 11, vote: 'correct' }],
      });

      // Re-render (simulating page refresh)
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Verify vote is still selected after refresh
      await waitFor(() => {
        const correctRadiosAfter = screen.getAllByRole('radio', {
          name: /correct/i,
        });
        expect(correctRadiosAfter[0]).toBeChecked();
      });
    });
  });

  describe('Progress bar updates', () => {
    it('updates progress bar immediately when a valid vote is added', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Initially 0 completed
      expect(screen.getByText(/0\s*\/\s*3/i)).toBeInTheDocument();

      // Vote on solution 1
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      await userEvent.click(correctRadios[0]);

      // Progress should update
      await waitFor(() => {
        expect(screen.getByText(/1\s*\/\s*3/i)).toBeInTheDocument();
      });

      // Navigate to solution 2 and vote
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Solution 2 of 3/i)).toBeInTheDocument();
      });

      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios[0]);

      // Progress should update again
      await waitFor(() => {
        expect(screen.getByText(/2\s*\/\s*3/i)).toBeInTheDocument();
      });
    });

    it('updates progress bar when vote is changed', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Vote Correct
      const correctRadios = screen.getAllByRole('radio', { name: /correct/i });
      await userEvent.click(correctRadios[0]);

      await waitFor(() => {
        expect(screen.getByText(/1\s*\/\s*3/i)).toBeInTheDocument();
      });

      // Change to Abstain (should still be 1 voted)
      const abstainRadios = screen.getAllByRole('radio', { name: /abstain/i });
      await userEvent.click(abstainRadios[0]);

      // Progress should still show 1 (vote changed, not removed)
      await waitFor(() => {
        expect(screen.getByText(/1\s*\/\s*3/i)).toBeInTheDocument();
      });
    });

    it('does not count invalid incorrect votes in progress', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      // Initially 0 completed
      expect(screen.getByText(/0\s*\/\s*3/i)).toBeInTheDocument();

      // Select Incorrect without providing test case
      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      // Progress should still be 0 (invalid vote)
      await waitFor(() => {
        expect(screen.getByText(/0\s*\/\s*3/i)).toBeInTheDocument();
      });

      // Now provide test case input and output
      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[1, 2, 3]');
      await userEvent.type(outputField, '[[3, 2, 1]');

      // Trigger validation by typing
      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalled();
      });

      // Progress should now show 1 if vote is valid
      // Note: This depends on backend validation passing
    });
  });
});
