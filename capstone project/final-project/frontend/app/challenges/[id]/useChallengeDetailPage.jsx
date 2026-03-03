'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '#components/common/Button';
import {
  API_REST_BASE,
  ChallengeStatus,
  getChallengeStatusLabel,
} from '#js/constants';
import useChallenge from '#js/useChallenge';
import { getApiErrorMessage } from '#js/apiError';
import useApiErrorRedirect from '#js/useApiErrorRedirect';
import { formatDateTime } from '#js/date';
import { useAppSelector } from '#js/store/hooks';
import {
  buildStudentName,
  getBufferedStartMs,
  getPhaseEndMs,
  isEndedChallengeStatus,
  parseJsonValue,
  resolveEndDisplay,
} from './challengeDetailUtils';

const statusTone = {
  [ChallengeStatus.PUBLIC]: 'bg-primary/10 text-primary ring-1 ring-primary/20',
  [ChallengeStatus.ASSIGNED]:
    'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-200',
  [ChallengeStatus.STARTED_PHASE_ONE]:
    'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-200',
  [ChallengeStatus.ENDED_PHASE_ONE]:
    'bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/25 dark:text-slate-200',
  [ChallengeStatus.STARTED_PHASE_TWO]:
    'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/25 dark:text-indigo-200',
  [ChallengeStatus.ENDED_PHASE_TWO]:
    'bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/25 dark:text-slate-200',
  [ChallengeStatus.PRIVATE]:
    'bg-muted text-muted-foreground ring-1 ring-border',
};

const PEER_REVIEW_STARTED_MESSAGE = 'Peer review started successfully.';

