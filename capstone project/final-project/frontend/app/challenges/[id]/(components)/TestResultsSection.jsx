'use client';

import {
  buildResultBadge,
  buildTestKey,
  formatValue,
  getResultCardClasses,
  getResultStatusClasses,
  getTestFailureDetails,
} from '../challengeDetailUtils';

export default function TestResultsSection({ title, results, emptyMessage }) {
  const safeResults = Array.isArray(results) ? results : [];
  const passedCount = safeResults.filter((result) => result.passed).length;
  const failedCount = safeResults.length - passedCount;
  const emptyText = emptyMessage || 'No test results available.';

  const renderValue = (value) => (
    <span className='whitespace-pre-wrap'>{formatValue(value)}</span>
  );

  return (
    <div className='space-y-2'>
      <div className='flex flex-wrap items-center justify-between gap-2'>
        <p className='text-sm font-semibold text-foreground'>{title}</p>
        <div className='flex flex-wrap items-center gap-2'>
          <span className={buildResultBadge(passedCount, 'success')}>
            {passedCount} Passed
          </span>
          <span className={buildResultBadge(failedCount, 'danger')}>
            {failedCount} Failed
          </span>
        </div>
      </div>
      {safeResults.length === 0 ? (
        <p className='text-xs text-muted-foreground'>{emptyText}</p>
      ) : (
        <div className='space-y-2'>
          {safeResults.map((result) => {
            const failureDetails = getTestFailureDetails(result);
            return (
              <div
                key={buildTestKey(result)}
                className={`rounded-lg border p-3 ${getResultCardClasses(
                  result.passed
                )}`}
              >
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <p className='text-xs font-semibold text-foreground'>
                    Test{' '}
                    {Number.isInteger(result.testIndex)
                      ? result.testIndex + 1
                      : ''}
                  </p>
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${getResultStatusClasses(
                      result.passed
                    )}`}
                  >
                    {result.passed ? 'Passed' : 'Failed'}
                  </span>
                </div>
                <div className='mt-2 rounded-md border border-border/60 bg-background/80 p-2 text-[0.7rem] text-foreground space-y-1 dark:bg-slate-950/40'>
                  <p>
                    <span className='font-semibold'>Expected:</span>{' '}
                    {renderValue(result.expectedOutput)}
                  </p>
                  <p>
                    <span className='font-semibold'>Actual:</span>{' '}
                    {renderValue(result.actualOutput)}
                  </p>
                  {failureDetails ? (
                    <p className='text-rose-700 dark:text-rose-200'>
                      <span className='font-semibold'>Feedback:</span>{' '}
                      {renderValue(failureDetails)}
                    </p>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
