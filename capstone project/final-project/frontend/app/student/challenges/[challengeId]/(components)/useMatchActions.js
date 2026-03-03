import { useCallback, useEffect } from 'react';
import { setLastSuccessfulCode } from '#js/store/slices/ui';
import {
  MESSAGE_FINALIZING_SUBMISSION,
  MESSAGE_PHASE1_SUBMITTED,
  MESSAGE_SUBMISSION_PRIVATE_FAIL,
  MESSAGE_SUBMISSION_PUBLIC_FAIL,
  MESSAGE_SUBMISSION_SUCCESS,
  createCustomTestId,
  getUserFacingErrorMessage,
  normalizeCode,
} from './matchHelpers';

export default function useMatchActions({
  assembledCode,
  canSubmit,
  challengeId,
  challengeSignature,
  dispatch,
  clearFinalizationTimer,
  getLastSubmission,
  getStudentAssignedMatch,
  getLastSuccessCode,
  getLastManualSubmission,
  imports,
  isAutoSubmitTriggered,
  isChallengeFinished,
  isPhaseOneOver,
  isSubmitting,
  isTimeUp,
  markAutoSubmitTriggered,
  matchData,
  customTests,
  runCode,
  runCustomTests,
  setLastManualSubmission,
  setLastSuccessCode,
  setCanSubmit,
  setCustomRunOrder,
  setCustomRunResult,
  setCustomTestResults,
  setCustomTests,
  setError,
  setIsChallengeFinished,
  setIsCompiled,
  setIsCustomRunning,
  setIsFinalizationPending,
  setIsRunning,
  setIsSubmitting,
  setIsSubmittingActive,
  setIsTimeUp,
  setMatchId,
  setMessage,
  setRunResult,
  setTestResults,
  storageKeyBase,
  studentCode,
  studentId,
  submitSubmission,
  storeLastCompiled,
}) {
  const handleRun = useCallback(async () => {
    if (!matchData) return;
    if (isTimeUp) {
      setRunResult({
        type: 'error',
        message: 'Time is up. You can no longer run or submit code.',
      });
      return;
    }

    setRunResult({ type: 'info', message: 'Running your code...' });
    setIsRunning(true);
    setMessage(null);
    setError(null);
    setCanSubmit(false);
    setIsCompiled(null);
    setIsSubmittingActive(false);

    try {
      if (!runCode) {
        setRunResult({
          type: 'success',
          message: 'Your code compiled successfully.',
        });
        setIsCompiled(true);
        setCanSubmit(true);
        setIsSubmittingActive(true);
        setTestResults([]);
        storeLastCompiled();
        return;
      }

      const payload = {
        matchSettingId:
          matchData.id ||
          matchData.matchSettingId ||
          matchData.challengeMatchSettingId ||
          challengeId,
        code: assembledCode,
        language: 'cpp',
      };
      const res = await runCode(payload);
      const results = res?.results || res?.data?.results || [];
      setTestResults(results);

      if (!res?.success) {
        const errorMessage = getUserFacingErrorMessage(
          res,
          'Unable to run your code.'
        );
        setRunResult({ type: 'error', message: errorMessage });
        setIsCompiled(false);
        setCanSubmit(false);
        return;
      }

      const isCompiledValue =
        res?.data?.isCompiled !== undefined
          ? res.data.isCompiled
          : res.isCompiled;
      const isPassed =
        res?.data?.isPassed !== undefined ? res.data.isPassed : res.isPassed;

      if (!isCompiledValue) {
        setRunResult({
          type: 'error',
          message: 'Your code did not compile.',
        });
        setIsCompiled(false);
        setCanSubmit(false);
        return;
      }

      if (!isPassed) {
        setRunResult({
          type: 'error',
          message:
            'Your code did not pass the public tests. Fix the issues and try again.',
        });
        setIsCompiled(true);
        setCanSubmit(false);
        return;
      }

      setRunResult({
        type: 'success',
        message: 'Your code compiled successfully.',
      });
      setIsCompiled(true);
      setCanSubmit(true);
      setIsSubmittingActive(true);
      storeLastCompiled();
    } catch (err) {
      setRunResult({
        type: 'error',
        message: 'Network error while running the code.',
      });
      setIsCompiled(false);
      setCanSubmit(false);
    } finally {
      setIsRunning(false);
    }
  }, [
    matchData,
    isTimeUp,
    runCode,
    assembledCode,
    setRunResult,
    setIsRunning,
    setMessage,
    setError,
    setCanSubmit,
    setIsCompiled,
    setIsSubmittingActive,
    setTestResults,
    storeLastCompiled,
    challengeId,
  ]);

  const addCustomTest = useCallback(() => {
    setCustomTests((prev) => [
      ...prev,
      { id: createCustomTestId(), input: '', expectedOutput: '' },
    ]);
  }, [setCustomTests]);

  const updateCustomTest = useCallback(
    (id, field, value) => {
      setCustomTests((prev) =>
        prev.map((testCase) => {
          if (testCase.id !== id) return testCase;
          return { ...testCase, [field]: value };
        })
      );
    },
    [setCustomTests]
  );

  const removeCustomTest = useCallback(
    (id) => {
      setCustomTests((prev) => prev.filter((testCase) => testCase.id !== id));
    },
    [setCustomTests]
  );

  const buildCustomTestsPayload = useCallback((tests) => {
    const payload = [];
    const order = [];

    tests.forEach((testCase) => {
      const inputValue =
        typeof testCase.input === 'string' ? testCase.input.trim() : '';
      const expectedValue =
        typeof testCase.expectedOutput === 'string'
          ? testCase.expectedOutput.trim()
          : '';
      if (!inputValue) return;
      const entry = { input: inputValue };
      if (expectedValue) entry.output = expectedValue;
      payload.push(entry);
      order.push(testCase.id);
    });

    return { payload, order };
  }, []);

  const handleRunCustomTests = useCallback(async () => {
    if (isTimeUp) {
      setCustomRunResult({
        type: 'error',
        message: 'Time is up. You can no longer run custom tests.',
      });
      return;
    }
    if (!runCustomTests || !studentId || !challengeId) {
      setCustomRunResult({
        type: 'error',
        message: 'Custom tests are not available right now.',
      });
      return;
    }

    const { payload, order } = buildCustomTestsPayload(customTests || []);
    if (payload.length === 0) {
      setCustomRunResult({
        type: 'error',
        message: 'Add at least one custom test input to run.',
      });
      return;
    }

    setCustomRunResult({ type: 'info', message: 'Running custom tests...' });
    setIsCustomRunning(true);
    setCustomTestResults([]);
    setCustomRunOrder(order);

    try {
      const res = await runCustomTests({
        challengeId,
        studentId,
        code: assembledCode,
        tests: payload,
      });

      if (!res?.success) {
        setCustomRunResult({
          type: 'error',
          message: getUserFacingErrorMessage(
            res,
            'Unable to run custom tests.'
          ),
        });
        setIsCustomRunning(false);
        return;
      }

      const results = res?.data?.results || res?.results || [];
      setCustomTestResults(results);
      setCustomRunResult({
        type: 'success',
        message: 'Custom tests executed.',
      });
    } catch (_err) {
      setCustomRunResult({
        type: 'error',
        message: 'Network error while running custom tests.',
      });
    } finally {
      setIsCustomRunning(false);
    }
  }, [
    assembledCode,
    buildCustomTestsPayload,
    challengeId,
    customTests,
    isTimeUp,
    runCustomTests,
    setCustomRunOrder,
    setCustomRunResult,
    setCustomTestResults,
    setIsCustomRunning,
    studentId,
  ]);

  const handleSubmit = useCallback(async () => {
    setMessage(null);
    setError(null);
    if (isTimeUp) {
      setError({ message: 'Time is up. You can no longer submit code.' });
      return false;
    }
    if (!canSubmit) {
      setError({ message: 'Run your code successfully before submitting.' });
      return false;
    }

    setIsSubmitting(true);

    try {
      const res = await getStudentAssignedMatch(challengeId, studentId);

      if (!res?.success || !res?.data?.id) {
        setError({ message: 'No match found for submission.' });
        return false;
      }

      const resolvedMatchId = res.data.id;
      setMatchId(resolvedMatchId);
      const persistKey = resolvedMatchId
        ? `match-${resolvedMatchId}`
        : storageKeyBase;

      if (!studentCode.trim()) {
        setError({ message: 'Empty code cannot be submitted.' });
        return false;
      }

      const submissionRes = await submitSubmission({
        matchId: resolvedMatchId,
        code: assembledCode,
      });

      if (submissionRes?.success) {
        const { publicTestResults, privateTestResults } =
          submissionRes.data || {};

        let submissionMessage = MESSAGE_SUBMISSION_SUCCESS;

        if (
          publicTestResults &&
          Array.isArray(publicTestResults) &&
          privateTestResults &&
          Array.isArray(privateTestResults)
        ) {
          const allPublicPassed = publicTestResults.every(
            (result) => result.passed === true
          );

          const allPrivatePassed = privateTestResults.every(
            (result) => result.passed === true
          );

          if (!allPublicPassed) {
            submissionMessage = MESSAGE_SUBMISSION_PUBLIC_FAIL;
          } else if (allPublicPassed && !allPrivatePassed) {
            submissionMessage = MESSAGE_SUBMISSION_PRIVATE_FAIL;
          }
        }

        setMessage(submissionMessage);
        setLastSuccessCode(assembledCode);
        setLastManualSubmission(assembledCode);
        if (studentId) {
          dispatch(
            setLastSuccessfulCode({
              userId: studentId,
              key: persistKey,
              imports,
              studentCode,
              signature: challengeSignature,
            })
          );
        }
        return true;
      }

      try {
        const lastValid = await getLastSubmission(resolvedMatchId);
        const fallbackCode =
          lastValid?.data?.submission?.code || getLastSuccessCode();
        if (fallbackCode && fallbackCode.trim()) {
          setMessage('New code failed. Kept your last valid submission.');
          setLastSuccessCode(fallbackCode);
          return true;
        }
      } catch {
        // Ignore fallback failures and surface original submission error below.
      }

      const errorMessage = getUserFacingErrorMessage(
        submissionRes,
        'Submission failed.'
      );
      setError({ message: errorMessage });
      return false;
    } catch (err) {
      setError({ message: `Error: ${err.message}` });
      return false;
    } finally {
      setIsSubmitting(false);
      setIsSubmittingActive(false);
    }
  }, [
    assembledCode,
    canSubmit,
    challengeId,
    challengeSignature,
    dispatch,
    getLastSubmission,
    getStudentAssignedMatch,
    imports,
    isTimeUp,
    setError,
    setIsSubmitting,
    setIsSubmittingActive,
    setMatchId,
    setMessage,
    studentCode,
    studentId,
    submitSubmission,
    storageKeyBase,
    getLastSuccessCode,
    setLastSuccessCode,
    setLastManualSubmission,
  ]);

  const handleTimerFinish = useCallback(async () => {
    setMessage(null);
    setError(null);
    setIsTimeUp(true);
    setCanSubmit(false);
    setIsSubmitting(true);
    setIsSubmittingActive(false);
    setIsRunning(false);
    setRunResult({
      type: 'error',
      message: 'Time is up. You can no longer run or submit code.',
    });

    const finishWithPendingFinalization = () => {
      clearFinalizationTimer();
      setMessage(MESSAGE_FINALIZING_SUBMISSION);
      setIsChallengeFinished(true);
      setIsFinalizationPending(true);
    };

    const finishWithoutFinalization = (finalMessage) => {
      clearFinalizationTimer();
      setMessage(finalMessage);
      setIsChallengeFinished(true);
      setIsFinalizationPending(false);
    };

    try {
      const res = await getStudentAssignedMatch(challengeId, studentId);

      if (!res?.success || !res?.data?.id) {
        finishWithPendingFinalization();
        return false;
      }

      const resolvedMatchId = res.data.id;
      setMatchId(resolvedMatchId);
      const persistKey = resolvedMatchId
        ? `match-${resolvedMatchId}`
        : storageKeyBase;
      const matchSettingId =
        matchData?.id ||
        matchData?.matchSettingId ||
        matchData?.challengeMatchSettingId ||
        challengeId;

      const resolveLastSubmittedCode = async () => {
        const localCode = getLastSuccessCode();
        if (normalizeCode(localCode)) return localCode;
        try {
          const lastRes = await getLastSubmission(resolvedMatchId);
          const lastSubmission = lastRes?.data?.submission;
          const lastCode = lastSubmission?.code;
          if (normalizeCode(lastCode)) {
            setLastSuccessCode(lastCode);
            if (lastSubmission?.isAutomaticSubmission === false) {
              setLastManualSubmission(lastCode);
            }
            return lastCode;
          }
        } catch {
          return null;
        }
        return null;
      };

      const lastSubmittedCode = await resolveLastSubmittedCode();
      const lastSubmittedNormalized = normalizeCode(lastSubmittedCode);
      const hasManualSubmission = Boolean(lastSubmittedNormalized);
      const manualSubmissionCode = normalizeCode(getLastManualSubmission());
      const autoSubmissionCode = normalizeCode(assembledCode);

      if (!studentCode.trim()) {
        if (hasManualSubmission) {
          finishWithPendingFinalization();
          return true;
        }
        finishWithPendingFinalization();
        return false;
      }

      let runOutcome;
      if (!runCode || !matchSettingId) {
        runOutcome = { success: false };
      } else {
        try {
          runOutcome = await runCode({
            matchSettingId,
            code: assembledCode,
            language: 'cpp',
          });
        } catch {
          runOutcome = { success: false };
        }
      }

      const runSuccess = runOutcome?.success === true;
      const runCompiled =
        runOutcome?.data?.isCompiled !== undefined
          ? runOutcome.data.isCompiled
          : runOutcome?.isCompiled;
      const runPassed =
        runOutcome?.data?.isPassed !== undefined
          ? runOutcome.data.isPassed
          : runOutcome?.isPassed;

      if (!runSuccess || runCompiled === false || !runPassed) {
        if (hasManualSubmission) {
          finishWithPendingFinalization();
          return true;
        }
        finishWithPendingFinalization();
        return false;
      }

      const submissionRes = await submitSubmission({
        matchId: resolvedMatchId,
        code: assembledCode,
        isAutomatic: true,
      });

      if (submissionRes?.success) {
        const shouldSkipFinalizationWait =
          Boolean(manualSubmissionCode) &&
          manualSubmissionCode === autoSubmissionCode;

        if (shouldSkipFinalizationWait) {
          finishWithoutFinalization(MESSAGE_PHASE1_SUBMITTED);
        } else {
          finishWithPendingFinalization();
        }
        setLastSuccessCode(assembledCode);
        if (studentId) {
          dispatch(
            setLastSuccessfulCode({
              userId: studentId,
              key: persistKey,
              imports,
              studentCode,
              signature: challengeSignature,
            })
          );
        }
        return true;
      }

      if (hasManualSubmission) {
        finishWithPendingFinalization();
        return true;
      }

      finishWithPendingFinalization();
      return false;
    } catch (err) {
      finishWithPendingFinalization();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [
    assembledCode,
    challengeId,
    challengeSignature,
    clearFinalizationTimer,
    dispatch,
    getLastSubmission,
    getStudentAssignedMatch,
    getLastManualSubmission,
    getLastSuccessCode,
    imports,
    matchData,
    runCode,
    setCanSubmit,
    setError,
    setIsChallengeFinished,
    setIsFinalizationPending,
    setIsRunning,
    setIsSubmitting,
    setIsSubmittingActive,
    setIsTimeUp,
    setMatchId,
    setMessage,
    setRunResult,
    storageKeyBase,
    studentCode,
    studentId,
    submitSubmission,
    setLastManualSubmission,
    setLastSuccessCode,
  ]);

  useEffect(() => {
    if (!isPhaseOneOver) return;
    if (isAutoSubmitTriggered()) return;
    if (isTimeUp || isChallengeFinished || isSubmitting) return;
    markAutoSubmitTriggered();
    handleTimerFinish();
  }, [
    handleTimerFinish,
    isChallengeFinished,
    isAutoSubmitTriggered,
    isPhaseOneOver,
    isSubmitting,
    isTimeUp,
    markAutoSubmitTriggered,
  ]);

  return {
    handleRun,
    handleSubmit,
    handleTimerFinish,
    addCustomTest,
    updateCustomTest,
    removeCustomTest,
    handleRunCustomTests,
  };
}
