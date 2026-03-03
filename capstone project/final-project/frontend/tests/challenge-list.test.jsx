import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import ChallengeList from '#modules/challenge/list';

const mockDispatch = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

vi.mock('#js/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: (selector) =>
    selector({
      auth: { user: { id: 1, role: 'teacher' } },
      ui: { challengeCountdowns: {} },
    }),
  useAppStore: () => ({}),
}));

// Create stable mock functions outside the mock factory
const mockGetChallenges = vi.fn(async () => [
  {
    id: 1,
    title: 'Demo challenge',
    duration: 30,
    startDatetime: '2025-01-01T10:00:00.000Z',
    status: 'public',
  },
]);

const mockGetChallengeParticipants = vi.fn(async () => ({
  success: true,
  data: [],
}));

const mockAssignChallenge = vi.fn();
const mockAssignPeerReviews = vi.fn();
const mockStartPeerReview = vi.fn();
const mockPublishChallenge = vi.fn();
const mockValidate = vi.fn();

// Mock useFetchData to avoid Redux dependency
vi.mock('#js/useFetchData', () => ({
  default: () => ({
    fetchData: vi.fn(),
    loading: false,
  }),
}));

// We mock the hook so the test does not depend on a real backend.
vi.mock('#js/useChallenge', () => ({
  default: () => ({
    loading: false,
    getChallenges: mockGetChallenges,
    getChallengeParticipants: mockGetChallengeParticipants,
    publishChallenge: mockPublishChallenge,
    assignChallenge: mockAssignChallenge,
    assignPeerReviews: mockAssignPeerReviews,
    startPeerReview: mockStartPeerReview,
    startChallenge: vi.fn(),
  }),
}));

vi.mock('#js/useJsonSchema', () => ({
  default: () => ({
    validate: mockValidate,
    loading: false,
  }),
}));

describe('ChallengeList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetChallenges.mockResolvedValue([
      {
        id: 1,
        title: 'Demo challenge',
        duration: 30,
        startDatetime: '2025-01-01T10:00:00.000Z',
        status: 'public',
      },
    ]);
    mockGetChallengeParticipants.mockResolvedValue({
      success: true,
      data: [],
    });
    mockPublishChallenge.mockResolvedValue({ success: true });
    mockValidate.mockResolvedValue({
      valid: true,
      errors: [],
      fields: [],
    });
  });

  it('renders non-private challenges by default', async () => {
    render(<ChallengeList />);

    expect(
      await screen.findByText(/Demo challenge/i, {}, { timeout: 5000 })
    ).toBeInTheDocument();
    expect(screen.getByText(/Duration/i)).toBeInTheDocument();
  }, 10000);

  it('renders private challenges in the private view', async () => {
    mockGetChallenges.mockResolvedValueOnce([
      {
        id: 2,
        title: 'Private challenge',
        duration: 45,
        startDatetime: '2025-02-01T10:00:00.000Z',
        status: 'private',
        matchSettings: [{ id: 1 }],
      },
    ]);

    render(<ChallengeList scope='private' />);

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Private challenge' },
        { timeout: 5000 }
      )
    ).toBeInTheDocument();
  }, 10000);

  it('enables publish for valid private challenges', async () => {
    mockGetChallenges.mockResolvedValueOnce([
      {
        id: 3,
        title: 'Publishable challenge',
        duration: 45,
        startDatetime: '2025-03-01T10:00:00.000Z',
        endDatetime: '2025-03-01T12:00:00.000Z',
        durationPeerReview: 30,
        allowedNumberOfReview: 2,
        status: 'private',
        matchSettings: [{ id: 1 }],
      },
    ]);

    render(<ChallengeList scope='private' />);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Publish' })).toBeEnabled()
    );
    const publishButton = screen.getByRole('button', { name: 'Publish' });
    fireEvent.click(publishButton);

    await waitFor(() => expect(mockPublishChallenge).toHaveBeenCalledWith(3));
  }, 10000);

  it('disables publish for invalid private challenges', async () => {
    mockGetChallenges.mockResolvedValueOnce([
      {
        id: 4,
        title: '',
        duration: null,
        startDatetime: null,
        status: 'private',
        matchSettings: [],
      },
    ]);
    mockValidate.mockResolvedValueOnce({
      valid: false,
      errors: ['title is required'],
      fields: ['title'],
    });

    render(<ChallengeList scope='private' />);

    const publishButton = await screen.findByRole('button', {
      name: 'Publish',
    });
    expect(publishButton).toBeDisabled();
  }, 10000);
});
