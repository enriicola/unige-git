'use client';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '#components/common/card';
import {
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
} from '#components/common/Table';
import { Button } from '#components/common/Button';

import Tooltip from '#components/common/Tooltip';
import Spinner from '#components/common/Spinner';

import { useState, useRef } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import Timer from '#components/common/Timer';
import logo from '#img/logo.jpg';
import CppEditor from './CppEditor';
import { useDuration } from '../(context)/DurationContext';

export default function MatchView({
  loading,
  error,
  message,
  challengeId,
  isWaitingForStart,
  matchData,
  imports,
  onImportsChange,
  onImportsBlur,
  importsWarning,
  studentCode,
  onStudentCodeChange,
  fixedPrefix,
  fixedSuffix,
  finalCode,
  isRunning,
  isSubmitting,
  isSubmittingActive,
  peerReviewNotice,
  peerReviewPendingMessage,
  runResult,
  onRun,
  onSubmit,
  onTimerFinish,
  isChallengeFinished,
  isFinalizationPending,
  testResults,
  canSubmit,
  isTimeUp,
  isCompiled,
  onTryAgain,
  onClean,
  onRestore,
  hasRestorableCode,
  draftSaveState,
  customTests,
  customTestResults,
  customRunResult,
  isCustomRunning,
  customRunOrder,
  onCustomTestAdd,
  onCustomTestChange,
  onCustomTestRemove,
  onRunCustomTests,
}) {
  const { duration, startPhaseOneDateTime, startDatetime } = useDuration();

  const phaseOneTimerStart = startPhaseOneDateTime || startDatetime;

  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const [finished, setFinished] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);

  const hasTimerFinished = useRef(false);
  const runResultClass = (() => {
    if (runResult?.type === 'error') return 'text-red-700 dark:text-red-400';
    if (runResult?.type === 'success')
      return 'text-green-700 dark:text-green-400';
    if (runResult?.type === 'info') return 'text-blue-700 dark:text-blue-400';
    return 'text-foreground';
  })();
  const customResultClass = (() => {
    if (customRunResult?.type === 'error')
      return 'text-red-700 dark:text-red-400';
    if (customRunResult?.type === 'success')
      return 'text-green-700 dark:text-green-400';
    if (customRunResult?.type === 'info')
      return 'text-blue-700 dark:text-blue-400';
    return 'text-foreground';
  })();
  const isBusy = isRunning || isSubmitting || isSubmittingFinal;
  const canSubmitNow =
    canSubmit && isSubmittingActive && !isSubmittingFinal && !isTimeUp;
  const canClean =
    Boolean(onClean) && !isBusy && !isTimeUp && !isChallengeFinished;
  const canRestore =
    Boolean(onRestore) &&
    hasRestorableCode &&
    !isBusy &&
    !isTimeUp &&
    !isChallengeFinished;
  const editorDisabled = isSubmittingFinal || isTimeUp || isChallengeFinished;
  const showImportsWarning = Boolean(importsWarning);
  let importsInputClassName =
    'w-full min-h-[96px] rounded-md border bg-background p-3 font-mono text-sm leading-relaxed';
  if (showImportsWarning) {
    importsInputClassName += ' border-amber-500';
  }
  const submitTitle = canSubmitNow
    ? 'Submit your solution for evaluation'
    : 'Run your code before submitting';
  const tryAgainTitle = isTimeUp
    ? 'View your submitted code'
    : 'Clear the results to try again';
  const actionButtonSize = 'sm';

  const saveIndicator = (() => {
    if (!draftSaveState) return null;
    if (draftSaveState === 'saving') {
      return (
        <div className='flex items-center gap-2 text-xs font-semibold text-amber-600'>
          <span
            className='h-3 w-3 rounded-full border-2 border-amber-400 border-t-transparent animate-spin'
            aria-hidden='true'
          />
          <span>Saving</span>
        </div>
      );
    }
    if (draftSaveState === 'saved') {
      return (
        <div className='flex items-center gap-2 text-xs font-semibold text-emerald-600'>
          <CheckCircle2 className='h-4 w-4' aria-hidden='true' />
          <span>Saved</span>
        </div>
      );
    }
    return null;
  })();

  const customResultMap = new Map();
  if (Array.isArray(customRunOrder)) {
    customRunOrder.forEach((id, index) => {
      const result = customTestResults?.[index];
      if (result) customResultMap.set(id, result);
    });
  }

  const normalizeMultilineValue = (value) =>
    typeof value === 'string' ? value.replace(/\\n/g, '\n') : value;

  const formatDisplayValue = (value) => {
    if (value === null || value === undefined || value === '') return '—';
    if (typeof value === 'string') return normalizeMultilineValue(value);
    try {
      return normalizeMultilineValue(JSON.stringify(value));
    } catch {
      return normalizeMultilineValue(String(value));
    }
  };

  const renderDisplayValue = (value) => (
    <span className='whitespace-pre-wrap'>{formatDisplayValue(value)}</span>
  );

  const formatCustomOutput = (value) => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'string') return value;
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  };

  const handleTimerEnd = async () => {
    if (hasTimerFinished.current) return;
    if (!duration || duration <= 0) return;

    hasTimerFinished.current = true;
    setIsSubmittingFinal(true);
    setSubmissionError(null);

    try {
      const result = await onSubmit();

      if (result === false || result?.success === false) {
        setSubmissionError('Your code did not compile successfully.');
      }
    } catch {
      setSubmissionError('Error during final submission.');
    } finally {
      setIsSubmittingFinal(false);
      setFinished(true);
    }
  };

  const timerFinishHandler = onTimerFinish || handleTimerEnd;
  const finalizationMessage =
    'The coding phase has ended. We are finalizing your submission. Please wait.';
  const showFinalizationPending = Boolean(isFinalizationPending);

  if (loading) {
    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardContent className='py-10 text-center text-sm text-muted-foreground'>
            Loading your match...
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isWaitingForStart) {
    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardHeader>
            <CardTitle>Challenge lobby</CardTitle>
            <CardDescription>
              You joined successfully. Please wait for your teacher to start the
              coding phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Keep this page open. A 5-second countdown will start as soon as
              the challenge begins.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !matchData) {
    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardHeader>
            <CardTitle>Match unavailable</CardTitle>
            <CardDescription>
              You cannot access this match right now.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className='text-sm text-red-500 dark:text-red-400'>
              {error?.message ||
                (typeof error === 'string' ? error : 'An error occurred')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardContent>
            <p className='text-sm pt-4'>
              Something went wrong while loading this match.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (finished) {
    let displayMessage = showFinalizationPending
      ? finalizationMessage
      : message || submissionError;
    if (!displayMessage) {
      displayMessage = 'The coding phase has ended.';
    }

    const finalNotice =
      peerReviewPendingMessage ||
      "Wait for the peer review phase to start so you can review your classmates' code.";

    return (
      <div
        className='max-w-4xl mx-auto py-10 space-y-4'
        data-testid='challenge-finished'
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Coding phase finished. Wait for peer review to start.
            </CardTitle>
            <CardDescription data-testid='message'>
              {displayMessage}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {peerReviewNotice ? (
              <p className='text-sm font-medium text-amber-700 mb-4'>
                {peerReviewNotice}
              </p>
            ) : null}
            {showFinalizationPending ? (
              <div className='mb-4 flex items-center gap-3 text-sm text-muted-foreground'>
                <img
                  src={logo.src}
                  alt='CodyMatch logo'
                  className='h-8 w-8 animate-spin'
                />
                <span>Finalizing your submission...</span>
              </div>
            ) : null}
            <p className='text-sm font-medium text-slate-600 mb-4'>
              {finalNotice}
            </p>
            <h3 className='font-semibold mb-2'>Your submitted code:</h3>
            <pre className='bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto text-sm'>
              {finalCode || ''}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isChallengeFinished) {
    const finalNotice =
      peerReviewPendingMessage ||
      "Wait for the peer review phase to start so you can review your classmates' code.";
    const finalDescription = showFinalizationPending
      ? finalizationMessage
      : message ||
        'The coding phase has ended. Your submission has been finalized.';

    return (
      <div className='max-w-2xl mx-auto py-10'>
        <Card>
          <CardHeader>
            <CardTitle>
              Coding phase finished. Wait for peer review to start.
            </CardTitle>
            <CardDescription>{finalDescription}</CardDescription>
          </CardHeader>
          {peerReviewNotice ? (
            <CardContent>
              <p className='text-sm font-medium text-amber-700'>
                {peerReviewNotice}
              </p>
            </CardContent>
          ) : null}
          {showFinalizationPending ? (
            <CardContent>
              <div className='flex items-center gap-3 text-sm text-muted-foreground'>
                <img
                  src={logo.src}
                  alt='CodyMatch logo'
                  className='h-8 w-8 animate-spin'
                />
                <span>Finalizing your submission...</span>
              </div>
            </CardContent>
          ) : null}
          <CardContent>
            <p className='text-sm font-medium text-slate-600'>{finalNotice}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { problemTitle, problemDescription, publicTests = [] } = matchData;

  return (
    <div className='max-w-7xl h-full my-2 relative px-3 sm:px-4'>
      {isSubmittingFinal && (
        <div className='absolute inset-0 z-50 flex items-center justify-center bg-black/40'>
          <Spinner label='Submitting your code...' />
        </div>
      )}

      <div className='flex justify-center text-base font-bold sm:justify-end sm:text-lg'>
        <Timer
          duration={duration}
          challengeId={challengeId}
          startTime={phaseOneTimerStart}
          onFinish={timerFinishHandler}
        />
      </div>
      <div className='my-4 flex flex-col gap-4 lg:flex-row lg:gap-6'>
        <div className='space-y-2 w-full lg:w-1/3'>
          {/* problem description */}
          <Card>
            <CardHeader>
              <CardTitle>{problemTitle}</CardTitle>
              <CardDescription>Read carefully before coding.</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle>Problem Description:</CardTitle>
              <p className='whitespace-pre-wrap text-sm leading-relaxed'>
                {problemDescription}
              </p>
            </CardContent>
          </Card>

          {/* public tests */}
          <Card>
            <CardHeader>
              <CardTitle>Public tests</CardTitle>
              <CardDescription>
                These are sample cases your C++ solution should handle.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {publicTests && publicTests.length > 0 ? (
                <div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Input</TableHead>
                        <TableHead>Expected Output</TableHead>
                        <TableHead>Your Output</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {publicTests.map((test, index) => {
                        const result = testResults?.[index];
                        const key = JSON.stringify({
                          input: test.input,
                          output: test.output,
                        });
                        const outputClass = (() => {
                          if (!result) return 'text-muted-foreground';
                          return result.passed
                            ? 'text-green-600'
                            : 'text-red-600';
                        })();

                        return (
                          <TableRow key={key}>
                            <TableCell>
                              {renderDisplayValue(test.input)}
                            </TableCell>

                            <TableCell>
                              {renderDisplayValue(test.output)}
                            </TableCell>

                            <TableCell className={outputClass}>
                              {isCompiled === true &&
                              result?.actualOutput !== undefined ? (
                                renderDisplayValue(result.actualOutput)
                              ) : (
                                <span className='text-muted-foreground italic'>
                                  —
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className='text-sm text-red-500'>
                  No public tests available for this match.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Custom tests</CardTitle>
              <CardDescription>
                Add inputs to see how your code behaves beyond public tests.
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {customTests?.length ? (
                <div className='space-y-3'>
                  {customTests.map((testCase) => {
                    const { id, input, expectedOutput } = testCase;
                    const inputId = `custom-input-${id}`;
                    const expectedId = `custom-expected-${id}`;
                    const result = customResultMap.get(id);
                    const actualOutput = result?.actualOutput;
                    const outputLabel = result
                      ? formatCustomOutput(actualOutput)
                      : '—';
                    return (
                      <div
                        key={id}
                        className='rounded-lg border border-border bg-muted/40 p-3 space-y-3'
                      >
                        <div className='grid gap-3 md:grid-cols-2'>
                          <div className='space-y-1'>
                            <label
                              htmlFor={inputId}
                              className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'
                            >
                              Input
                            </label>
                            <textarea
                              id={inputId}
                              className='w-full min-h-[72px] rounded-md border bg-background px-3 py-2 text-xs'
                              value={input}
                              onChange={(event) =>
                                onCustomTestChange(
                                  id,
                                  'input',
                                  event.target.value
                                )
                              }
                              placeholder='Enter custom input'
                              disabled={editorDisabled}
                            />
                          </div>
                          <div className='space-y-1'>
                            <label
                              htmlFor={expectedId}
                              className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'
                            >
                              Expected output (optional)
                            </label>
                            <textarea
                              id={expectedId}
                              className='w-full min-h-[72px] rounded-md border bg-background px-3 py-2 text-xs'
                              value={expectedOutput}
                              onChange={(event) =>
                                onCustomTestChange(
                                  id,
                                  'expectedOutput',
                                  event.target.value
                                )
                              }
                              placeholder='Enter expected output'
                              disabled={editorDisabled}
                            />
                          </div>
                        </div>
                        <div className='flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground'>
                          <span>Actual output: {outputLabel}</span>
                          <Button
                            type='button'
                            variant='ghost'
                            size='sm'
                            onClick={() => onCustomTestRemove(id)}
                            disabled={editorDisabled}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className='text-xs text-muted-foreground'>
                  Add a custom test to try extra inputs.
                </p>
              )}

              <div className='flex flex-wrap gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size={actionButtonSize}
                  onClick={onCustomTestAdd}
                  disabled={editorDisabled}
                >
                  Add custom test
                </Button>
                <Button
                  type='button'
                  variant='secondary'
                  size={actionButtonSize}
                  onClick={onRunCustomTests}
                  disabled={editorDisabled || isCustomRunning}
                >
                  {isCustomRunning ? 'Running...' : 'Run custom tests'}
                </Button>
              </div>

              <div
                className={`min-h-[64px] rounded-md border bg-muted px-3 py-2 text-xs ${customResultClass}`}
              >
                {customRunResult?.message ||
                  'Run your custom tests to see outputs.'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className='space-y-6 w-full lg:w-2/3'>
          {/* editor + controls + result panel */}
          <Card>
            <CardHeader>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
                <div className='space-y-1'>
                  <CardTitle>Code editor</CardTitle>
                  <CardDescription>Language: C++</CardDescription>
                </div>
                {saveIndicator ? (
                  <div role='status' aria-live='polite'>
                    {saveIndicator}
                  </div>
                ) : null}
              </div>
            </CardHeader>

            <CardContent className='space-y-4'>
              <div className='space-y-4'>
                <div>
                  <h2 className='text-sm font-medium mb-1'>Imports</h2>
                  <textarea
                    className={importsInputClassName}
                    value={imports || ''}
                    onChange={(event) => onImportsChange(event.target.value)}
                    onBlur={onImportsBlur}
                    disabled={editorDisabled}
                    placeholder='#include <iostream>'
                  />
                  <p className='text-xs text-muted-foreground mt-1'>
                    Only <code>#include</code> lines are allowed.
                  </p>
                  {showImportsWarning && (
                    <p className='text-xs text-amber-600 mt-1' role='alert'>
                      {importsWarning}
                    </p>
                  )}
                </div>

                {fixedPrefix?.trim() && (
                  <div>
                    <pre className='rounded-md border bg-muted px-3 py-2 text-xs font-mono whitespace-pre-wrap'>
                      {fixedPrefix}
                    </pre>
                  </div>
                )}

                <div>
                  <h2 className='text-sm font-medium mb-1'>Your solution</h2>
                  <CppEditor
                    value={studentCode || ''}
                    onChange={onStudentCodeChange}
                    disabled={editorDisabled}
                    height='35vh'
                  />
                </div>

                {fixedSuffix?.trim() && (
                  <div>
                    <pre className='rounded-md border bg-muted px-3 py-2 text-xs font-mono whitespace-pre-wrap'>
                      {fixedSuffix}
                    </pre>
                  </div>
                )}
              </div>

              <div className='mt-2'>
                <h2 className='text-sm font-medium mb-1'>Result</h2>
                <div
                  className={`min-h-[90px] rounded-md border bg-muted px-3 py-2 text-xs ${runResultClass}`}
                >
                  {runResult?.message ??
                    'Run your code to see compilation and test results.'}
                </div>
              </div>

              <div className='flex flex-wrap gap-3'>
                <Button
                  type='button'
                  onClick={onClean}
                  disabled={!canClean}
                  variant='destructive'
                  size={actionButtonSize}
                  title='Reset the editor to the default template'
                >
                  Clean
                </Button>
                <Button
                  type='button'
                  onClick={onRestore}
                  disabled={!canRestore}
                  variant='outline'
                  size={actionButtonSize}
                  title='Restore your last compiled code'
                >
                  Restore
                </Button>
                <Button
                  type='button'
                  onClick={onRun}
                  disabled={isRunning || isTimeUp}
                  variant='secondary'
                  size={actionButtonSize}
                  title='Compile and run your code against public tests'
                >
                  {isRunning && <Loader2 className='h-4 w-4 animate-spin' />}
                  {isRunning ? 'Running...' : 'Run'}
                </Button>

                {canSubmitNow ? (
                  <Button
                    type='button'
                    onClick={onSubmit}
                    disabled={isBusy}
                    size={actionButtonSize}
                    title={submitTitle}
                  >
                    {isSubmitting && <Spinner label='Submitting…' />}
                    {!isSubmitting && 'Submit'}
                  </Button>
                ) : (
                  <Tooltip
                    text='You cannot submit yet. Run your code first.'
                    position='top'
                  >
                    <Button
                      type='button'
                      disabled
                      size={actionButtonSize}
                      title={submitTitle}
                    >
                      Submit
                    </Button>
                  </Tooltip>
                )}
              </div>

              {error && (
                <p className='text-sm text-red-500 dark:text-red-400'>
                  {error?.message ||
                    (typeof error === 'string' ? error : 'An error occurred')}
                </p>
              )}

              {message && (
                <div className='space-y-2'>
                  <p
                    className={`text-sm ${(() => {
                      if (message.includes('Thanks for your submission')) {
                        if (
                          message.includes('problems') ||
                          message.includes('edge cases')
                        ) {
                          return 'text-yellow-600 dark:text-yellow-400';
                        }
                        return 'text-green-600 dark:text-green-400';
                      }
                      return 'text-blue-600 dark:text-blue-400';
                    })()}`}
                  >
                    {message}
                  </p>
                  {onTryAgain && !isChallengeFinished && (
                    <Button
                      type='button'
                      onClick={onTryAgain}
                      variant='outline'
                      size={actionButtonSize}
                      className='mt-2'
                      title={tryAgainTitle}
                    >
                      {isTimeUp ? 'View code' : 'Try again'}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
