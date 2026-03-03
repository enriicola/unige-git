import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import MatchView from '../app/student/challenges/[challengeId]/(components)/MatchView';
import { DurationProvider } from '../app/student/challenges/[challengeId]/(context)/DurationContext';

vi.mock('#components/common/Timer', () => ({
  __esModule: true,
  default: () => <div data-testid='timer'>Timer</div>,
}));

vi.mock(
  '../app/student/challenges/[challengeId]/(components)/CppEditor',
  () => ({
    __esModule: true,
    default: ({ value, onChange }) => (
      <textarea
        data-testid='cpp-editor'
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    ),
  })
);

const renderMatchView = (props) =>
  render(
    <DurationProvider
      value={{
        duration: 30,
        startPhaseOneDateTime: new Date().toISOString(),
        startDatetime: new Date().toISOString(),
      }}
    >
      <MatchView {...props} />
    </DurationProvider>
  );

const baseProps = {
  loading: false,
  error: null,
  message: null,
  challengeId: '123',
  matchData: {
    problemTitle: 'Test Problem',
    problemDescription: 'Test description',
    publicTests: [],
  },
  imports: '#include <iostream>',
  onImportsChange: vi.fn(),
  onImportsBlur: vi.fn(),
  importsWarning: '',
  studentCode: '',
  onStudentCodeChange: vi.fn(),
  fixedPrefix: '',
  fixedSuffix: '',
  finalCode: '',
  isRunning: false,
  isSubmitting: false,
  isSubmittingActive: true,
  peerReviewNotice: null,
  peerReviewPendingMessage: null,
  runResult: null,
  onRun: vi.fn(),
  onSubmit: vi.fn(),
  onTimerFinish: vi.fn(),
  isChallengeFinished: false,
  testResults: [],
  canSubmit: false,
  isTimeUp: false,
  isCompiled: null,
  onTryAgain: null,
  onClean: vi.fn(),
  onRestore: vi.fn(),
  hasRestorableCode: false,
  customTests: [],
  customTestResults: [],
  customRunResult: null,
  isCustomRunning: false,
  customRunOrder: [],
  onCustomTestAdd: vi.fn(),
  onCustomTestChange: vi.fn(),
  onCustomTestRemove: vi.fn(),
  onRunCustomTests: vi.fn(),
};

describe('MatchView custom tests', () => {
  it('renders custom tests and triggers handlers', () => {
    const props = {
      ...baseProps,
      customTests: [
        {
          id: 'test-1',
          input: '1 2',
          expectedOutput: '2 1',
        },
      ],
      customTestResults: [{ actualOutput: '2 1' }],
      customRunOrder: ['test-1'],
      customRunResult: { message: 'Custom tests executed.' },
    };

    renderMatchView(props);

    expect(screen.getByText('Custom tests')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1 2')).toBeInTheDocument();
    expect(screen.getByText(/Actual output: 2 1/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Input'), {
      target: { value: '3 4' },
    });

    expect(props.onCustomTestChange).toHaveBeenCalledWith(
      'test-1',
      'input',
      '3 4'
    );

    fireEvent.click(screen.getByRole('button', { name: /run custom tests/i }));
    expect(props.onRunCustomTests).toHaveBeenCalled();
  });

  it('shows placeholder when no custom tests are added', () => {
    renderMatchView(baseProps);

    expect(
      screen.getByText(/Add a custom test to try extra inputs/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Run your custom tests to see outputs/i)
    ).toBeInTheDocument();
  });
});
