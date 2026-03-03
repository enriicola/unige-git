import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { ChallengeStatus } from '#js/constants';
import MatchContainer from '../app/student/challenges/[challengeId]/(components)/MatchContainer';
import MatchView from '../app/student/challenges/[challengeId]/(components)/MatchView';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';
import { given, when, andThen as then } from './bdd';
import { getMockedStore, getMockedStoreWrapper } from './test-redux-provider';

// Mocks
const mockGetStudentAssignedMatchSetting = vi.fn();
const mockGetStudentAssignedMatch = vi.fn();
const mockGetChallengeResults = vi.fn();
const mockSubmitSubmission = vi.fn();
const mockRunCode = vi.fn();
const mockGetLastSubmission = vi.fn();

vi.mock('#js/useChallenge', () => ({
  __esModule: true,
  default: () => ({
    getStudentAssignedMatchSetting: mockGetStudentAssignedMatchSetting,
    getStudentAssignedMatch: mockGetStudentAssignedMatch,
    getChallengeResults: mockGetChallengeResults,
    submitSubmission: mockSubmitSubmission,
    getLastSubmission: mockGetLastSubmission,
    runCode: mockRunCode,
  }),
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
  useParams: () => ({ challengeId: '123' }),
  useRouter: () => mockRouter,
}));

// Mock MatchView to isolate MatchContainer logic
vi.mock(
  '../app/student/challenges/[challengeId]/(components)/MatchView',
  () => ({
    default: vi.fn(
      ({
        loading,
        onRun,
        onSubmit,
        onTimerFinish,
        isSubmittingActive,
        isRunning,
        isSubmitting,
        message,
        error,
        isChallengeFinished,
        onStudentCodeChange,
      }) => {
        if (loading) return <div data-testid='loading'>Loading...</div>;
        if (error) return <div data-testid='error'>{error.message}</div>;

        return (
          <div data-testid='match-view'>
            <button
              type='button'
              onClick={onRun}
              disabled={isRunning || isSubmitting || isChallengeFinished}
              data-testid='run-btn'
            >
              Run
            </button>
            <button
              type='button'
              onClick={onSubmit}
              disabled={!isSubmittingActive}
              data-testid='submit-btn'
            >
              Submit
            </button>
            <button
              type='button'
              onClick={() => onStudentCodeChange('broken')}
              data-testid='set-bad-code'
            >
              Set bad code
            </button>
            <button
              type='button'
              onClick={onTimerFinish}
              data-testid='timer-finish-btn'
            >
              Finish Timer
            </button>
            {message && <div data-testid='message'>{message}</div>}
            {isChallengeFinished && (
              <div data-testid='challenge-finished'>Challenge Finished</div>
            )}
          </div>
        );
      }
    ),
  })
);

