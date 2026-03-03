import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChallengeDetailPage from '../app/challenges/[id]/page';

const mockGetChallengeMatches = vi.fn();
const mockAssignChallenge = vi.fn();
const mockGetChallengeParticipants = vi.fn();
const mockStartChallenge = vi.fn();
const mockEndCodingPhase = vi.fn();
const mockAssignPeerReviews = vi.fn();
const mockUpdateExpectedReviews = vi.fn();
const mockStartPeerReview = vi.fn();
const mockEndPeerReview = vi.fn();
const mockUnpublishChallenge = vi.fn();
const mockEndChallenge = vi.fn();
const mockGetTeacherChallengeResults = vi.fn();
const mockAddMatchSettingPrivateTest = vi.fn();
const mockDispatch = vi.fn(() => Promise.resolve());

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getChallengeMatches: mockGetChallengeMatches,
    assignChallenge: mockAssignChallenge,
    getChallengeParticipants: mockGetChallengeParticipants,
    startChallenge: mockStartChallenge,
    endCodingPhase: mockEndCodingPhase,
    assignPeerReviews: mockAssignPeerReviews,
    updateExpectedReviews: mockUpdateExpectedReviews,
    startPeerReview: mockStartPeerReview,
    endPeerReview: mockEndPeerReview,
    unpublishChallenge: mockUnpublishChallenge,
    endChallenge: mockEndChallenge,
    getTeacherChallengeResults: mockGetTeacherChallengeResults,
    addMatchSettingPrivateTest: mockAddMatchSettingPrivateTest,
  }),
}));

const mockAuthState = {
  user: { id: 1, role: 'teacher' },
  isLoggedIn: true,
  loading: false,
};

vi.mock('#js/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) =>
    selector({
      auth: mockAuthState,
    }),
  useAppStore: () => ({}),
}));

vi.mock('#js/store/slices/auth', () => ({
  fetchUserInfo: () => async () => ({}),
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
  useParams: () => ({ id: '123' }),
  usePathname: () => '/challenges/123',
  useRouter: () => mockRouter,
}));

