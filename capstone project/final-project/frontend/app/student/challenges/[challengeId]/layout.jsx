'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '#components/common/card';
import useChallenge from '#js/useChallenge';

import {
  API_REST_BASE,
  ChallengeStatus,
  getChallengeStatusLabel,
} from '#js/constants';
import useRoleGuard from '#js/useRoleGuard';
import { getApiErrorMessage } from '#js/apiError';
import useApiErrorRedirect from '#js/useApiErrorRedirect';
import { useAppSelector } from '#js/store/hooks';
import { DurationProvider } from './(context)/DurationContext';

// shared layout for match, peer review, and results
export default function ChallengeLayout({ children }) {
  const params = useParams();
  const challengeId = params?.challengeId;
  const { getChallengeForJoinedStudent } = useChallenge();
  const router = useRouter();
  const pathname = usePathname();
  const redirectOnError = useApiErrorRedirect();
  const [challengeData, setchallengeData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const authState = useAppSelector((state) => state.auth);
  const authUser = authState?.user;
  const authLoading = authState?.loading;
  const isLoggedIn = authState?.isLoggedIn;
  const peerReviewExitMap = useAppSelector((state) => state.ui.peerReviewExits);
  const { user: guardUser, isAuthorized } = useRoleGuard({
    allowedRoles: ['student'],
  });
  const effectiveUser = authUser || guardUser;
  const studentId = effectiveUser?.id;
  const isStudentUser = effectiveUser?.role === 'student';
  const peerReviewExitKey = challengeId ? String(challengeId) : null;
  const hasExitedPeerReview = Boolean(
    studentId &&
    peerReviewExitKey &&
    peerReviewExitMap?.[studentId]?.[peerReviewExitKey]
  );

  useEffect(() => {
    if (!challengeId || !studentId || !isStudentUser) return () => {};

    let cancelled = false;

    async function loadStatus() {
      setLoading(true);
      setError(null);

      try {
        const res = await getChallengeForJoinedStudent(challengeId, studentId);
        if (!cancelled) {
          if (res?.success) {
            setchallengeData(res.data);
            const status = res.data?.status;
            const isPeerReviewRoute = pathname?.includes('/peer-review');
            const isResultRoute = pathname?.includes('/result');
            const isMatchRoute = pathname?.includes('/match');
            const isPeerReviewActive =
              status === ChallengeStatus.STARTED_PHASE_TWO;
            const isEndedPhaseTwo = status === ChallengeStatus.ENDED_PHASE_TWO;
            const isEndedPhaseOne = status === ChallengeStatus.ENDED_PHASE_ONE;
            let expectedSegment = 'match';
            if (isEndedPhaseTwo) {
              expectedSegment = 'result';
            } else if (isEndedPhaseOne) {
              expectedSegment = 'peer-review';
            } else if (isPeerReviewActive) {
              expectedSegment = hasExitedPeerReview ? 'result' : 'peer-review';
            }
            if (
              expectedSegment === 'result' &&
              !isEndedPhaseTwo &&
              !hasExitedPeerReview
            ) {
              expectedSegment = 'peer-review';
            }

            let shouldRedirect = false;
            if (expectedSegment === 'result' && !isResultRoute) {
              shouldRedirect = true;
            } else if (
              expectedSegment === 'peer-review' &&
              !isPeerReviewRoute
            ) {
              shouldRedirect = true;
            } else if (expectedSegment === 'match' && !isMatchRoute) {
              shouldRedirect = true;
            }

            if (shouldRedirect) {
              router.push(
                `/student/challenges/${challengeId}/${expectedSegment}`
              );
            }
          } else {
            if (redirectOnError(res)) return;
            setError({
              message: getApiErrorMessage(
                res,
                'Unable to load challenge info.'
              ),
            });
          }
        }
      } catch (e) {
        if (!cancelled) {
          setError({
            message:
              'Network error while loading challenge information. Please try again.',
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadStatus();
    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });
    const handleUpdate = (event) => {
      if (!event?.data) {
        loadStatus();
        return;
      }
      try {
        const payload = JSON.parse(event.data);
        const payloadId = Number(payload?.challengeId);
        if (payloadId === Number(challengeId)) {
          loadStatus();
        }
      } catch {
        loadStatus();
      }
    };
    source.addEventListener('challenge-updated', handleUpdate);

    return () => {
      cancelled = true;
      source.close();
    };
  }, [
    challengeId,
    studentId,
    getChallengeForJoinedStudent,
    isStudentUser,
    hasExitedPeerReview,
    pathname,
    redirectOnError,
    router,
  ]);
  const {
    status,
    title,
    duration,
    durationPeerReview,
    startPhaseOneDateTime,
    startPhaseTwoDateTime,
    startDatetime,
  } = challengeData || {};
  const phaseLabel = () => {
    switch (status) {
      case ChallengeStatus.STARTED_PHASE_ONE:
        return 'Coding Phase';
      // here we can add also scoring phase and peer revirew phase(third sprint)
      case '':
        return '';

      default:
        return getChallengeStatusLabel(status);
    }
  };
  const titleText = loading ? 'Loading challenge...' : title || 'Unknown';
  const phaseText = loading ? '' : phaseLabel();
  const showAuthLoading = authLoading && !effectiveUser;
  const canRenderChildren = isStudentUser && (isAuthorized || isLoggedIn);

  return (
    <div className='max-w-7xl mx-auto px-3 py-2 space-y-2 sm:px-4'>
      <Card>
        <CardHeader>
          <CardTitle>
            {titleText}
            {phaseText ? ` - ${phaseText}` : ''}
          </CardTitle>
        </CardHeader>

        {error && (
          <CardContent>
            <p className='text-sm text-red-600 dark:text-red-400'>
              {error.message}
            </p>
          </CardContent>
        )}
        {showAuthLoading && (
          <CardContent>
            <p className='text-sm text-muted-foreground'>
              Loading your profile...
            </p>
          </CardContent>
        )}
      </Card>
      {canRenderChildren && (
        <DurationProvider
          value={{
            duration: Number(duration) || 0,
            durationPeerReview: Number(durationPeerReview) || 0,
            challengeId,
            startPhaseOneDateTime,
            startPhaseTwoDateTime,
            startDatetime,
            status,
          }}
        >
          {children}
        </DurationProvider>
      )}
    </div>
  );
}