export default function useChallengeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const {
    getChallengeMatches,
    assignChallenge,
    getChallengeParticipants,
    startChallenge,
    endCodingPhase,
    assignPeerReviews,
    updateExpectedReviews,
    startPeerReview,
    endPeerReview,
    unpublishChallenge,
    endChallenge,
    getTeacherChallengeResults,
    addMatchSettingPrivateTest,
  } = useChallenge();
  const challengeId = params?.id;
  const redirectOnError = useApiErrorRedirect();
  const authUser = useAppSelector((state) => state.auth.user);
  const isTeacher = authUser?.role === 'teacher';

  const [challenge, setChallenge] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editPending, setEditPending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [assigningReviews, setAssigningReviews] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startingPeerReview, setStartingPeerReview] = useState(false);
  const [studentCount, setStudentCount] = useState(0);
  const [expectedReviews, setExpectedReviews] = useState('');
  const [expectedReviewsError, setExpectedReviewsError] = useState('');
  const [expectedReviewsSaved, setExpectedReviewsSaved] = useState('');
  const [savingExpectedReviews, setSavingExpectedReviews] = useState(false);
  const [peerReviewMessages, setPeerReviewMessages] = useState([]);
  const [phaseNow, setPhaseNow] = useState(Date.now());
  const [dangerAction, setDangerAction] = useState(null);
  const [dangerPending, setDangerPending] = useState(false);
  const [teacherResultsOpen, setTeacherResultsOpen] = useState(false);
  const [teacherResultsLoading, setTeacherResultsLoading] = useState(false);
  const [teacherResultsError, setTeacherResultsError] = useState('');
  const [teacherResults, setTeacherResults] = useState(null);
  const [privateTestActions, setPrivateTestActions] = useState({});
  const getChallengeParticipantsRef = useRef(getChallengeParticipants);

  useEffect(() => {
    getChallengeParticipantsRef.current = getChallengeParticipants;
  }, [getChallengeParticipants]);

  const load = useCallback(async () => {
    if (!challengeId) return;
    setError(null);
    setLoading(true);
    try {
      const [matchesRes, participantsRes] = await Promise.all([
        getChallengeMatches(challengeId),
        getChallengeParticipants(challengeId),
      ]);

      if (matchesRes?.success) {
        setChallenge(matchesRes.challenge);
        setAssignments(matchesRes.assignments || []);
        setExpectedReviews(
          matchesRes.challenge?.allowedNumberOfReview != null
            ? String(matchesRes.challenge.allowedNumberOfReview)
            : ''
        );
        setExpectedReviewsSaved('');
      } else {
        if (redirectOnError(matchesRes)) return;
        const errorMessage = getApiErrorMessage(
          matchesRes,
          'Unable to load matches'
        );
        setError(errorMessage);
        setAssignments([]);
      }

      if (participantsRes?.success && Array.isArray(participantsRes.data)) {
        setStudentCount(participantsRes.data.length);
        setParticipants(participantsRes.data);
      } else {
        setStudentCount(0);
        setParticipants([]);
      }
    } catch (err) {
      setError(getApiErrorMessage(err, 'Unable to load matches'));
      setAssignments([]);
      setStudentCount(0);
      setParticipants([]);
    } finally {
      setLoading(false);
    }
  }, [
    challengeId,
    getChallengeMatches,
    getChallengeParticipants,
    redirectOnError,
  ]);

  useEffect(() => {
    load();
  }, [load]);

  const canShowTeacherResults =
    isTeacher && isEndedChallengeStatus(challenge?.status);

  const loadTeacherResults = useCallback(async () => {
    if (!challengeId) return;
    setTeacherResultsError('');
    setTeacherResultsLoading(true);
    try {
      const res = await getTeacherChallengeResults(challengeId, true);
      if (res?.success) {
        setTeacherResults(res?.data || null);
      } else {
        setTeacherResults(null);
        setTeacherResultsError(
          getApiErrorMessage(res, 'Unable to load student results.')
        );
      }
    } catch (err) {
      setTeacherResults(null);
      setTeacherResultsError(
        getApiErrorMessage(err, 'Unable to load student results.')
      );
    } finally {
      setTeacherResultsLoading(false);
    }
  }, [challengeId, getTeacherChallengeResults]);

  const handleToggleTeacherResults = useCallback(() => {
    const nextOpen = !teacherResultsOpen;
    setTeacherResultsOpen(nextOpen);
    if (nextOpen && !teacherResults && !teacherResultsLoading) {
      loadTeacherResults();
    }
  }, [
    loadTeacherResults,
    teacherResults,
    teacherResultsLoading,
    teacherResultsOpen,
  ]);

  const handleAddPrivateTest = useCallback(
    async ({ matchSettingId, assignmentId, testCaseInput, expectedOutput }) => {
      if (!challengeId || !matchSettingId || !assignmentId) return;
      const actionKey = `assignment-${assignmentId}`;
      if (privateTestActions[actionKey]?.status === 'saving') return;

      const parsedInput = parseJsonValue(testCaseInput);
      const parsedOutput = parseJsonValue(expectedOutput);
      if (!parsedInput.ok || !parsedOutput.ok) {
        setPrivateTestActions((prev) => ({
          ...prev,
          [actionKey]: {
            status: 'error',
            message: 'Input and output must be valid JSON values.',
          },
        }));
        return;
      }

      setPrivateTestActions((prev) => ({
        ...prev,
        [actionKey]: { status: 'saving', message: '' },
      }));

      try {
        const res = await addMatchSettingPrivateTest({
          challengeId,
          matchSettingId,
          assignmentId,
          input: parsedInput.value,
          output: parsedOutput.value,
        });

        if (res?.success) {
          setPrivateTestActions((prev) => ({
            ...prev,
            [actionKey]: {
              status: 'saved',
              message: res?.data?.added
                ? 'Added to private tests.'
                : 'Already in private tests.',
            },
          }));
        } else {
          setPrivateTestActions((prev) => ({
            ...prev,
            [actionKey]: {
              status: 'error',
              message: getApiErrorMessage(
                res,
                'Unable to add this test to private tests.'
              ),
            },
          }));
        }
      } catch (err) {
        setPrivateTestActions((prev) => ({
          ...prev,
          [actionKey]: {
            status: 'error',
            message: getApiErrorMessage(
              err,
              'Unable to add this test to private tests.'
            ),
          },
        }));
      }
    },
    [addMatchSettingPrivateTest, challengeId, privateTestActions]
  );

  useEffect(() => {
    if (!challengeId || typeof EventSource === 'undefined') return undefined;
    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });
    const handleParticipantJoined = async (event) => {
      let payload = null;
      if (event?.data) {
        try {
          payload = JSON.parse(event.data);
        } catch {
          payload = null;
        }
      }
      const payloadId = Number(payload?.challengeId);
      if (!payloadId || payloadId !== Number(challengeId)) return;
      if (typeof payload?.count === 'number') {
        setStudentCount(payload?.count);
      }
      try {
        const res = await getChallengeParticipantsRef.current(payloadId);
        if (res?.success && Array.isArray(res.data)) {
          setStudentCount(res.data.length);
          setParticipants(res.data);
        }
      } catch {
        // Keep the last known list if refresh fails.
      }
    };

    const handleChallengeUpdated = (event) => {
      if (!event?.data) {
        load();
        return;
      }
      try {
        const payload = JSON.parse(event.data);
        const payloadId = Number(payload?.challengeId);
        if (payloadId === Number(challengeId)) {
          load();
        }
      } catch {
        load();
      }
    };

    source.addEventListener(
      'challenge-participant-joined',
      handleParticipantJoined
    );
    source.addEventListener('challenge-updated', handleChallengeUpdated);
    source.addEventListener('finalization-updated', handleChallengeUpdated);

    return () => {
      source.close();
    };
  }, [challengeId, load]);

  useEffect(() => {
    if (process.env.NODE_ENV === 'test') return undefined;
    const id = setInterval(() => {
      setPhaseNow(Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!challenge?.status) return;
    if (challenge.status === ChallengeStatus.ENDED_PHASE_TWO) {
      setPeerReviewMessages([]);
      return;
    }
    if (challenge.status !== ChallengeStatus.STARTED_PHASE_TWO) {
      setPeerReviewMessages((prev) =>
        prev.filter((message) => message.text !== PEER_REVIEW_STARTED_MESSAGE)
      );
    }
  }, [challenge?.status]);

  const handleAssign = useCallback(async () => {
    if (!challengeId) return;
    const now = Date.now();
    const canStartNow =
      challenge?.startDatetime &&
      new Date(challenge.startDatetime).getTime() <= now;
    if (!canStartNow) {
      setError('The challenge start time has not been reached yet.');
      return;
    }
    if (!studentCount) {
      setError('No students have joined this challenge yet.');
      return;
    }
    setAssigning(true);
    setError(null);
    try {
      const res = await assignChallenge(challengeId);
      if (res?.success === false) {
        setError(getApiErrorMessage(res, 'Unable to assign students'));
      }
      await load();
    } catch (_err) {
      setError('Unable to assign students');
    } finally {
      setAssigning(false);
    }
  }, [
    assignChallenge,
    challengeId,
    load,
    studentCount,
    challenge?.startDatetime,
  ]);

  const handleStart = useCallback(async () => {
    if (!challengeId) return;
    setStarting(true);
    setError(null);
    try {
      const res = await startChallenge(challengeId);
      if (res?.success === false) {
        setError(getApiErrorMessage(res, 'Unable to start challenge'));
      }
      await load();
    } catch (_err) {
      setError('Unable to start challenge');
    } finally {
      setStarting(false);
    }
  }, [challengeId, load, startChallenge]);

  const parseExpectedReviews = useCallback((value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 2) {
      return null;
    }
    return parsed;
  }, []);

  const handleAssignReviews = useCallback(async () => {
    if (!challengeId) return;
    const parsed = parseExpectedReviews(expectedReviews);
    if (!parsed) {
      setExpectedReviewsError(
        'Enter a whole number greater than or equal to 2.'
      );
      return;
    }
    setExpectedReviewsError('');
    setAssigningReviews(true);
    setError(null);
    setPeerReviewMessages([]);
    try {
      const res = await assignPeerReviews(challengeId, parsed);
      if (res?.success === false) {
        setError(getApiErrorMessage(res, 'Unable to assign peer reviews'));
        return;
      }
      if (Array.isArray(res?.results)) {
        const assignmentMap = new Map(
          assignments.map((group) => [
            group.challengeMatchSettingId,
            group.matchSetting?.problemTitle || null,
          ])
        );
        const messages = [];
        let assignedCount = 0;
        res.results.forEach((result) => {
          const label = assignmentMap.get(result.challengeMatchSettingId);
          const prefix = label
            ? `${label}: `
            : `Match setting ${result.challengeMatchSettingId}: `;
          if (result.status === 'assigned') {
            assignedCount += 1;
            if (result.teacherMessage) {
              messages.push({
                tone: 'warning',
                text: `${prefix}${result.teacherMessage}`,
              });
            }
          } else if (result.status === 'insufficient_valid_submissions') {
            messages.push({
              tone: 'warning',
              text: `${prefix}Not enough valid submissions to assign peer reviews.`,
            });
          } else if (result.teacherMessage) {
            messages.push({
              tone: 'error',
              text: `${prefix}${result.teacherMessage}`,
            });
          } else {
            messages.push({
              tone: 'error',
              text: `${prefix}Unable to assign peer reviews.`,
            });
          }
        });
        if (assignedCount > 0) {
          messages.unshift({
            tone: 'success',
            text: `Peer reviews assigned for ${assignedCount} match setting${
              assignedCount === 1 ? '' : 's'
            }.`,
          });
        }
        setPeerReviewMessages(messages);
      }
      await load();
    } catch (_err) {
      setError('Unable to assign peer reviews');
    } finally {
      setAssigningReviews(false);
    }
  }, [
    assignPeerReviews,
    challengeId,
    expectedReviews,
    load,
    parseExpectedReviews,
    assignments,
  ]);

  const handleStartPeerReview = useCallback(async () => {
    if (!challengeId) return;
    setStartingPeerReview(true);
    setError(null);
    try {
      const res = await startPeerReview(challengeId);
      if (res?.success === false) {
        setError(getApiErrorMessage(res, 'Unable to start peer review'));
        return;
      }
      setPeerReviewMessages([
        {
          tone: 'success',
          text: PEER_REVIEW_STARTED_MESSAGE,
        },
      ]);
      await load();
    } catch (_err) {
      setError('Unable to start peer review');
    } finally {
      setStartingPeerReview(false);
    }
  }, [challengeId, load, startPeerReview]);

  const dangerActions = useMemo(
    () => ({
      endCoding: {
        key: 'endCoding',
        label: 'End coding phase',
        title: 'End coding phase?',
        description:
          'This will immediately stop the coding phase for all students.',
        confirmLabel: 'End coding phase',
        pendingLabel: 'Ending coding phase...',
        errorMessage: 'Unable to end the coding phase.',
        run: endCodingPhase,
      },
      endPeerReview: {
        key: 'endPeerReview',
        label: 'End peer review',
        title: 'End peer review?',
        description:
          'This will finalize peer review and lock in the current results.',
        confirmLabel: 'End peer review',
        pendingLabel: 'Ending peer review...',
        errorMessage: 'Unable to end peer review.',
        run: endPeerReview,
      },
      endChallenge: {
        key: 'endChallenge',
        label: 'End challenge',
        title: 'End challenge?',
        description:
          'This will immediately complete the challenge without starting peer review.',
        confirmLabel: 'End challenge',
        pendingLabel: 'Ending challenge...',
        errorMessage: 'Unable to end the challenge.',
        run: endChallenge,
      },
    }),
    [endChallenge, endCodingPhase, endPeerReview]
  );

  const activeDangerAction = dangerAction ? dangerActions[dangerAction] : null;

  const handleConfirmDangerAction = useCallback(async () => {
    if (!challengeId || !dangerAction) return;
    const actionConfig = dangerActions[dangerAction];
    if (!actionConfig) return;
    setDangerPending(true);
    setError(null);
    try {
      const res = await actionConfig.run(challengeId);
      if (res?.success === false) {
        setError(getApiErrorMessage(res, actionConfig.errorMessage));
        return;
      }
      setDangerAction(null);
      await load();
    } catch (_err) {
      setError(actionConfig.errorMessage);
    } finally {
      setDangerPending(false);
    }
  }, [challengeId, dangerAction, dangerActions, load]);

  const handleCancelDangerAction = useCallback(() => {
    if (dangerPending) return;
    setDangerAction(null);
  }, [dangerPending]);

  const handleEditClick = () => {
    if (!challengeId) return;
    if (challenge?.status === ChallengeStatus.PUBLIC) {
      setEditDialogOpen(true);
      return;
    }
    router.push(`/challenges/${challengeId}/edit`);
  };

  const handleEditCancel = () => {
    setEditDialogOpen(false);
  };

  const handleConfirmUnpublish = async () => {
    if (!challengeId) return;
    setEditPending(true);
    setError(null);
    try {
      const result = await unpublishChallenge(challengeId);
      if (!result?.success) {
        setError(
          getApiErrorMessage(result, 'Unable to unpublish this challenge.')
        );
        setEditPending(false);
        return;
      }
      setEditDialogOpen(false);
      router.push(`/challenges/${challengeId}/edit`);
    } catch {
      setError('Unable to unpublish this challenge.');
    } finally {
      setEditPending(false);
    }
  };

  const hasStudents = studentCount > 0;
  const hasMatches = assignments.some((group) => group.matches?.length);
  const canStartNow = useMemo(() => {
    if (!challenge?.startDatetime) return true;
    return new Date(challenge.startDatetime).getTime() <= phaseNow;
  }, [challenge?.startDatetime, phaseNow]);
  const showStartButton =
    challenge?.status === ChallengeStatus.ASSIGNED &&
    hasStudents &&
    hasMatches &&
    canStartNow;
  const peerReviewReady = Boolean(challenge?.peerReviewReady);
  const totalMatches = useMemo(() => {
    if (Number.isInteger(challenge?.totalMatches)) {
      return challenge.totalMatches;
    }
    if (!assignments.length) return 0;
    return assignments.reduce(
      (sum, group) => sum + (group.matches?.length || 0),
      0
    );
  }, [assignments, challenge?.totalMatches]);
  const finalSubmissionCount = useMemo(() => {
    if (typeof challenge?.finalSubmissionCount === 'number') {
      return challenge.finalSubmissionCount;
    }
    if (typeof challenge?.totalSubmissionsCount === 'number') {
      return challenge.totalSubmissionsCount;
    }
    return null;
  }, [challenge?.finalSubmissionCount, challenge?.totalSubmissionsCount]);
  const pendingFinalCount = useMemo(() => {
    if (typeof challenge?.pendingFinalCount === 'number') {
      return challenge.pendingFinalCount;
    }
    if (
      typeof finalSubmissionCount === 'number' &&
      typeof totalMatches === 'number'
    ) {
      return Math.max(0, totalMatches - finalSubmissionCount);
    }
    return null;
  }, [challenge?.pendingFinalCount, finalSubmissionCount, totalMatches]);
  const hasPendingFinalizations =
    typeof pendingFinalCount === 'number' && pendingFinalCount > 0;
  const showAssignReviewsButton =
    challenge?.status === ChallengeStatus.ENDED_PHASE_ONE &&
    !peerReviewReady &&
    !hasPendingFinalizations;
  const showStartPeerReviewButton =
    challenge?.status === ChallengeStatus.ENDED_PHASE_ONE &&
    peerReviewReady &&
    !hasPendingFinalizations;
  const showPeerReviewInProgress =
    challenge?.status === ChallengeStatus.STARTED_PHASE_TWO;
  const showEndCodingPhaseButton =
    isTeacher && challenge?.status === ChallengeStatus.STARTED_PHASE_ONE;
  const showEndPeerReviewButton =
    isTeacher && challenge?.status === ChallengeStatus.STARTED_PHASE_TWO;
  const showEndChallengeButton =
    isTeacher && challenge?.status === ChallengeStatus.ENDED_PHASE_ONE;
  const showDangerZone =
    showEndCodingPhaseButton ||
    showEndPeerReviewButton ||
    showEndChallengeButton;
  const isEditableStatus =
    challenge?.status === ChallengeStatus.PRIVATE ||
    challenge?.status === ChallengeStatus.PUBLIC;
  const requiresUnpublish = challenge?.status === ChallengeStatus.PUBLIC;
  const editDisabled =
    !isTeacher || !isEditableStatus || loading || editPending;
  const editTitle = (() => {
    if (!isTeacher) return 'Only teachers can edit challenges.';
    if (!isEditableStatus)
      return 'Challenges can only be edited before the coding phase starts.';
    if (requiresUnpublish) return 'Unpublish this challenge to edit it.';
    return 'Edit this challenge.';
  })();

  const phaseStatus = challenge?.status;
  const isPhaseOneActive = phaseStatus === ChallengeStatus.STARTED_PHASE_ONE;
  const isPhaseTwoActive = phaseStatus === ChallengeStatus.STARTED_PHASE_TWO;
  const isPhaseOneComplete = useMemo(
    () =>
      phaseStatus === ChallengeStatus.ENDED_PHASE_ONE ||
      phaseStatus === ChallengeStatus.STARTED_PHASE_TWO ||
      phaseStatus === ChallengeStatus.ENDED_PHASE_TWO,
    [phaseStatus]
  );
  const isPhaseTwoComplete = phaseStatus === ChallengeStatus.ENDED_PHASE_TWO;

  const phaseOneStart =
    challenge?.startPhaseOneDateTime || challenge?.startDatetime;
  const phaseOneEndMs = getPhaseEndMs(
    phaseOneStart,
    challenge?.duration,
    challenge?.endPhaseOneDateTime
  );
  const phaseOneEndDisplay = resolveEndDisplay(
    challenge?.endPhaseOneDateTime,
    phaseOneEndMs
  );
  const phaseTwoStart = challenge?.startPhaseTwoDateTime;
  const phaseTwoEndMs = getPhaseEndMs(
    phaseTwoStart,
    challenge?.durationPeerReview,
    challenge?.endPhaseTwoDateTime
  );
  const phaseTwoEndDisplay = resolveEndDisplay(
    challenge?.endPhaseTwoDateTime,
    phaseTwoEndMs
  );

  const phaseOneTimeLeft =
    isPhaseOneActive && phaseOneEndMs
      ? Math.max(0, Math.floor((phaseOneEndMs - phaseNow) / 1000))
      : null;
  const phaseTwoTimeLeft =
    isPhaseTwoActive && phaseTwoEndMs
      ? Math.max(0, Math.floor((phaseTwoEndMs - phaseNow) / 1000))
      : null;

  const phaseOneCountdownSeconds = (() => {
    if (!isPhaseOneActive) return null;
    const bufferedStart = getBufferedStartMs(phaseOneStart);
    if (!bufferedStart) return null;
    return Math.max(0, Math.ceil((bufferedStart - phaseNow) / 1000));
  })();

  const phaseTwoCountdownSeconds = (() => {
    if (!isPhaseTwoActive) return null;
    const bufferedStart = getBufferedStartMs(phaseTwoStart);
    if (!bufferedStart) return null;
    return Math.max(0, Math.ceil((bufferedStart - phaseNow) / 1000));
  })();

  const phaseOneCardClass = useMemo(() => {
    if (isPhaseOneActive) {
      return 'border-emerald-500/40 bg-emerald-500/10 ring-1 ring-emerald-500/30';
    }
    if (isPhaseOneComplete) {
      return 'border-border/60 bg-muted/40';
    }
    return 'border-border/60 bg-card';
  }, [isPhaseOneActive, isPhaseOneComplete]);

  const phaseTwoCardClass = useMemo(() => {
    if (isPhaseTwoActive) {
      return 'border-indigo-500/40 bg-indigo-500/10 ring-1 ring-indigo-500/30';
    }
    if (isPhaseTwoComplete) {
      return 'border-border/60 bg-muted/40';
    }
    return 'border-border/60 bg-card';
  }, [isPhaseTwoActive, isPhaseTwoComplete]);

  const showPhaseTwoSubmissionCount = useMemo(
    () =>
      phaseStatus === ChallengeStatus.ENDED_PHASE_ONE ||
      phaseStatus === ChallengeStatus.STARTED_PHASE_TWO ||
      phaseStatus === ChallengeStatus.ENDED_PHASE_TWO,
    [phaseStatus]
  );
  const expectedReviewsLocked =
    phaseStatus === ChallengeStatus.STARTED_PHASE_TWO ||
    phaseStatus === ChallengeStatus.ENDED_PHASE_TWO;
  const expectedReviewsDirty =
    String(challenge?.allowedNumberOfReview ?? '') !== expectedReviews;

  const handleSaveExpectedReviews = useCallback(async () => {
    if (!challengeId || expectedReviewsLocked) return;
    const parsed = parseExpectedReviews(expectedReviews);
    if (!parsed) {
      setExpectedReviewsError(
        'Enter a whole number greater than or equal to 2.'
      );
      setExpectedReviewsSaved('');
      return;
    }
    setExpectedReviewsError('');
    setExpectedReviewsSaved('');
    setSavingExpectedReviews(true);
    setError(null);
    try {
      const res = await updateExpectedReviews(challengeId, parsed);
      if (res?.success === false) {
        setExpectedReviewsError(
          getApiErrorMessage(res, 'Unable to save expected reviews.')
        );
        return;
      }
      setChallenge((prev) =>
        prev ? { ...prev, allowedNumberOfReview: parsed } : prev
      );
      setExpectedReviews(String(parsed));
      setExpectedReviewsSaved('Saved.');
    } catch (_err) {
      setExpectedReviewsError('Unable to save expected reviews.');
    } finally {
      setSavingExpectedReviews(false);
    }
  }, [
    challengeId,
    expectedReviews,
    expectedReviewsLocked,
    parseExpectedReviews,
    updateExpectedReviews,
  ]);

  const statusBadge = useMemo(() => {
    const tone =
      statusTone[challenge?.status] || statusTone[ChallengeStatus.PRIVATE];
    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${tone}`}
      >
        {getChallengeStatusLabel(challenge?.status) || '—'}
      </span>
    );
  }, [challenge?.status]);

  const expectedReviewsInput = (
    <div className='space-y-1'>
      <div className='flex flex-wrap items-center gap-2'>
        <input
          type='number'
          min='2'
          disabled={expectedReviewsLocked}
          className='h-9 w-full max-w-35 rounded-md border border-border/60 bg-background px-2 text-sm font-semibold text-foreground disabled:cursor-not-allowed disabled:bg-muted/40'
          value={expectedReviews}
          onChange={(event) => {
            setExpectedReviews(event.target.value);
            setExpectedReviewsError('');
            setExpectedReviewsSaved('');
          }}
        />
        {!expectedReviewsLocked ? (
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={handleSaveExpectedReviews}
            disabled={savingExpectedReviews || !expectedReviewsDirty}
            title='Save expected reviews per submission'
          >
            {savingExpectedReviews ? 'Saving...' : 'Save'}
          </Button>
        ) : null}
      </div>
      {expectedReviewsError ? (
        <p className='text-xs font-medium text-destructive'>
          {expectedReviewsError}
        </p>
      ) : null}
      {!expectedReviewsError && expectedReviewsSaved ? (
        <p className='text-xs font-medium text-emerald-700'>
          {expectedReviewsSaved}
        </p>
      ) : null}
    </div>
  );

  const detailItems = [
    {
      label: 'Start',
      value: formatDateTime(challenge?.startDatetime),
    },
    {
      label: 'Expected reviews / submission',
      value: expectedReviewsInput,
    },
    {
      label: 'Number of students',
      value: studentCount,
    },
  ];
  const joinedStudents = participants.map((participant) => ({
    id: participant.id,
    name: buildStudentName(
      participant.student,
      participant.studentId ?? participant.id
    ),
  }));
  const showParticipantList = !assignments.length && !error && isTeacher;
  const teacherMatchSettings = useMemo(() => {
    if (!teacherResults?.matchSettings) return [];
    return Array.isArray(teacherResults.matchSettings)
      ? teacherResults.matchSettings
      : [];
  }, [teacherResults]);

  return {
    challengeId,
    isTeacher,
    challenge,
    assignments,
    participants,
    joinedStudents,
    showParticipantList,
    studentCount,
    error,
    loading,
    assigning,
    assigningReviews,
    starting,
    startingPeerReview,
    statusBadge,
    detailItems,
    showStartButton,
    showAssignReviewsButton,
    showStartPeerReviewButton,
    showPeerReviewInProgress,
    phaseStatus,
    phaseOneCardClass,
    phaseTwoCardClass,
    phaseOneStart,
    phaseOneEndDisplay,
    phaseOneCountdownSeconds,
    phaseOneTimeLeft,
    isPhaseOneActive,
    phaseTwoStart,
    phaseTwoEndDisplay,
    phaseTwoCountdownSeconds,
    phaseTwoTimeLeft,
    isPhaseTwoActive,
    showPhaseTwoSubmissionCount,
    totalMatches,
    finalSubmissionCount,
    pendingFinalCount,
    hasPendingFinalizations,
    expectedReviewsLocked,
    expectedReviewsDirty,
    expectedReviews,
    expectedReviewsError,
    expectedReviewsSaved,
    savingExpectedReviews,
    handleSaveExpectedReviews,
    setExpectedReviews,
    setExpectedReviewsError,
    setExpectedReviewsSaved,
    peerReviewMessages,
    showDangerZone,
    showEndCodingPhaseButton,
    showEndPeerReviewButton,
    showEndChallengeButton,
    setDangerAction,
    dangerPending,
    activeDangerAction,
    handleConfirmDangerAction,
    handleCancelDangerAction,
    editDialogOpen,
    editPending,
    editDisabled,
    editTitle,
    handleEditClick,
    handleConfirmUnpublish,
    handleEditCancel,
    load,
    handleAssign,
    handleStart,
    handleAssignReviews,
    handleStartPeerReview,
    canShowTeacherResults,
    teacherResultsOpen,
    teacherResultsLoading,
    teacherResultsError,
    teacherMatchSettings,
    privateTestActions,
    handleAddPrivateTest,
    handleToggleTeacherResults,
  };
}
