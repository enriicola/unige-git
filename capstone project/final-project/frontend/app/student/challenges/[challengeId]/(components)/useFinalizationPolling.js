'use client';

import { useCallback, useEffect } from 'react';
import { API_REST_BASE } from '#js/constants';
import { getApiErrorMessage } from '#js/apiError';
import { resolveCodingPhaseMessage } from './matchHelpers';

export default function useFinalizationPolling({
  challengeId,
  studentId,
  isFinalizationPending,
  getChallengeResults,
  redirectOnError,
  setMessage,
  setIsFinalizationPending,
}) {
  const resolveFinalizationStatus = useCallback(async () => {
    try {
      const res = await getChallengeResults(challengeId, studentId);

      if (res?.success) {
        const payload = res?.data || res;
        const finalizationInfo = payload?.finalization || null;
        const resultsReadyFlag =
          typeof finalizationInfo?.resultsReady === 'boolean'
            ? finalizationInfo.resultsReady
            : null;
        const pendingFinalCount =
          typeof finalizationInfo?.pendingFinalCount === 'number'
            ? finalizationInfo.pendingFinalCount
            : null;
        const totalMatches =
          typeof finalizationInfo?.totalMatches === 'number'
            ? finalizationInfo.totalMatches
            : null;
        const finalSubmissionCount =
          typeof finalizationInfo?.finalSubmissionCount === 'number'
            ? finalizationInfo.finalSubmissionCount
            : null;
        let resultsReady = false;
        if (resultsReadyFlag !== null) {
          resultsReady = resultsReadyFlag;
        } else if (pendingFinalCount !== null) {
          resultsReady = pendingFinalCount === 0;
        } else if (totalMatches !== null && finalSubmissionCount !== null) {
          resultsReady = finalSubmissionCount >= totalMatches;
        }

        if (resultsReady) {
          setMessage(resolveCodingPhaseMessage(payload?.submissionSummary));
          setIsFinalizationPending(false);
          return true;
        }
      } else {
        const apiMessage = getApiErrorMessage(res, '');
        const isNotEndedError =
          typeof apiMessage === 'string' &&
          apiMessage.toLowerCase().includes('has not ended yet');
        if (!isNotEndedError) {
          if (redirectOnError(res)) return true;
        }
      }
    } catch {
      // Ignore transient errors, continue polling.
    }

    return false;
  }, [
    challengeId,
    getChallengeResults,
    redirectOnError,
    setIsFinalizationPending,
    setMessage,
    studentId,
  ]);

  useEffect(() => {
    if (!isFinalizationPending) return undefined;
    if (!challengeId || !studentId) return undefined;
    resolveFinalizationStatus();
    return undefined;
  }, [
    challengeId,
    isFinalizationPending,
    resolveFinalizationStatus,
    studentId,
  ]);

  useEffect(() => {
    if (!isFinalizationPending) return undefined;
    if (!challengeId || !studentId) return undefined;
    if (typeof EventSource === 'undefined') return undefined;

    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });

    const handleUpdate = async (event) => {
      if (!event?.data) {
        await resolveFinalizationStatus();
        return;
      }
      try {
        const payload = JSON.parse(event.data);
        const payloadId = Number(payload?.challengeId);
        if (payloadId !== Number(challengeId)) return;
      } catch {
        return;
      }

      await resolveFinalizationStatus();
    };

    source.addEventListener('finalization-updated', handleUpdate);
    source.addEventListener('challenge-updated', handleUpdate);

    return () => {
      source.close();
    };
  }, [
    challengeId,
    isFinalizationPending,
    resolveFinalizationStatus,
    studentId,
  ]);
}