describe('ChallengeDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'public',
        startDatetime: new Date(Date.now() - 1000).toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: false,
      },
      assignments: [],
    });
    mockAssignChallenge.mockResolvedValue({ success: true });
    mockGetChallengeParticipants.mockResolvedValue({
      success: true,
      data: [{ id: 1 }, { id: 2 }],
    });
    mockStartChallenge.mockResolvedValue({ success: true });
    mockEndCodingPhase.mockResolvedValue({ success: true });
    mockAssignPeerReviews.mockResolvedValue({ success: true, results: [] });
    mockUpdateExpectedReviews.mockResolvedValue({ success: true });
    mockStartPeerReview.mockResolvedValue({ success: true });
    mockEndPeerReview.mockResolvedValue({ success: true });
    mockUnpublishChallenge.mockResolvedValue({ success: true });
    mockEndChallenge.mockResolvedValue({ success: true });
    mockGetTeacherChallengeResults.mockResolvedValue({
      success: true,
      data: {
        matchSettings: [],
      },
    });
    mockAddMatchSettingPrivateTest.mockResolvedValue({
      success: true,
      data: { added: true },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders Assign students button and triggers assignment + reload', async () => {
    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    const assignBtn = screen.getByRole('button', {
      name: /assign students/i,
    });
    expect(assignBtn).toBeInTheDocument();

    fireEvent.click(assignBtn);

    await waitFor(() =>
      expect(mockAssignChallenge).toHaveBeenCalledWith('123')
    );
    await waitFor(() =>
      expect(mockGetChallengeMatches.mock.calls.length).toBeGreaterThan(1)
    );
  });

  it('hides assign button when challenge is not public', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'assigned',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: false,
      },
      assignments: [],
    });
    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    const assignButtons = screen.queryAllByRole('button', {
      name: /assign students/i,
    });
    expect(assignButtons.length).toBe(0);
  });

  it('shows validation error when expected reviews is invalid', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'ended_phase_one',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 1,
        peerReviewReady: false,
        totalMatches: 0,
        finalSubmissionCount: 0,
        pendingFinalCount: 0,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    const assignBtn = screen.getByRole('button', { name: /assign/i });
    fireEvent.click(assignBtn);

    expect(
      screen.getByText(/whole number greater than or equal to 2/i)
    ).toBeInTheDocument();
    expect(mockAssignPeerReviews).not.toHaveBeenCalled();
  });

  it('shows Start Peer Review button when assignments are ready', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'ended_phase_one',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: true,
        totalMatches: 0,
        finalSubmissionCount: 0,
        pendingFinalCount: 0,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    expect(
      screen.getByRole('button', { name: /start peer review/i })
    ).toBeInTheDocument();
  });

  it('starts peer review when Start Peer Review is clicked', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'ended_phase_one',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: true,
        totalMatches: 0,
        finalSubmissionCount: 0,
        pendingFinalCount: 0,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    const startButton = screen.getByRole('button', {
      name: /start peer review/i,
    });
    fireEvent.click(startButton);

    await waitFor(() =>
      expect(mockStartPeerReview).toHaveBeenCalledWith('123')
    );
  });

  it('hides Assign button while submissions are still being finalized', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'ended_phase_one',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: false,
        totalMatches: 3,
        finalSubmissionCount: 1,
        pendingFinalCount: 2,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    expect(
      screen.queryByRole('button', { name: /^assign$/i })
    ).not.toBeInTheDocument();
  });

  it('unpublishes then redirects to edit when Edit is confirmed', async () => {
    const user = userEvent.setup();
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'public',
        startDatetime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: false,
      },
      assignments: [],
    });
    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    const editButton = screen.getByRole('button', { name: /edit/i });
    await user.click(editButton);

    const confirmButton = await screen.findByRole('button', {
      name: /unpublish & edit/i,
    });
    await user.click(confirmButton);

    await waitFor(() =>
      expect(mockUnpublishChallenge).toHaveBeenCalledWith('123')
    );
    expect(mockRouter.push).toHaveBeenCalledWith('/challenges/123/edit');
  });

  it('confirms ending the coding phase from the danger zone', async () => {
    const user = userEvent.setup();
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'started_phase_one',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: false,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    const endCodingButton = await screen.findByRole('button', {
      name: /end coding phase/i,
    });
    await user.click(endCodingButton);

    const dialog = await screen.findByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: /end coding phase/i,
    });
    await user.click(confirmButton);

    await waitFor(() => expect(mockEndCodingPhase).toHaveBeenCalledWith('123'));
  });

  it('shows the end peer review button only during peer review', async () => {
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'started_phase_two',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: true,
      },
      assignments: [],
    });

    render(<ChallengeDetailPage />);

    expect(
      await screen.findByRole('button', { name: /end peer review/i })
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /end coding phase/i })
    ).not.toBeInTheDocument();
  });

  it('shows joined student names when no matches are assigned', async () => {
    mockGetChallengeParticipants.mockResolvedValue({
      success: true,
      data: [
        { id: 1, studentId: 11, student: { username: 'mario.rossi' } },
        { id: 2, studentId: 12, student: { email: 'luca.bianchi@mail.com' } },
      ],
    });

    render(<ChallengeDetailPage />);

    expect(
      await screen.findByText(
        /No matches have been assigned yet for this challenge/i
      )
    ).toBeInTheDocument();
    expect(screen.getByText(/Joined students/i)).toBeInTheDocument();
    expect(screen.getByText('Mario Rossi')).toBeInTheDocument();
    expect(screen.getByText('Luca Bianchi')).toBeInTheDocument();
  });

  it('shows the votes cast by each student in teacher results', async () => {
    const user = userEvent.setup();
    mockGetChallengeMatches.mockResolvedValue({
      success: true,
      challenge: {
        id: 123,
        title: 'Sample Challenge',
        status: 'ended_phase_two',
        startDatetime: new Date().toISOString(),
        duration: 30,
        durationPeerReview: 15,
        allowedNumberOfReview: 2,
        peerReviewReady: true,
      },
      assignments: [],
    });
    mockGetTeacherChallengeResults.mockResolvedValue({
      success: true,
      data: {
        matchSettings: [
          {
            challengeMatchSettingId: 1,
            matchSetting: { id: 11, problemTitle: 'Sort an array' },
            matches: [
              {
                id: 201,
                student: { id: 1, firstName: 'Student', lastName: 'One' },
                submission: {
                  id: 301,
                  status: 'probably_correct',
                  code: 'int main() { return 0; }',
                  publicTestResults: [],
                  privateTestResults: [],
                  updatedAt: new Date().toISOString(),
                },
                peerReviewAssignments: [
                  {
                    id: 401,
                    reviewer: { id: 2, firstName: 'Student', lastName: 'Two' },
                    vote: {
                      vote: 'correct',
                      isVoteCorrect: true,
                    },
                  },
                ],
              },
              {
                id: 202,
                student: { id: 2, firstName: 'Student', lastName: 'Two' },
                submission: {
                  id: 302,
                  status: 'wrong',
                  code: 'int main() { return 1; }',
                  publicTestResults: [],
                  privateTestResults: [],
                  updatedAt: new Date().toISOString(),
                },
                peerReviewAssignments: [
                  {
                    id: 402,
                    reviewer: { id: 1, firstName: 'Student', lastName: 'One' },
                    vote: {
                      vote: 'correct',
                      isVoteCorrect: true,
                    },
                  },
                ],
              },
              {
                id: 203,
                student: { id: 3, firstName: 'Student', lastName: 'Three' },
                submission: {
                  id: 303,
                  status: 'wrong',
                  code: 'int main() { return 2; }',
                  publicTestResults: [],
                  privateTestResults: [],
                  updatedAt: new Date().toISOString(),
                },
                peerReviewAssignments: [
                  {
                    id: 403,
                    reviewer: { id: 1, firstName: 'Student', lastName: 'One' },
                    vote: {
                      vote: 'abstain',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    render(<ChallengeDetailPage />);

    await waitFor(() => expect(mockGetChallengeMatches).toHaveBeenCalled());

    await user.click(
      await screen.findByRole('button', { name: /view student results/i })
    );
    await waitFor(() =>
      expect(mockGetTeacherChallengeResults).toHaveBeenCalledWith('123', true)
    );

    await user.click(await screen.findByText(/Sort an array/i));
    const studentOneSummary = screen.getByText('Student One');
    await user.click(studentOneSummary);
    const studentOneContainer = studentOneSummary.closest('details');
    expect(studentOneContainer).not.toBeNull();
    await user.click(within(studentOneContainer).getByText(/Peer review/i));

    expect(
      await screen.findByText(/Vote for Student Two/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Vote for Student Three/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Student vote:/i).length).toBeGreaterThan(0);
    expect(
      within(studentOneContainer).queryByText(/Vote for Student One/i)
    ).not.toBeInTheDocument();
  });
});
