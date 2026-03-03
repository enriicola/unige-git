'use client';

const normalizeMultilineValue = (value) =>
  typeof value === 'string' ? value.replace(/\\n/g, '\n') : value;

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string') return normalizeMultilineValue(value);
  try {
    return normalizeMultilineValue(JSON.stringify(value));
  } catch {
    return normalizeMultilineValue(String(value));
  }
};

const renderValue = (value) => (
  <span className='whitespace-pre-wrap'>{formatValue(value)}</span>
);

const getVoteLabel = (vote) => {
  if (vote === 'correct') return 'Correct';
  if (vote === 'incorrect') return 'Incorrect';
  return 'Abstain';
};

const getEvaluationLabel = (evaluation) => {
  if (evaluation === 'correct') return 'Correct';
  if (evaluation === 'incorrect') return 'Incorrect';
  return 'Unknown';
};

const getResultCardClasses = (passed) => {
  if (passed) {
    return 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-500/10';
  }
  return 'border-rose-200 bg-rose-50/70 dark:border-rose-400/40 dark:bg-rose-500/10';
};

const getResultStatusClasses = (passed) => {
  if (passed) {
    return 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-500/15';
  }
  return 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-500/15';
};

const getIncorrectTestStatus = ({
  vote,
  isExpectedOutputCorrect,
  isVoteCorrect,
}) => {
  if (vote !== 'incorrect') return null;

  const hasExpectedFlag = typeof isExpectedOutputCorrect === 'boolean';
  const hasVoteFlag = typeof isVoteCorrect === 'boolean';

  if (hasExpectedFlag && isExpectedOutputCorrect === false) {
    return {
      tone: 'incorrect',
      label: 'Test is incorrect for the reference solution.',
    };
  }

  if (hasVoteFlag && isVoteCorrect === false) {
    return {
      tone: 'incorrect',
      label: 'Reviewed solution was correct.',
    };
  }

  if (hasExpectedFlag && hasVoteFlag) {
    return {
      tone: 'correct',
      label: 'Test is correct and exposes a bug.',
    };
  }

  return {
    tone: 'neutral',
    label: 'Test evaluation pending.',
  };
};

const formatEvaluationStatus = (status) => {
  if (!status) return null;
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const getTestBadgeClass = (tone) => {
  if (tone === 'correct') {
    return 'border-emerald-200 bg-emerald-100 text-emerald-700 dark:border-emerald-400/50 dark:bg-emerald-500/15 dark:text-emerald-200';
  }
  if (tone === 'incorrect') {
    return 'border-rose-200 bg-rose-100 text-rose-700 dark:border-rose-400/50 dark:bg-rose-500/15 dark:text-rose-200';
  }
  return 'border-border bg-muted text-muted-foreground';
};

const hasVisibleValue = (value) =>
  value !== null && value !== undefined && value !== '';

export default function PeerReviewVoteResultCard({
  title,
  vote,
  expectedEvaluation,
  isCorrect,
  testCaseInput,
  expectedOutput,
  referenceOutput,
  actualOutput,
  isExpectedOutputCorrect,
  isVoteCorrect,
  evaluationStatus,
  voteLabelText = 'Your vote',
  expectedEvaluationLabelText = 'Expected evaluation',
  showExpectedEvaluation = true,
  actions = null,
}) {
  const expectedLabel = getEvaluationLabel(expectedEvaluation);
  const voteLabel = getVoteLabel(vote);
  const voteStatusLabel = isCorrect ? 'Correct' : 'Incorrect';
  const hasTestCase =
    vote === 'incorrect' &&
    (hasVisibleValue(testCaseInput) ||
      hasVisibleValue(expectedOutput) ||
      hasVisibleValue(referenceOutput) ||
      hasVisibleValue(actualOutput));
  const testStatus = hasTestCase
    ? getIncorrectTestStatus({
        vote,
        isExpectedOutputCorrect,
        isVoteCorrect,
      })
    : null;
  const evaluationStatusText = formatEvaluationStatus(evaluationStatus);

  return (
    <div className={`rounded-xl border p-4 ${getResultCardClasses(isCorrect)}`}>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${getResultStatusClasses(
            isCorrect
          )}`}
        >
          {voteStatusLabel}
        </span>
      </div>
      <div className='mt-3 rounded-lg border border-border/60 bg-background/80 p-3 text-xs text-foreground space-y-1 dark:bg-slate-950/40'>
        <p>
          <span className='font-semibold'>{voteLabelText}:</span> {voteLabel}
        </p>
        {showExpectedEvaluation ? (
          <p>
            <span className='font-semibold'>
              {expectedEvaluationLabelText}:
            </span>{' '}
            {expectedLabel}
          </p>
        ) : null}
      </div>
      {hasTestCase ? (
        <div className='mt-3 rounded-lg border border-border bg-background p-3 space-y-2 dark:bg-slate-950/30'>
          <div className='flex flex-wrap items-center justify-between gap-2'>
            <span className='text-xs font-semibold text-foreground'>
              Test provided
            </span>
            {testStatus ? (
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold ${getTestBadgeClass(
                  testStatus.tone
                )}`}
              >
                {testStatus.label}
              </span>
            ) : null}
          </div>
          <div className='grid gap-2 text-xs'>
            <div className='space-y-0.5'>
              <span className='font-semibold uppercase tracking-wide text-muted-foreground'>
                Input
              </span>
              <div className='rounded-md border border-border bg-muted/40 px-2 py-1 text-foreground'>
                {renderValue(testCaseInput)}
              </div>
            </div>
            <div className='space-y-0.5'>
              <span className='font-semibold uppercase tracking-wide text-muted-foreground'>
                Expected output
              </span>
              <div className='rounded-md border border-border bg-muted/40 px-2 py-1 text-foreground'>
                {renderValue(expectedOutput)}
              </div>
            </div>
            <div className='space-y-0.5'>
              <span className='font-semibold uppercase tracking-wide text-muted-foreground'>
                Reference output
              </span>
              <div className='rounded-md border border-border bg-muted/40 px-2 py-1 text-foreground'>
                {renderValue(referenceOutput)}
              </div>
            </div>
            <div className='space-y-0.5'>
              <span className='font-semibold uppercase tracking-wide text-muted-foreground'>
                Reviewed output
              </span>
              <div className='rounded-md border border-border bg-muted/40 px-2 py-1 text-foreground'>
                {renderValue(actualOutput)}
              </div>
            </div>
          </div>
          {evaluationStatusText ? (
            <p className='text-[0.72rem] font-semibold text-muted-foreground'>
              Status: {evaluationStatusText}
            </p>
          ) : null}
        </div>
      ) : null}
      {actions ? <div className='mt-3'>{actions}</div> : null}
    </div>
  );
}
