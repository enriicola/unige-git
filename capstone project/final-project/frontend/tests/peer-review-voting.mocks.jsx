import { vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ChallengeStatus } from '#js/constants';

vi.mock('next/dynamic', () => ({
  default: () => {
    function FakeMonaco({ value }) {
      return <pre data-testid='code-editor'>{value}</pre>;
    }
    return FakeMonaco;
  },
}));

export const mockPush = vi.fn();
export const mockRouter = { push: mockPush };
export const mockToast = {
  success: vi.fn(),
  error: vi.fn(),
  custom: vi.fn(),
  dismiss: vi.fn(),
};

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useParams: () => ({
    challengeId: '123',
  }),
}));

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: mockToast,
}));

export const mockUseRoleGuard = vi.fn();
vi.mock('#js/useRoleGuard', () => ({
  __esModule: true,
  default: () => mockUseRoleGuard(),
}));

export const mockGetStudentPeerReviewAssignments = vi.fn();
export const mockGetStudentVotes = vi.fn();
export const mockGetPeerReviewSummary = vi.fn();
export const mockSubmitPeerReviewVote = vi.fn();
export const mockExitPeerReview = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getStudentPeerReviewAssignments: mockGetStudentPeerReviewAssignments,
    getStudentVotes: mockGetStudentVotes,
    getPeerReviewSummary: mockGetPeerReviewSummary,
    submitPeerReviewVote: mockSubmitPeerReviewVote,
    exitPeerReview: mockExitPeerReview,
  }),
}));

export const mockRedirectOnError = vi.fn();
vi.mock('#js/useApiErrorRedirect', () => ({
  __esModule: true,
  default: () => mockRedirectOnError,
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

export const renderWithRedux = (component) =>
  render(<Provider store={createTestStore()}>{component}</Provider>);

export const baseChallenge = {
  id: 123,
  status: ChallengeStatus.STARTED_PHASE_TWO,
  startPhaseTwoDateTime: new Date(Date.now() - 1000 * 60).toISOString(),
  durationPeerReview: 30,
};

export const assignmentsMock = [
  {
    id: 1,
    submissionId: 11,
    code: 'function solve(arr) { return arr[0]; }',
  },
  {
    id: 2,
    submissionId: 22,
    code: 'function solve(arr) { return arr.reverse(); }',
  },
  {
    id: 3,
    submissionId: 33,
    code: 'function solve(arr) { return arr.sort(); }',
  },
];
