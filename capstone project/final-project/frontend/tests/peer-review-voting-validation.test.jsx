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
  mockToast,
  mockUseRoleGuard,
  renderWithRedux,
} from './peer-review-voting.mocks';

let PeerReviewPage;

beforeAll(async () => {
  ({ default: PeerReviewPage } =
    await import('../app/student/challenges/[challengeId]/peer-review/page'));
});

describe('RT-181: Incorrect Vote Validation', () => {
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
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty field validation', () => {
    it('shows warning when Incorrect is selected without providing fields', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      await waitFor(() => {
        expect(screen.getByText(/This vote won't count/i)).toBeInTheDocument();
      });

      expect(mockSubmitPeerReviewVote).not.toHaveBeenCalled();
    });

    it('shows warning when only input is provided', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      await userEvent.type(inputField, '[[1, 2]');

      await waitFor(() => {
        expect(screen.getByText(/This vote won't count/i)).toBeInTheDocument();
      });
    });

    it('shows warning when only output is provided', async () => {
      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const outputField = await screen.findByLabelText(/Expected Output/i);
      await userEvent.type(outputField, '[[3, 4]');

      await waitFor(() => {
        expect(screen.getByText(/This vote won't count/i)).toBeInTheDocument();
      });
    });
  });

  describe('Array format validation', () => {
    it('shows error when input is not a valid array', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: false,
        error: {
          message: 'Input and output must be valid array values',
        },
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, 'not an array');
      await userEvent.type(outputField, '[[1]');

      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText(/valid array values/i)).toBeInTheDocument();
      });
    });

    it('shows error when output is not a valid array', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: false,
        error: {
          message: 'Input and output must be valid array values',
        },
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[1, 2]');
      await userEvent.type(outputField, 'invalid');

      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText(/valid array values/i)).toBeInTheDocument();
      });
    });

    it('accepts valid array with numbers', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: true,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[1, 2, 3]');
      await userEvent.type(outputField, '[[3, 2, 1]');

      await userEvent.tab();

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'incorrect',
          '[1, 2, 3]',
          '[3, 2, 1]'
        );
      });
    });

    it('accepts valid array with strings', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: true,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[ "a", "b", "c" ]');
      await userEvent.type(outputField, '[[ "c", "b", "a" ]');

      await userEvent.tab();

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'incorrect',
          '[ "a", "b", "c" ]',
          '[ "c", "b", "a" ]'
        );
      });
    });

    it('accepts valid array with booleans', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: true,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[true, false]');
      await userEvent.type(outputField, '[[false, true]');

      await userEvent.tab();

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'incorrect',
          '[true, false]',
          '[false, true]'
        );
      });
    });

    it('accepts mixed type arrays', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: true,
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[1, "a", true]');
      await userEvent.type(outputField, '[[true, "a", 1]');

      await userEvent.tab();

      await waitFor(() => {
        expect(mockSubmitPeerReviewVote).toHaveBeenCalledWith(
          1,
          'incorrect',
          '[1, "a", true]',
          '[true, "a", 1]'
        );
      });
    });
  });

  describe('Public test case detection', () => {
    it('shows error when test case matches a public test', async () => {
      mockSubmitPeerReviewVote.mockResolvedValue({
        success: false,
        error: {
          message: 'You cannot use public test cases',
        },
      });

      renderWithRedux(<PeerReviewPage />);

      await waitFor(() => {
        expect(screen.getByText(/Solution 1 of 3/i)).toBeInTheDocument();
      });

      const incorrectRadios = screen.getAllByRole('radio', {
        name: /incorrect/i,
      });
      await userEvent.click(incorrectRadios[0]);

      const inputField = await screen.findByLabelText(/Test Case Input/i);
      const outputField = await screen.findByLabelText(/Expected Output/i);

      await userEvent.type(inputField, '[[1, 2, 3]');
      await userEvent.type(outputField, '[[6]');

      await userEvent.tab();

      await waitFor(() => {
        expect(mockToast.error).toHaveBeenCalledWith(
          expect.stringContaining('public test')
        );
      });
    });
  });
});
