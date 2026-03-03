'use client';

import { useCallback, useRef, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';
import { Button } from '#components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import useChallenge from '#js/useChallenge';
import useRoleGuard from '#js/useRoleGuard';
import { API_REST_BASE, ChallengeStatus } from '#js/constants';
import { getApiErrorMessage } from '#js/apiError';
import useApiErrorRedirect from '#js/useApiErrorRedirect';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import { setPeerReviewExit } from '#js/store/slices/ui';
import { validateIncorrectInput } from '#js/utils';
import {
  MESSAGE_PEER_REVIEW_WAIT,
  buildTimeLeft,
  formatCodeWithNewlines,
  resolveCodingPhaseMessage,
} from './peerReviewHelpers';
import FinalizationWaitCard from './FinalizationWaitCard';
import PeerReviewContent from './PeerReviewContent';
import { useDuration } from '../(context)/DurationContext';
// import { get } from 'node:http';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
});

export default function PeerReviewPage() {
  const params = useParams();
  const router = useRouter();
  const hasFinalizedRef = useRef(false);
  const dispatch = useAppDispatch();
  const durationContext = useDuration();
  const durationStatus = durationContext?.status;
  const authState = useAppSelector((state) => state.auth);
  const authUser = authState?.user;
  const authLoading = authState?.loading;
  const isLoggedIn = authState?.isLoggedIn;
  const { user: guardUser, isAuthorized } = useRoleGuard({
    allowedRoles: ['student'],
  });
  const effectiveUser = authUser || guardUser;
  const studentId = effectiveUser?.id;
  const isStudentUser = effectiveUser?.role === 'student';
  const challengeId = params?.challengeId;
  const {
    getStudentPeerReviewAssignments,
    getPeerReviewSummary,
    submitPeerReviewVote,
    getStudentVotes,
    finalizePeerReview,
    exitPeerReview,
    getChallengeResults,
  } = useChallenge();
  const redirectOnError = useApiErrorRedirect();

  const [assignments, setAssignments] = useState([]);
  const [challengeInfo, setChallengeInfo] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [voteMap, setVoteMap] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(null);
  const [finalSummary, setFinalSummary] = useState(null);
  const [submissionSummary, setSubmissionSummary] = useState(null);
  const [finalization, setFinalization] = useState(null);
  const [finalizationError, setFinalizationError] = useState(null);
  const [isFinalizationPending, setIsFinalizationPending] = useState(false);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [hasExited, setHasExited] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const isTestEnv = process.env.NODE_ENV === 'test';

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const redirectTimeoutRef = useRef(null);
  const theme = useAppSelector((state) => state.ui.theme);
  const monacoTheme = theme === 'dark' ? 'vs-dark' : 'vs';

  const isVotingDisabled =
    hasExited ||
    isExiting ||
    timeLeft === 0 ||
    challengeInfo?.status !== ChallengeStatus.STARTED_PHASE_TWO;

  const loadFinalization = useCallback(async () => {
    if (!challengeId || !studentId) return;
    const res = await getChallengeResults(challengeId, studentId);
    if (res?.success === false) {
      if (redirectOnError(res)) return;
      setFinalizationError(
        getApiErrorMessage(res, 'Unable to load submission summary.')
      );
      setFinalization(null);
      setSubmissionSummary(null);
      setIsFinalizationPending(false);
      return;
    }
    const payload = res?.data || res;
    const finalizationInfo = payload?.finalization || null;
    const resultsReady = finalizationInfo?.resultsReady === true;
    setFinalization(finalizationInfo);
    setSubmissionSummary(payload?.submissionSummary || null);
    setIsFinalizationPending(!resultsReady);
    setFinalizationError(null);
  }, [challengeId, studentId, getChallengeResults, redirectOnError]);

  useEffect(() => {
    if (!challengeId || !studentId || !isStudentUser) return undefined;
    let cancelled = false;

    const loadData = async () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
      setLoading(true);
      setError(null);
      try {
        const [assignmentsRes, votesRes] = await Promise.all([
          getStudentPeerReviewAssignments(challengeId, studentId),
          getStudentVotes(challengeId),
        ]);

        if (cancelled) return;

        if (assignmentsRes?.success === false) {
          if (redirectOnError(assignmentsRes)) return;
          setError(
            getApiErrorMessage(assignmentsRes, 'Unable to load peer review.')
          );
          setAssignments([]);
          return;
        }

        const nextAssignments = Array.isArray(assignmentsRes?.assignments)
          ? assignmentsRes.assignments
          : [];
        setAssignments(nextAssignments);
        setChallengeInfo(assignmentsRes?.challenge || null);

        const initialVoteMap = {};

        if (votesRes?.success && Array.isArray(votesRes.votes)) {
          votesRes.votes.forEach((v) => {
            initialVoteMap[v.submissionId] = {
              type: v.vote,
              input: v.testCaseInput || '',
              output: v.expectedOutput || '',
            };
          });
          // console.log(
          //   '✅ Votes hydrated from GET /votes endpoint:',
          //   initialVoteMap
          // );
        } else {
          // console.warn(
          //   '⚠️ Could not fetch votes independently or no votes found.'
          // );
        }

        setVoteMap(initialVoteMap);

        const challengeStatus = assignmentsRes?.challenge?.status;

        if (nextAssignments.length > 0) {
          setSelectedIndex(0);

          const allAssignmentsHaveVotes = nextAssignments.every((assignment) =>
            Boolean(initialVoteMap[assignment.submissionId]?.type)
          );

          if (
            allAssignmentsHaveVotes &&
            nextAssignments.length > 0 &&
            challengeStatus === ChallengeStatus.STARTED_PHASE_TWO
          ) {
            dispatch(
              setPeerReviewExit({
                userId: studentId,
                challengeId: String(challengeId),
                value: true,
              })
            );
            setHasExited(true);
            toast.success('Thanks for your participation.');
            redirectTimeoutRef.current = setTimeout(() => {
              redirectTimeoutRef.current = null;
              router.push(`/student/challenges/${challengeId}/result`);
            }, 1500);
          }
        }
      } catch (_err) {
        if (!cancelled) {
          // console.error(_err);
          setError('Unable to load data.');
          setAssignments([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, [
    challengeId,
    dispatch,
    studentId,
    isStudentUser,
    durationStatus,
    getStudentPeerReviewAssignments,
    getStudentVotes,
    loadFinalization,
    redirectOnError,
    router,
  ]);

  const phaseTwoStart = challengeInfo?.startPhaseTwoDateTime;
  const phaseTwoDuration = challengeInfo?.durationPeerReview;
  const phaseTwoEnd = challengeInfo?.endPhaseTwoDateTime;

  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
  }, []);

  useEffect(() => {
    if (!phaseTwoStart || !phaseTwoDuration) return undefined;

    const tick = () => {
      setTimeLeft(buildTimeLeft(phaseTwoStart, phaseTwoDuration, phaseTwoEnd));
    };

    tick();
    if (isTestEnv) return undefined;
    const intervalId = setInterval(tick, 1000);
    return () => clearInterval(intervalId);
  }, [phaseTwoStart, phaseTwoDuration, phaseTwoEnd, isTestEnv]);

  useEffect(() => {
    if (monacoRef.current) {
      monacoRef.current.editor.setTheme(monacoTheme);
    }
  }, [monacoTheme]);

  const fetchPeerReviewSummary = useCallback(async () => {
    if (!challengeId || !studentId) {
      return {
        success: false,
        error: 'Missing challenge or student',
      };
    }

    const res = await getPeerReviewSummary(challengeId, studentId);

    if (res?.success === false) {
      return {
        success: false,
        error: getApiErrorMessage(res, 'Unable to load summary'),
      };
    }

    return {
      success: true,
      summary: res?.summary || {
        total: 0,
        voted: 0,
        correct: 0,
        incorrect: 0,
        abstain: 0,
        unvoted: 0,
      },
    };
  }, [challengeId, studentId, getPeerReviewSummary]);

  useEffect(() => {
    if (timeLeft === 0 && challengeId && !hasFinalizedRef.current) {
      hasFinalizedRef.current = true;

      finalizePeerReview(challengeId)
        .then(async () => {
          const result = await fetchPeerReviewSummary();
          if (result.success) {
            setFinalSummary(result.summary);
            setShowSummaryDialog(true);
          } else {
            toast.error(result.error);
          }
        })
        .catch(() => {
          setError('Unable to finalize peer review.');
        });
    }
  }, [timeLeft, challengeId, finalizePeerReview, fetchPeerReviewSummary]);

  const effectiveStatus = durationStatus || challengeInfo?.status;
  const isPeerReviewActive =
    effectiveStatus === ChallengeStatus.STARTED_PHASE_TWO ||
    effectiveStatus === ChallengeStatus.ENDED_PHASE_TWO;
  const isCodingPhaseComplete =
    effectiveStatus === ChallengeStatus.ENDED_PHASE_ONE;

  useEffect(() => {
    if (!challengeId || !studentId || !isStudentUser) return undefined;

    if (!isCodingPhaseComplete) {
      setSubmissionSummary(null);
      setFinalization(null);
      setFinalizationError(null);
      setIsFinalizationPending(false);
      return undefined;
    }

    setIsFinalizationPending(true);
    loadFinalization();
    return undefined;
  }, [
    challengeId,
    studentId,
    isStudentUser,
    isCodingPhaseComplete,
    loadFinalization,
  ]);

  useEffect(() => {
    if (!challengeId || !studentId || !isStudentUser) return undefined;
    if (!isCodingPhaseComplete) return undefined;

    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });

    const handleUpdate = (event) => {
      if (!event?.data) {
        loadFinalization();
        return;
      }
      try {
        const payload = JSON.parse(event.data);
        const payloadId = Number(payload?.challengeId);
        if (payloadId === Number(challengeId)) {
          loadFinalization();
        }
      } catch {
        loadFinalization();
      }
    };

    source.addEventListener('finalization-updated', handleUpdate);
    source.addEventListener('challenge-updated', handleUpdate);

    return () => {
      source.close();
    };
  }, [
    challengeId,
    studentId,
    isStudentUser,
    isCodingPhaseComplete,
    loadFinalization,
  ]);

  const selectedAssignment = assignments[selectedIndex] || null;
  const selectedSubmissionId = selectedAssignment?.submissionId;

  const currentVoteEntry = selectedSubmissionId
    ? voteMap[selectedSubmissionId]
    : null;
  const hasExplicitVote = Boolean(currentVoteEntry?.type);
  const currentVote = hasExplicitVote ? currentVoteEntry.type : 'abstain';

  const completedCount = useMemo(
    () =>
      assignments.filter((assignment) => {
        const vote = voteMap[assignment.submissionId];
        if (!vote?.type) return false;
        if (vote.type === 'incorrect') {
          return !validationErrors[assignment.submissionId];
        }
        return true;
      }).length,
    [assignments, voteMap, validationErrors]
  );

  const progressValue = assignments.length
    ? Math.round((completedCount / assignments.length) * 100)
    : 0;

  const saveVoteToBackend = async (
    assignmentId,
    voteType,
    input = null,
    output = null
  ) => {
    if (hasExited || isExiting) return;

    const res = await submitPeerReviewVote(
      assignmentId,
      voteType,
      input,
      output
    );

    if (res?.success) {
      toast.success('Vote saved');
    } else {
      // console.error('Save failed', res);
      const msg = res?.error?.message || 'Failed to save vote';
      toast.error(msg);
    }
  };

  const handleCloseSummaryDialog = useCallback(() => {
    setShowSummaryDialog(false);
    setFinalSummary(null);
    if (studentId && challengeId) {
      dispatch(
        setPeerReviewExit({
          userId: studentId,
          challengeId: String(challengeId),
          value: true,
        })
      );
    }
    router.push(`/student/challenges/${challengeId}/result`);
  }, [router, challengeId, dispatch, studentId]);

  useEffect(() => {
    const t = showSummaryDialog
      ? setTimeout(() => {
          handleCloseSummaryDialog();
        }, 10000)
      : null;
    return () => {
      if (t) clearTimeout(t);
    };
  }, [showSummaryDialog, handleCloseSummaryDialog]);

  const handleVoteChange = (newVoteType) => {
    if (!selectedAssignment || hasExited || isExiting) return;

    const { submissionId } = selectedAssignment;
    const assignmentId = selectedAssignment.id;

    setVoteMap((prev) => ({
      ...prev,
      [submissionId]: {
        ...prev[submissionId],
        type: newVoteType,
      },
    }));

    if (newVoteType === 'correct' || newVoteType === 'abstain') {
      saveVoteToBackend(assignmentId, newVoteType, null, null);
      setValidationErrors((prev) => ({ ...prev, [submissionId]: null }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [submissionId]: {
          warning:
            "This vote won't count until you provide both input and expected output",
        },
      }));
    }
  };

  const handleIncorrectDetailsChange = (field, value) => {
    if (!selectedAssignment || hasExited || isExiting) return;
    const { submissionId } = selectedAssignment;
    const assignmentId = selectedAssignment.id;

    const currentEntry = voteMap[submissionId] || {};
    const updatedEntry = { ...currentEntry, [field]: value };

    setVoteMap((prev) => ({
      ...prev,
      [submissionId]: updatedEntry,
    }));

    const inputStr = field === 'input' ? value : currentEntry.input;
    const outputStr = field === 'output' ? value : currentEntry.output;
    const publicTests = selectedAssignment.matchSetting?.publicTests || [];

    const check = validateIncorrectInput(inputStr, outputStr, publicTests);

    if (check.valid) {
      setValidationErrors((prev) => ({ ...prev, [submissionId]: null }));
      saveVoteToBackend(assignmentId, 'incorrect', inputStr, outputStr);
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [submissionId]: check.error
          ? { error: check.error }
          : { warning: check.message },
      }));
    }
  };

  const saveCurrentVotes = async () => {
    if (!challengeId || !studentId || hasExited || isExiting) {
      return false;
    }

    const votesToSubmit = assignments
      .filter((assignment) => {
        const vote = voteMap[assignment.submissionId];
        return vote && vote.type;
      })
      .map((assignment) => {
        const vote = voteMap[assignment.submissionId];
        return {
          submissionId: assignment.submissionId,
          vote: vote.type,
          testCaseInput: vote.type === 'incorrect' ? vote.input || null : null,
          expectedOutput:
            vote.type === 'incorrect' ? vote.output || null : null,
        };
      });

    const res = await exitPeerReview(challengeId, studentId, votesToSubmit);

    if (res?.success === false) {
      const errorMsg =
        getApiErrorMessage(res, 'Unable to save votes') ||
        'Failed to save votes';
      toast.error(errorMsg);
      return false;
    }

    return true;
  };

  const handleContinue = async () => {
    setIsExiting(true);
    setExitDialogOpen(false);

    try {
      const success = await saveCurrentVotes();
      if (success) {
        toast.success('Votes saved successfully.');
      }
    } catch (err) {
      toast.error('Unable to save votes. Please try again.');
    } finally {
      setIsExiting(false);
    }
  };

  const handleExit = async () => {
    if (!challengeId || !studentId || hasExited || isExiting) return;

    setIsExiting(true);
    setExitDialogOpen(false);

    try {
      const success = await saveCurrentVotes();
      if (!success) {
        setIsExiting(false);
        return;
      }

      dispatch(
        setPeerReviewExit({
          userId: studentId,
          challengeId: String(challengeId),
          value: true,
        })
      );
      setHasExited(true);
      toast.success('Thanks for your participation.');
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      redirectTimeoutRef.current = setTimeout(() => {
        redirectTimeoutRef.current = null;
        router.push(`/student/challenges/${challengeId}/result`);
      }, 1500);
    } catch (err) {
      toast.error('Unable to exit peer review. Please try again.');
      setIsExiting(false);
    }
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(assignments.length - 1, prev + 1));
  };

  const isFirst = selectedIndex <= 0;
  const isLast =
    assignments.length === 0 || selectedIndex >= assignments.length - 1;

  const showSummaryToast = async () => {
    if (!challengeId || !studentId) return;
    toast.dismiss('peer-review-summary-loading');
    toast.dismiss('peer-review-summary');

    const loadingId = toast.loading('Loading summary...', {
      id: 'peer-review-summary-loading',
    });
    try {
      const res = await getPeerReviewSummary(challengeId, studentId);
      if (res?.success === false) {
        toast.error(getApiErrorMessage(res, 'Unable to load summary'));
        return;
      }
      const summary = res?.summary || {
        total: 0,
        voted: 0,
        correct: 0,
        incorrect: 0,
        abstain: 0,
        unvoted: 0,
      };
      toast.custom(
        (t) => (
          <div className='pointer-events-auto w-[360px] max-w-[92vw] rounded-2xl border-2 border-primary/20 bg-background shadow-xl shadow-primary/20 ring-1 ring-offset-2 ring-primary/50 p-1'>
            <div className='p-4'>
              <div className='flex items-start justify-between gap-3'>
                <div className='mb-2 pb-2'>
                  <p className='text-sm font-semibold text-primary'>Summary</p>
                  <p className='text-xs text-muted-foreground mt-0.5'>
                    Overview of your submitted votes
                  </p>
                </div>
                <div className='relative -top-3 -right-3'>
                  <Button
                    type='button'
                    onClick={() => toast.dismiss(t.id)}
                    variant='destructive'
                    size='sm'
                  >
                    ⤬
                  </Button>
                </div>
              </div>
              <div className='mt-3 rounded-xl border border-secondary bg-muted/40 p-3'>
                <p className='text-sm font-semibold text-foreground'>
                  Voted {summary.voted} of {summary.total}
                </p>
              </div>
              <div className='mt-3 space-y-2 text-sm'>
                <div className='flex items-center justify-between rounded-xl border border-border px-3 py-2'>
                  <span>Correct</span>
                  <span className='font-semibold'>{summary.correct}</span>
                </div>
                <div className='flex items-center justify-between rounded-xl border border-border px-3 py-2'>
                  <span>Incorrect</span>
                  <span className='font-semibold'>{summary.incorrect}</span>
                </div>
                <div className='flex items-center justify-between rounded-xl border border-border px-3 py-2'>
                  <span>Abstain</span>
                  <span className='font-semibold'>{summary.abstain}</span>
                </div>
                <div className='flex items-center justify-between rounded-xl border border-border px-3 py-2'>
                  <span>Unvoted</span>
                  <span className='font-semibold'>{summary.unvoted}</span>
                </div>
              </div>
            </div>
          </div>
        ),
        { id: 'peer-review-summary', duration: Infinity }
      );
    } catch (e) {
      toast.error('Unable to load summary');
    } finally {
      if (loadingId) toast.dismiss(loadingId);
    }
  };

  if (authLoading && !studentId) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <Card>
          <CardContent className='py-8 text-sm text-muted-foreground'>
            Loading your profile...
          </CardContent>
        </Card>
      </div>
    );
  }

  if ((!isLoggedIn && !isAuthorized) || !studentId || !isStudentUser)
    return null;

  if (isCodingPhaseComplete && !isPeerReviewActive) {
    const showFinalizationPending =
      isFinalizationPending || finalization === null;
    const progressText =
      typeof finalization?.totalMatches === 'number' &&
      typeof finalization?.finalSubmissionCount === 'number'
        ? `${finalization.finalSubmissionCount} / ${finalization.totalMatches}`
        : null;
    const pendingText =
      typeof finalization?.pendingFinalCount === 'number'
        ? `${finalization.pendingFinalCount}`
        : null;
    const codingPhaseMessage = resolveCodingPhaseMessage(submissionSummary);

    if (showFinalizationPending) {
      return (
        <FinalizationWaitCard
          progressText={progressText}
          pendingText={pendingText}
          errorText={finalizationError}
        />
      );
    }

    return (
      <div className='max-w-5xl mx-auto px-4 py-8 space-y-6'>
        <Card>
          <CardHeader>
            <CardTitle>Coding phase complete</CardTitle>
            <CardDescription>
              Wait for your teacher to start the peer review phase.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-2 text-sm text-muted-foreground'>
            <p>{codingPhaseMessage}</p>
            <p>{MESSAGE_PEER_REVIEW_WAIT}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!loading && !isPeerReviewActive) {
    return (
      <div className='max-w-3xl mx-auto px-4 py-8 space-y-4'>
        <Card>
          <CardHeader>
            <CardTitle>Peer Review</CardTitle>
            <CardDescription>
              Wait for your teacher to start the peer review phase.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant='outline'
              onClick={() => router.push('/student/challenges')}
            >
              Back to challenges
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <PeerReviewContent
      assignments={assignments}
      challengeId={challengeId}
      challengeInfo={challengeInfo}
      completedCount={completedCount}
      currentVote={currentVote}
      error={error}
      exitDialogOpen={exitDialogOpen}
      finalSummary={finalSummary}
      formatCodeWithNewlines={formatCodeWithNewlines}
      handleCloseSummaryDialog={handleCloseSummaryDialog}
      handleContinue={handleContinue}
      handleExit={handleExit}
      handleIncorrectDetailsChange={handleIncorrectDetailsChange}
      handleNext={handleNext}
      handlePrev={handlePrev}
      handleVoteChange={handleVoteChange}
      hasExplicitVote={hasExplicitVote}
      hasExited={hasExited}
      isExiting={isExiting}
      isFirst={isFirst}
      isLast={isLast}
      isVotingDisabled={isVotingDisabled}
      loading={loading}
      MonacoEditor={MonacoEditor}
      monacoTheme={monacoTheme}
      onEditorMount={handleEditorMount}
      progressValue={progressValue}
      selectedAssignment={selectedAssignment}
      selectedIndex={selectedIndex}
      selectedSubmissionId={selectedSubmissionId}
      setExitDialogOpen={setExitDialogOpen}
      setSelectedIndex={setSelectedIndex}
      showSummaryDialog={showSummaryDialog}
      showSummaryToast={showSummaryToast}
      timeLeft={timeLeft}
      validationErrors={validationErrors}
      voteMap={voteMap}
    />
  );
}
