'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useChallenge from '#js/useChallenge';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import {
  clearChallengeDraft,
  migrateChallengeKey,
  setDraftCode,
  setLastCompiledCode,
} from '#js/store/slices/ui';
import { ChallengeStatus } from '#js/constants';
import { getApiErrorMessage } from '#js/apiError';
import useApiErrorRedirect from '#js/useApiErrorRedirect';
import MatchView from './MatchView';
import useMatchActions from './useMatchActions';
import {
  DRAFT_SAVE_DELAY_MS,
  MESSAGE_PEER_REVIEW_PENDING,
  analyzeImports,
  assembleCode,
  buildTemplateParts,
  normalizeCode,
  normalizeSnapshot,
  DEFAULT_IMPORTS,
} from './matchHelpers';
import useFinalizationPolling from './useFinalizationPolling';
import { useDuration } from '../(context)/DurationContext';

export default function MatchContainer({ challengeId, studentId }) {
  const dispatch = useAppDispatch();
  const durationContext = useDuration();
  const challengeStatus = durationContext?.status;
  const hasDurationContext = durationContext !== null;
  const isStatusKnown =
    hasDurationContext &&
    challengeStatus !== null &&
    challengeStatus !== undefined;
  const isPhaseOneActive =
    challengeStatus === ChallengeStatus.STARTED_PHASE_ONE;
  const isWaitingForStart = challengeStatus === ChallengeStatus.ASSIGNED;
  const startSignature =
    durationContext?.startPhaseOneDateTime || durationContext?.startDatetime;
  const challengeSignature = useMemo(
    () =>
      startSignature ? `${challengeId}-${startSignature}` : `${challengeId}`,
    [challengeId, startSignature]
  );
  const peerReviewPendingMessage =
    challengeStatus === ChallengeStatus.ENDED_PHASE_ONE
      ? MESSAGE_PEER_REVIEW_PENDING
      : null;
  const isPhaseOneOver =
    challengeStatus === ChallengeStatus.ENDED_PHASE_ONE ||
    challengeStatus === ChallengeStatus.STARTED_PHASE_TWO ||
    challengeStatus === ChallengeStatus.ENDED_PHASE_TWO;
  const {
    getStudentAssignedMatchSetting,
    getStudentAssignedMatch,
    getChallengeResults,
    submitSubmission,
    getLastSubmission,
    runCode,
    runCustomTests,
  } = useChallenge();
  const redirectOnError = useApiErrorRedirect();

  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState(null);
  const [matchId, setMatchId] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [imports, setImports] = useState(DEFAULT_IMPORTS);
  const [studentCode, setStudentCode] = useState('');
  const [importsWarning, setImportsWarning] = useState('');
  const [runResult, setRunResult] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [customTests, setCustomTests] = useState([]);
  const [customRunResult, setCustomRunResult] = useState(null);
  const [customTestResults, setCustomTestResults] = useState([]);
  const [customRunOrder, setCustomRunOrder] = useState([]);
  const [isCustomRunning, setIsCustomRunning] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingActive, setIsSubmittingActive] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isCompiled, setIsCompiled] = useState(null);
  const [isChallengeFinished, setIsChallengeFinished] = useState(false);
  const [isFinalizationPending, setIsFinalizationPending] = useState(false);
  const [draftSaveState, setDraftSaveState] = useState('saved');
  const hasLoadedFromStorage = useRef(false);
  const lastSuccessRef = useRef(null);
  const lastManualSubmissionRef = useRef(null);
  const autoSubmitTriggeredRef = useRef(false);
  const draftSaveTimerRef = useRef(null);
  const finalizationPollTimerRef = useRef(null);
  const lastSavedSnapshotRef = useRef({ imports: '', studentCode: '' });
  const getLastSuccessCode = useCallback(() => lastSuccessRef.current, []);
  const setLastSuccessCode = useCallback((code) => {
    lastSuccessRef.current = code;
  }, []);
  const getLastManualSubmission = useCallback(
    () => lastManualSubmissionRef.current,
    []
  );
  const setLastManualSubmission = useCallback((code) => {
    lastManualSubmissionRef.current = code;
  }, []);
  const isAutoSubmitTriggered = useCallback(
    () => autoSubmitTriggeredRef.current,
    []
  );
  const markAutoSubmitTriggered = useCallback(() => {
    autoSubmitTriggeredRef.current = true;
  }, []);
  const clearFinalizationTimer = useCallback(() => {
    if (finalizationPollTimerRef.current) {
      clearTimeout(finalizationPollTimerRef.current);
      finalizationPollTimerRef.current = null;
    }
  }, []);
  const storageKeyBase = useMemo(
    () => (matchId ? `match-${matchId}` : `challenge-${challengeId}`),
    [matchId, challengeId]
  );
  const templateParts = useMemo(
    () => buildTemplateParts(matchData?.starterCode),
    [matchData]
  );
  const { imports: defaultImports, fixedPrefix, fixedSuffix } = templateParts;

  const assembledCode = useMemo(
    () => assembleCode(imports, fixedPrefix, studentCode, fixedSuffix),
    [imports, fixedPrefix, studentCode, fixedSuffix]
  );

  const savedDraftEntry = useAppSelector((state) => {
    if (!studentId) return null;
    return state.ui.challengeDrafts?.[studentId]?.[storageKeyBase] || null;
  });
  const hasSignatureToken = Boolean(startSignature);
  const shouldIgnoreSavedDraft = Boolean(
    savedDraftEntry &&
    savedDraftEntry.signature &&
    savedDraftEntry.signature !== challengeSignature
  );
  const activeDraftEntry = shouldIgnoreSavedDraft ? null : savedDraftEntry;
  const savedLastCompiledSnapshot = normalizeSnapshot(
    activeDraftEntry?.lastCompiled
  );
  const savedLastSuccessSnapshot = normalizeSnapshot(
    activeDraftEntry?.lastSuccessful
  );

  useEffect(
    () => () => {
      if (draftSaveTimerRef.current) {
        clearTimeout(draftSaveTimerRef.current);
        draftSaveTimerRef.current = null;
      }
      if (finalizationPollTimerRef.current) {
        clearTimeout(finalizationPollTimerRef.current);
        finalizationPollTimerRef.current = null;
      }
    },
    []
  );

  const resetMatchStateForWaiting = useCallback(() => {
    if (finalizationPollTimerRef.current) {
      clearTimeout(finalizationPollTimerRef.current);
      finalizationPollTimerRef.current = null;
    }
    setMessage(null);
    setError(null);
    setRunResult(null);
    setIsRunning(false);
    setIsSubmitting(false);
    setIsSubmittingActive(false);
    setTestResults([]);
    setCustomTests([]);
    setCustomRunResult(null);
    setCustomTestResults([]);
    setCustomRunOrder([]);
    setIsCustomRunning(false);
    setCanSubmit(false);
    setIsCompiled(null);
    setIsTimeUp(false);
    setIsFinalizationPending(false);
    setMatchData(null);
    setMatchId(null);
    lastSuccessRef.current = null;
    lastManualSubmissionRef.current = null;
    autoSubmitTriggeredRef.current = false;
    hasLoadedFromStorage.current = false;
    setImports(DEFAULT_IMPORTS);
    setStudentCode('');
    setImportsWarning('');
    setDraftSaveState('saved');
    lastSavedSnapshotRef.current = { imports: '', studentCode: '' };
  }, []);

  useEffect(() => {
    if (!studentId || !shouldIgnoreSavedDraft) return;
    dispatch(
      clearChallengeDraft({
        userId: studentId,
        key: storageKeyBase,
      })
    );
  }, [dispatch, shouldIgnoreSavedDraft, storageKeyBase, studentId]);

  useEffect(() => {
    if (!studentId || !matchId) return;
    const fromKey = `challenge-${challengeId}`;
    const toKey = `match-${matchId}`;
    dispatch(
      migrateChallengeKey({
        userId: studentId,
        fromKey,
        toKey,
      })
    );
  }, [dispatch, studentId, challengeId, matchId]);

  const storeLastCompiled = useCallback(() => {
    if (!studentId) return;
    if (!imports.trim() && !studentCode.trim()) return;
    dispatch(
      setLastCompiledCode({
        userId: studentId,
        key: storageKeyBase,
        imports,
        studentCode,
        signature: challengeSignature,
      })
    );
  }, [
    dispatch,
    storageKeyBase,
    studentId,
    imports,
    studentCode,
    challengeSignature,
  ]);

  useEffect(() => {
    hasLoadedFromStorage.current = false;
  }, [matchId, challengeId, studentId, challengeSignature]);

  useEffect(() => {
    if (!matchData) return;
    if (hasLoadedFromStorage.current) return;

    const draftImports =
      typeof activeDraftEntry?.imports === 'string'
        ? activeDraftEntry.imports
        : '';
    const draftStudentCode =
      typeof activeDraftEntry?.studentCode === 'string'
        ? activeDraftEntry.studentCode
        : '';
    const draftHasContent = Boolean(
      draftImports.trim() || draftStudentCode.trim()
    );
    const hasCurrentStudentCode = Boolean(normalizeCode(studentCode));

    let nextImports = defaultImports;
    let nextStudentCode = '';
    if (activeDraftEntry) {
      nextImports = draftImports || defaultImports;
      nextStudentCode = draftStudentCode;
    }

    if (hasCurrentStudentCode && !draftHasContent) {
      if (savedLastSuccessSnapshot) {
        lastSuccessRef.current = assembleCode(
          savedLastSuccessSnapshot.imports || defaultImports,
          fixedPrefix,
          savedLastSuccessSnapshot.studentCode,
          fixedSuffix
        );
      } else {
        lastSuccessRef.current = null;
      }

      lastSavedSnapshotRef.current = {
        imports,
        studentCode,
      };
      setDraftSaveState('saved');
      hasLoadedFromStorage.current = true;
      return;
    }

    setImports(nextImports);
    setStudentCode(nextStudentCode);
    setImportsWarning('');

    if (savedLastSuccessSnapshot) {
      lastSuccessRef.current = assembleCode(
        savedLastSuccessSnapshot.imports || defaultImports,
        fixedPrefix,
        savedLastSuccessSnapshot.studentCode,
        fixedSuffix
      );
    } else {
      lastSuccessRef.current = null;
    }

    lastSavedSnapshotRef.current = {
      imports: nextImports,
      studentCode: nextStudentCode,
    };
    setDraftSaveState('saved');
    hasLoadedFromStorage.current = true;
    if (
      studentId &&
      activeDraftEntry &&
      hasSignatureToken &&
      !activeDraftEntry.signature
    ) {
      dispatch(
        setDraftCode({
          userId: studentId,
          key: storageKeyBase,
          imports: nextImports,
          studentCode: nextStudentCode,
          signature: challengeSignature,
        })
      );
    }
  }, [
    matchData,
    activeDraftEntry,
    savedLastSuccessSnapshot,
    defaultImports,
    fixedPrefix,
    fixedSuffix,
    studentId,
    hasSignatureToken,
    dispatch,
    storageKeyBase,
    challengeSignature,
    imports,
    studentCode,
  ]);

  useEffect(() => {
    if (!studentId || !matchData) return;
    if (!hasLoadedFromStorage.current) return;
    const nextSnapshot = {
      imports,
      studentCode,
    };
    const previousSnapshot = lastSavedSnapshotRef.current;
    const hasChanges =
      nextSnapshot.imports !== previousSnapshot.imports ||
      nextSnapshot.studentCode !== previousSnapshot.studentCode;
    if (!hasChanges) return;

    if (draftSaveTimerRef.current) {
      clearTimeout(draftSaveTimerRef.current);
    }
    setDraftSaveState('saving');
    draftSaveTimerRef.current = setTimeout(() => {
      dispatch(
        setDraftCode({
          userId: studentId,
          key: storageKeyBase,
          imports: nextSnapshot.imports,
          studentCode: nextSnapshot.studentCode,
          signature: challengeSignature,
        })
      );
      lastSavedSnapshotRef.current = nextSnapshot;
      setDraftSaveState('saved');
    }, DRAFT_SAVE_DELAY_MS);
  }, [
    challengeSignature,
    dispatch,
    imports,
    matchData,
    studentCode,
    storageKeyBase,
    studentId,
  ]);

  // load StudentAssignedMatchSetting(Match)
  useEffect(() => {
    if (!challengeId || !studentId) return () => {};
    if (hasDurationContext && !isPhaseOneActive) {
      if (!isStatusKnown) {
        setLoading(true);
        return () => {};
      }
      if (isWaitingForStart) {
        setLoading(false);
        resetMatchStateForWaiting();
        return () => {};
      }
      setLoading(false);
      return () => {};
    }

    let cancelled = false;

    async function fetchMatch() {
      if (finalizationPollTimerRef.current) {
        clearTimeout(finalizationPollTimerRef.current);
        finalizationPollTimerRef.current = null;
      }
      setMessage(null);
      setLoading(true);
      setError(null);
      setRunResult(null);
      setIsRunning(false);
      setIsSubmitting(false);
      setIsSubmittingActive(false);
      setTestResults([]);
      setCustomTests([]);
      setCustomRunResult(null);
      setCustomTestResults([]);
      setCustomRunOrder([]);
      setIsCustomRunning(false);
      setCanSubmit(false);
      setIsCompiled(null);
      setIsTimeUp(false);
      setIsFinalizationPending(false);
      setMatchData(null);
      setMatchId(null);
      lastSuccessRef.current = null;
      autoSubmitTriggeredRef.current = false;
      hasLoadedFromStorage.current = false;
      setImports(DEFAULT_IMPORTS);
      setStudentCode('');
      setImportsWarning('');

      try {
        const res = await getStudentAssignedMatchSetting(
          challengeId,
          studentId
        );
        if (cancelled) return;

        if (res?.success === false) {
          if (!cancelled) {
            if (redirectOnError(res)) return;
            setError({
              message: getApiErrorMessage(
                res,
                'Unable to load your match for this challenge.'
              ),
              code: res.code,
            });
          }
          return;
        }

        const { data } = res;

        if (!cancelled) {
          setMatchData(data);
          try {
            const matchRes = await getStudentAssignedMatch(
              challengeId,
              studentId
            );
            if (matchRes?.success && matchRes.data?.id) {
              setMatchId(matchRes.data.id);
            } else {
              setMatchId(null);
            }
          } catch {
            setMatchId(null);
          }
        }
      } catch (_err) {
        if (!cancelled) {
          setError({
            message: 'Network error while loading your match. Try again.',
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    if (challengeId && studentId) {
      fetchMatch();
    }

    return () => {
      cancelled = true;
    };
  }, [
    challengeId,
    studentId,
    getStudentAssignedMatchSetting,
    getStudentAssignedMatch,
    redirectOnError,
    hasDurationContext,
    isPhaseOneActive,
    isStatusKnown,
    isWaitingForStart,
    resetMatchStateForWaiting,
  ]);

  useFinalizationPolling({
    challengeId,
    studentId,
    isFinalizationPending,
    getChallengeResults,
    redirectOnError,
    setMessage,
    setIsFinalizationPending,
  });

  const {
    handleRun,
    handleSubmit,
    handleTimerFinish,
    addCustomTest,
    updateCustomTest,
    removeCustomTest,
    handleRunCustomTests,
  } = useMatchActions({
    assembledCode,
    canSubmit,
    challengeId,
    challengeSignature,
    clearFinalizationTimer,
    customTests,
    dispatch,
    getLastManualSubmission,
    getLastSubmission,
    getLastSuccessCode,
    getStudentAssignedMatch,
    imports,
    isAutoSubmitTriggered,
    isChallengeFinished,
    isPhaseOneOver,
    isSubmitting,
    isTimeUp,
    markAutoSubmitTriggered,
    matchData,
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
  });

  const handleTryAgain = useCallback(() => {
    setMessage(null);
    setError(null);
    setIsSubmittingActive(false);
    setRunResult(null);
    setTestResults([]);
  }, []);

  const handleImportsChange = useCallback((value) => {
    setImports(value);
    setImportsWarning('');
  }, []);

  const handleImportsBlur = useCallback(
    (event) => {
      const { invalidLines } = analyzeImports(event.target.value);
      if (invalidLines.length > 0) {
        const suffix = invalidLines.length === 1 ? '' : 's';
        setImportsWarning(
          `Found ${invalidLines.length} non-#include line${suffix}.`
        );
      } else {
        setImportsWarning('');
      }
    },
    [setImportsWarning]
  );

  const handleClean = useCallback(() => {
    setImports(defaultImports);
    setStudentCode('');
    setImportsWarning('');
    setRunResult(null);
    setTestResults([]);
    setIsCompiled(null);
    setCanSubmit(false);
    setIsSubmittingActive(false);
    setMessage(null);
    setError(null);
  }, [defaultImports]);

  const handleRestore = useCallback(() => {
    if (!savedLastCompiledSnapshot) return;
    const restoredImports = savedLastCompiledSnapshot.imports || defaultImports;
    const restoredStudentCode = savedLastCompiledSnapshot.studentCode || '';
    if (!restoredImports.trim() && !restoredStudentCode.trim()) return;
    setImports(restoredImports);
    setStudentCode(restoredStudentCode);
    setImportsWarning('');
    setRunResult(null);
    setTestResults([]);
    setIsCompiled(null);
    setCanSubmit(false);
    setIsSubmittingActive(false);
    setMessage(null);
    setError(null);
  }, [savedLastCompiledSnapshot, defaultImports]);

  const hasRestorableCode = Boolean(
    savedLastCompiledSnapshot?.imports?.trim() ||
    savedLastCompiledSnapshot?.studentCode?.trim()
  );
  const showDraftSaveState = matchData ? draftSaveState : null;

  return (
    <MatchView
      loading={loading}
      error={error}
      message={message}
      challengeId={challengeId}
      isWaitingForStart={isWaitingForStart}
      matchData={matchData}
      imports={imports}
      onImportsChange={handleImportsChange}
      onImportsBlur={handleImportsBlur}
      importsWarning={importsWarning}
      studentCode={studentCode}
      onStudentCodeChange={setStudentCode}
      fixedPrefix={fixedPrefix}
      fixedSuffix={fixedSuffix}
      finalCode={assembledCode}
      isRunning={isRunning}
      isSubmitting={isSubmitting}
      isSubmittingActive={isSubmittingActive}
      peerReviewNotice={matchData?.peerReviewBlockedMessage || null}
      peerReviewPendingMessage={peerReviewPendingMessage}
      runResult={runResult}
      onRun={handleRun}
      onSubmit={handleSubmit}
      customTests={customTests}
      customTestResults={customTestResults}
      customRunResult={customRunResult}
      isCustomRunning={isCustomRunning}
      customRunOrder={customRunOrder}
      onCustomTestAdd={addCustomTest}
      onCustomTestChange={updateCustomTest}
      onCustomTestRemove={removeCustomTest}
      onRunCustomTests={handleRunCustomTests}
      isTimeUp={isTimeUp}
      onTimerFinish={handleTimerFinish}
      testResults={testResults}
      canSubmit={canSubmit}
      isCompiled={isCompiled}
      isChallengeFinished={isChallengeFinished}
      isFinalizationPending={isFinalizationPending}
      draftSaveState={showDraftSaveState}
      onTryAgain={handleTryAgain}
      onClean={handleClean}
      onRestore={handleRestore}
      hasRestorableCode={hasRestorableCode}
    />
  );
}
