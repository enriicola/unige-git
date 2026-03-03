import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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

const mockPush = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useParams: () => ({
    challengeId: '123',
  }),
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

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getStudentPeerReviewAssignments: mockGetStudentPeerReviewAssignments,
    getStudentVotes: mockGetStudentVotes,
    getPeerReviewSummary: mockGetPeerReviewSummary,
    submitPeerReviewVote: mockSubmitPeerReviewVote,
  }),
}));

vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => vi.fn(),
}));

vi.mock('#components/common/Button', () => {
  function Button({ children, ...props }) {
    return (
      <button type='button' {...props}>
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
  },
  {
    id: 2,
    submissionId: 22,
    code: 'console.log("solution 2");',
  },
];

describe('Peer Review – Student side acceptance criteria', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseRoleGuard.mockReturnValue({
      user: { id: 1, role: 'student' },
      isAuthorized: true,
    });

    mockGetStudentVotes.mockResolvedValue({
      success: true,
      votes: [],
    });
  });

  const renderWithRedux = (component) =>
    render(<Provider store={createTestStore()}>{component}</Provider>);

  it('shows waiting message before peer review starts', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: [],
      challenge: {
        ...baseChallenge,
        status: ChallengeStatus.STARTED_PHASE_ONE,
      },
    });

    renderWithRedux(<PeerReviewPage />);

    expect(
      await screen.findByText(
        /Wait for your teacher to start the peer review phase/i
      )
    ).toBeInTheDocument();
  });

  it('automatically loads peer review content when phase is active', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(
      await screen.findByText(/Review solutions and submit your assessment/i)
    ).toBeInTheDocument();
  });

  it('shows a countdown timer', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(await screen.findByText(/\d\d:\d\d:\d\d/)).toBeInTheDocument();
  });

  it('displays assigned solutions in the sidebar', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    const solution1 = await screen.findByRole('button', {
      name: /solution 1/i,
    });
    const solution2 = await screen.findByRole('button', {
      name: /solution 2/i,
    });

    expect(solution1).toBeInTheDocument();
    expect(solution2).toBeInTheDocument();
  });

  it('selects the first solution by default', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(
      await screen.findByText('console.log("solution 1");')
    ).toBeInTheDocument();
  });

  it('displays solution code in read-only mode', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    const codeBlock = await screen.findByText('console.log("solution 1");');
    expect(codeBlock.tagName.toLowerCase()).toBe('pre');
  });

  it('has Abstain selected by default', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    const abstainRadio = await screen.findByRole('radio', {
      name: /abstain/i,
    });

    expect(abstainRadio).toBeChecked();
  });

  it('shows progress bar at 0% initially', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(await screen.findByText(/0% completed/i)).toBeInTheDocument();
  });

  it('shows Exit button', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(
      await screen.findByRole('button', { name: /exit/i })
    ).toBeInTheDocument();
  });

  it('shows Summary button', async () => {
    mockGetStudentPeerReviewAssignments.mockResolvedValue({
      success: true,
      assignments: assignmentsMock,
      challenge: baseChallenge,
    });

    renderWithRedux(<PeerReviewPage />);

    expect(
      await screen.findByRole('button', { name: /summary/i })
    ).toBeInTheDocument();
  });
});