describe('RT-4 Code Submission', () => {
  const studentId = 1;
  const challengeId = '123';
  const sampleStudentCode = 'int answer = 0;';

  // Helper to click run button and wait for completion
  const clickRunAndWait = async () => {
    fireEvent.click(screen.getByTestId('run-btn'));
    // Wait for the mock run to complete (uses real setTimeout of 300ms in component)
    // Add extra buffer to ensure state updates propagate
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  };

  const renderMatchContainer = (stateOverrides = {}) => {
    const baseState = {
      auth: { user: { id: studentId, role: 'student' }, isLoggedIn: true },
    };
    const preloadedState = {
      ...baseState,
      ...stateOverrides,
      auth: {
        ...baseState.auth,
        ...(stateOverrides.auth || {}),
      },
    };

    return render(
      <MatchContainer challengeId={challengeId} studentId={studentId} />,
      {
        wrapper: getMockedStoreWrapper(preloadedState),
      }
    );
  };

  const renderMatchContainerWithDuration = ({
    stateOverrides = {},
    durationValue,
  }) => {
    const baseState = {
      auth: { user: { id: studentId, role: 'student' }, isLoggedIn: true },
    };
    const preloadedState = {
      ...baseState,
      ...stateOverrides,
      auth: {
        ...baseState.auth,
        ...(stateOverrides.auth || {}),
      },
    };
    const store = getMockedStore(preloadedState);
    const renderResult = render(
      <Provider store={store}>
        <DurationProvider value={durationValue}>
          <MatchContainer challengeId={challengeId} studentId={studentId} />
        </DurationProvider>
      </Provider>
    );

    const rerenderWithDuration = (nextValue) => {
      renderResult.rerender(
        <Provider store={store}>
          <DurationProvider value={nextValue}>
            <MatchContainer challengeId={challengeId} studentId={studentId} />
          </DurationProvider>
        </Provider>
      );
    };

    return { ...renderResult, rerenderWithDuration };
  };

  const setStudentCodeValue = (value) => {
    const { calls } = vi.mocked(MatchView).mock;
    const lastCall = calls[calls.length - 1];
    lastCall[0].onStudentCodeChange(value);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default successful match setting response
    mockGetStudentAssignedMatchSetting.mockResolvedValue({
      success: true,
      data: {
        starterCode: 'int main() {\n  // STUDENT_CODE\n  return 0;\n}\n',
        problemTitle: 'Test Problem',
        testCases: [],
      },
    });
    // Default successful match response
    mockGetStudentAssignedMatch.mockResolvedValue({
      success: true,
      data: {
        id: 456,
      },
    });
    // Default successful submission response
    mockSubmitSubmission.mockResolvedValue({
      success: true,
    });
    mockRunCode.mockResolvedValue({
      success: true,
      data: { isCompiled: true, isPassed: true, results: [] },
    });
    mockGetLastSubmission.mockResolvedValue({
      success: true,
      data: { submission: { code: 'int main() {}' } },
    });
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        submissionSummary: {
          hasManualSubmission: true,
          hasAutomaticSubmission: false,
          automaticStatus: null,
          finalIsAutomatic: false,
        },
        finalization: {
          resultsReady: true,
          totalMatches: 1,
          finalSubmissionCount: 1,
          pendingFinalCount: 0,
        },
      },
    });
  });

  afterEach(() => {
    // Clean up
  });

  it('should enable submit button only after running code', async () => {
    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await then(async () => {
      const submitBtn = screen.getByTestId('submit-btn');
      expect(submitBtn).toBeDisabled();
    });

    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });
  });

  it('should submit code successfully when submit button is clicked', async () => {
    mockSubmitSubmission.mockResolvedValue({
      success: true,
      data: {
        publicTestResults: [{ passed: true }, { passed: true }],
        privateTestResults: [{ passed: true }, { passed: true }],
        isCompiled: true,
        isPassed: true,
      },
    });

    await given(async () => {
      renderMatchContainer();
    });

    // Wait for component to be fully loaded
    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      expect(mockSubmitSubmission).toHaveBeenCalledWith({
        matchId: 456,
        code: expect.any(String),
      });
      await waitFor(
        () => {
          expect(screen.getByTestId('message')).toHaveTextContent(
            'Thanks for your submission.'
          );
        },
        { timeout: 2000 }
      );
    });
  });

  it('persists last successful submission in the store', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    const store = getMockedStore({
      auth: { user: { id: studentId, role: 'student' }, isLoggedIn: true },
    });

    await given(async () => {
      render(
        <Provider store={store}>
          <MatchContainer challengeId={challengeId} studentId={studentId} />
        </Provider>
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(mockSubmitSubmission).toHaveBeenCalledWith({
          matchId: 456,
          code: expect.any(String),
        });
      });
      await waitFor(() => {
        const entry =
          store.getState().ui.challengeDrafts?.[studentId]?.['match-456'];
        expect(entry?.lastSuccessful).toEqual({
          imports: '#include <iostream>',
          studentCode: sampleStudentCode,
        });
      });
    });
  });

  it('re-submits last successful code if new submission fails to compile', async () => {
    const goodCode = 'int ok = 1;';
    const badCode = 'broken';

    mockSubmitSubmission.mockImplementation(({ code }) =>
      Promise.resolve({ success: !code.includes(badCode) })
    );
    mockGetLastSubmission.mockResolvedValue({
      success: true,
      data: { submission: { code: goodCode } },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(goodCode);
    });

    // First run + submit with good code
    await when(async () => {
      await clickRunAndWait();
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    // Update code to a bad one and try submitting again
    await when(async () => {
      fireEvent.click(screen.getByTestId('set-bad-code'));
      fireEvent.click(screen.getByTestId('run-btn'));
    });

    // Trigger submit with bad code first then fallback to last success
    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(mockSubmitSubmission).toHaveBeenCalledTimes(2);
      });
      const secondCall = mockSubmitSubmission.mock.calls[1][0];
      expect(secondCall.matchId).toBe(456);
      expect(secondCall.code).toContain(badCode);
      expect(mockGetLastSubmission).toHaveBeenCalledWith(456);
    });
  });

  it('should handle submission failure', async () => {
    mockSubmitSubmission.mockResolvedValueOnce({
      success: false,
      error: { message: 'Compilation failed' },
    });
    mockGetLastSubmission.mockResolvedValueOnce({
      success: false,
      error: { message: 'No submission found' },
    });

    await given(async () => {
      renderMatchContainer();
    });

    // Wait for component to be fully loaded
    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
        },
        { timeout: 2000 }
      );
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(screen.getByText(/Compilation failed/)).toBeInTheDocument();
        },
        { timeout: 2000 }
      );
    });
  });

  it('auto-submits even if the student never ran the code', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    await given(async () => {
      renderMatchContainer();
    });

    // Wait for component to be fully loaded
    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(mockRunCode).toHaveBeenCalledWith({
            matchSettingId: challengeId,
            code: expect.any(String),
            language: 'cpp',
          });
          expect(mockSubmitSubmission).toHaveBeenCalledWith({
            matchId: 456,
            code: expect.any(String),
            isAutomatic: true,
          });
        },
        { timeout: 2000 }
      );
    });
  });

  it('auto-runs and auto-submits when the coding phase ends and public tests pass', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    const { rerenderWithDuration } = renderMatchContainerWithDuration({
      durationValue: { status: ChallengeStatus.STARTED_PHASE_ONE },
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    const runCallsBeforeTimer = mockRunCode.mock.calls.length;

    await act(async () => {
      rerenderWithDuration({ status: ChallengeStatus.ENDED_PHASE_ONE });
    });

    fireEvent.click(screen.getByTestId('timer-finish-btn'));
    // -----------------------------------------------------------

    await waitFor(
      () => {
        expect(mockRunCode.mock.calls.length).toBeGreaterThan(
          runCallsBeforeTimer
        );
        expect(mockSubmitSubmission).toHaveBeenCalledWith({
          matchId: 456,
          code: expect.any(String),
          isAutomatic: true,
        });
      },
      { timeout: 2000 }
    );
  });

  it('runs at phase end but does not auto-submit when public tests fail', async () => {
    mockRunCode.mockResolvedValue({
      success: true,
      data: { isCompiled: true, isPassed: false, results: [] },
    });

    const { rerenderWithDuration } = renderMatchContainerWithDuration({
      durationValue: { status: ChallengeStatus.STARTED_PHASE_ONE },
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await act(async () => {
      rerenderWithDuration({ status: ChallengeStatus.ENDED_PHASE_ONE });
    });

    await waitFor(() => {
      expect(screen.getByTestId('message')).toHaveTextContent(
        'You submitted your code.'
      );
    });
    expect(mockSubmitSubmission).not.toHaveBeenCalled();
  });

  it('auto-submits the latest code after a successful run without manual submit', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      await clickRunAndWait();
    });
    const runCallsBeforeTimer = mockRunCode.mock.calls.length;

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(
        () => {
          expect(mockRunCode.mock.calls.length).toBeGreaterThan(
            runCallsBeforeTimer
          );
          expect(mockSubmitSubmission).toHaveBeenCalledWith({
            matchId: 456,
            code: expect.any(String),
            isAutomatic: true,
          });
        },
        { timeout: 2000 }
      );
    });
  });

  it('does not auto-submit when public tests fail at time up', async () => {
    mockRunCode.mockResolvedValue({
      success: true,
      data: { isCompiled: true, isPassed: false, results: [] },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(mockRunCode).toHaveBeenCalled();
      });
      expect(mockSubmitSubmission).not.toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByTestId('message')).toHaveTextContent(
          'You submitted your code.'
        );
      });
    });
  });

  it('shows a waiting message until submission finalization is completed', async () => {
    mockGetChallengeResults.mockResolvedValue({
      success: true,
      data: {
        submissionSummary: null,
        finalization: {
          resultsReady: false,
          totalMatches: 1,
          finalSubmissionCount: 0,
          pendingFinalCount: 1,
        },
      },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('message')).toHaveTextContent(
          'The coding phase has ended. We are finalizing your submission. Please wait.'
        );
      });
      expect(mockGetChallengeResults).toHaveBeenCalled();
    });
  }, 15000);

  // RT-4 AC: Automatic submission when timer reaches zero
  it('AC: should show submission message on automatic submission success', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });
    mockGetStudentAssignedMatch.mockResolvedValue({
      success: true,
      data: { id: 456 },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.queryByTestId('challenge-finished')).toBeInTheDocument();
      });
      await waitFor(() => {
        const message = screen.getByTestId('message');
        expect(message).toHaveTextContent('You submitted your code.');
      });
    });
  });

  // RT-4 AC: Automatic submission failure handling
  it('AC: should keep last submission message on automatic submission failure', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: false });
    mockGetStudentAssignedMatch.mockResolvedValue({
      success: true,
      data: { id: 456 },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.queryByTestId('challenge-finished')).toBeInTheDocument();
      });
      await waitFor(() => {
        const message = screen.getByTestId('message');
        expect(message).toHaveTextContent('You submitted your code.');
      });
    });
  });

  // RT-4 AC: Submit button disabled after timer expires
  it('AC: should disable submit button when challenge is finished', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });
    mockGetStudentAssignedMatch.mockResolvedValue({
      success: true,
      data: { id: 456 },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button first
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
      });
    });

    // Trigger timer finish
    await when(async () => {
      fireEvent.click(screen.getByTestId('timer-finish-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.queryByTestId('challenge-finished')).toBeInTheDocument();
      });
      // Submit button should remain disabled
      expect(screen.getByTestId('submit-btn')).toBeDisabled();
    });
  });

  // RT-4 AC: Stored submission is linked to correct student_id and match_id
  it('AC: should include correct matchId and code in submission', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
      });
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(mockSubmitSubmission).toHaveBeenCalledWith({
          matchId: 456,
          code: expect.any(String),
        });
      });
    });
  });

  // RT-4 AC: Run button should be disabled when submitting
  it('AC: should disable run button while submitting', async () => {
    let resolveSubmission;
    const submissionPromise = new Promise((resolve) => {
      resolveSubmission = resolve;
    });
    mockSubmitSubmission.mockReturnValue(submissionPromise);

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
      });
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('run-btn')).toBeDisabled();
      });
    });

    // Resolve submission
    await act(async () => {
      resolveSubmission({ success: true });
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('run-btn')).not.toBeDisabled();
      });
    });
  });

  // RT-4 AC: Error handling for missing match
  it('AC: should display error if match cannot be found during submission', async () => {
    mockGetStudentAssignedMatch.mockResolvedValue({
      success: false,
      message: 'Match not found',
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    await act(async () => {
      setStudentCodeValue(sampleStudentCode);
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
      });
    });

    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('No match found');
      });
    });
  });

  // RT-4 AC: Error handling for empty code submission
  it('AC: should prevent submission of empty code', async () => {
    mockSubmitSubmission.mockResolvedValue({ success: true });

    // Setup - code will default to template initially
    mockGetStudentAssignedMatchSetting.mockResolvedValue({
      success: true,
      data: {
        starterCode: 'int main() {\n  // STUDENT_CODE\n  return 0;\n}\n',
        problemTitle: 'Test Problem',
        testCases: [],
      },
    });

    await given(async () => {
      renderMatchContainer();
    });

    await waitFor(() => {
      expect(screen.getByTestId('match-view')).toBeInTheDocument();
    });

    // Simulate user clearing the code
    await act(async () => {
      const { calls } = vi.mocked(MatchView).mock;
      const lastCall = calls[calls.length - 1];
      const { onStudentCodeChange } = lastCall[0];
      onStudentCodeChange('');
    });

    // Enable submit button
    await when(async () => {
      await clickRunAndWait();
    });

    await then(async () => {
      await waitFor(() => {
        expect(screen.getByTestId('submit-btn')).not.toBeDisabled();
      });
    });

    // Click submit
    await when(async () => {
      fireEvent.click(screen.getByTestId('submit-btn'));
    });

    await then(async () => {
      // Verify validation: submission should NOT be called
      expect(mockSubmitSubmission).not.toHaveBeenCalled();
    });
  });
});
