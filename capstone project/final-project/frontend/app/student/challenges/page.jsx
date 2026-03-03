'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '#components/common/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '#components/common/card';
import {
  API_REST_BASE,
  ChallengeStatus,
  getChallengeStatusLabel,
} from '#js/constants';
import useChallenge from '#js/useChallenge';
import useRoleGuard from '#js/useRoleGuard';
import { formatDateTime } from '#js/date';

const ALLOWED_ROLES = ['student'];
const unjoinableStatuses = new Set([
  ChallengeStatus.STARTED_PHASE_ONE,
  ChallengeStatus.ENDED_PHASE_ONE,
  ChallengeStatus.STARTED_PHASE_TWO,
  ChallengeStatus.ENDED_PHASE_TWO,
]);

const statusStyles = {
  [ChallengeStatus.PUBLIC]: 'bg-primary/10 text-primary ring-1 ring-primary/15',
  [ChallengeStatus.ASSIGNED]:
    'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-200',
  [ChallengeStatus.STARTED_PHASE_ONE]:
    'bg-emerald-500/10 text-emerald-700 ring-1 ring-emerald-500/25 dark:text-emerald-200',
  [ChallengeStatus.STARTED_PHASE_TWO]:
    'bg-indigo-500/10 text-indigo-700 ring-1 ring-indigo-500/25 dark:text-indigo-200',
  [ChallengeStatus.ENDED_PHASE_ONE]:
    'bg-amber-500/10 text-amber-700 ring-1 ring-amber-500/25 dark:text-amber-200',
  [ChallengeStatus.ENDED_PHASE_TWO]:
    'bg-slate-500/10 text-slate-700 ring-1 ring-slate-500/25 dark:text-slate-200',
  [ChallengeStatus.PRIVATE]:
    'bg-muted text-muted-foreground ring-1 ring-border',
};

const activeStatuses = new Set([
  ChallengeStatus.ASSIGNED,
  ChallengeStatus.STARTED_PHASE_ONE,
  ChallengeStatus.ENDED_PHASE_ONE,
  ChallengeStatus.STARTED_PHASE_TWO,
]);

const getStartTimestamp = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return null;
  return timestamp;
};

const getChallengeStartTimestamp = (challenge) =>
  getStartTimestamp(
    challenge?.startPhaseOneDateTime || challenge?.startDatetime
  );

const sortByStartAsc = (a, b) => {
  const aStart = getChallengeStartTimestamp(a);
  const bStart = getChallengeStartTimestamp(b);
  if (aStart == null && bStart == null) return 0;
  if (aStart == null) return 1;
  if (bStart == null) return -1;
  return aStart - bStart;
};

const sortByStartDesc = (a, b) => {
  const aStart = getChallengeStartTimestamp(a);
  const bStart = getChallengeStartTimestamp(b);
  if (aStart == null && bStart == null) return 0;
  if (aStart == null) return 1;
  if (bStart == null) return -1;
  return bStart - aStart;
};

const getActivePriority = (status) => {
  if (status === ChallengeStatus.STARTED_PHASE_TWO) return 0;
  if (status === ChallengeStatus.STARTED_PHASE_ONE) return 1;
  if (status === ChallengeStatus.ENDED_PHASE_ONE) return 2;
  if (status === ChallengeStatus.ASSIGNED) return 3;
  return 4;
};

export default function StudentChallengesPage() {
  const router = useRouter();
  const { user, isAuthorized } = useRoleGuard({
    allowedRoles: ALLOWED_ROLES,
  });
  const studentId = user?.id;
  const { getChallengesForStudent, joinChallenge } = useChallenge();

  const [challenges, setChallenges] = useState([]);
  const [error, setError] = useState(null);
  const [now, setNow] = useState(new Date());
  const [pendingActions, setPendingActions] = useState({});
  const lastRedirectKeyRef = useRef(null);
  const activeRedirectStatuses = useRef([
    ChallengeStatus.ASSIGNED,
    ChallengeStatus.STARTED_PHASE_TWO,
    ChallengeStatus.STARTED_PHASE_ONE,
  ]);

  const loadChallenges = useCallback(async () => {
    try {
      if (!studentId) return undefined;
      const res = await getChallengesForStudent(studentId);
      if (!res || res.success === false) {
        setError(res?.message || 'Unable to load challenges');
        setChallenges([]);
        return undefined;
      }
      let list = [];
      if (Array.isArray(res)) list = res;
      else if (Array.isArray(res?.data)) list = res.data;
      setChallenges(list);
      return undefined;
    } catch {
      setError('Unable to load challenges');
      setChallenges([]);
      return undefined;
    }
  }, [getChallengesForStudent, studentId]);

  useEffect(() => {
    if (!isAuthorized || !studentId) return undefined;
    setNow(new Date());
    loadChallenges();
    const id = setInterval(() => {
      setNow(new Date());
    }, 30000);
    return () => clearInterval(id);
  }, [loadChallenges, isAuthorized, studentId]);

  useEffect(() => {
    if (!isAuthorized || !studentId) return undefined;
    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });
    const handleUpdate = () => {
      setNow(new Date());
      loadChallenges();
    };
    source.addEventListener('challenge-updated', handleUpdate);

    return () => {
      source.close();
    };
  }, [loadChallenges, isAuthorized, studentId]);

  useEffect(() => {
    if (!isAuthorized || !studentId) return;
    const activeChallenge = challenges.find(
      (challenge) =>
        challenge.joined &&
        activeRedirectStatuses.current.includes(challenge.status)
    );
    if (!activeChallenge) {
      lastRedirectKeyRef.current = null;
      return;
    }
    const redirectRoute =
      activeChallenge.status === ChallengeStatus.STARTED_PHASE_TWO
        ? 'peer-review'
        : 'match';
    const nextKey = `${activeChallenge.id}-${activeChallenge.status}`;
    if (lastRedirectKeyRef.current === nextKey) return;
    lastRedirectKeyRef.current = nextKey;
    router.push(`/student/challenges/${activeChallenge.id}/${redirectRoute}`);
  }, [challenges, isAuthorized, router, studentId]);

  const handleJoin = async (challengeId) => {
    setError(null);
    setPendingActions((prev) => ({ ...prev, [challengeId]: { join: true } }));
    if (!studentId) {
      setError('Student profile not available.');
      setPendingActions((prev) => {
        const next = { ...prev };
        delete next[challengeId];
        return next;
      });
      return undefined;
    }
    try {
      const res = await joinChallenge(challengeId, studentId);
      if (res?.success) {
        setChallenges((prev) =>
          prev.map((challenge) => {
            if (challenge.id !== challengeId) return challenge;
            return { ...challenge, joined: true };
          })
        );
      } else {
        setError(res?.message || 'Unable to join challenge');
      }
      return undefined;
    } catch {
      setError('Unable to join challenge');
      return undefined;
    } finally {
      setPendingActions((prev) => {
        const next = { ...prev };
        delete next[challengeId];
        return next;
      });
    }
  };

  const renderStatusBadge = (status) => {
    const styles =
      statusStyles[status] || statusStyles[ChallengeStatus.PRIVATE];
    return (
      <span
        className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-1 ${styles}`}
      >
        {getChallengeStatusLabel(status)}
      </span>
    );
  };

  const nowMs = now.getTime();

  const getStudentStatusLabel = (challenge) => {
    const startTimestamp = getChallengeStartTimestamp(challenge);
    const isUpcoming = startTimestamp !== null ? startTimestamp > nowMs : false;
    if (isUpcoming) return 'Upcoming';
    if (challenge.status === ChallengeStatus.STARTED_PHASE_ONE) return 'Coding';
    if (challenge.status === ChallengeStatus.ENDED_PHASE_ONE)
      return 'Awaiting peer review';
    if (challenge.status === ChallengeStatus.STARTED_PHASE_TWO)
      return 'Peer review';
    if (challenge.status === ChallengeStatus.ENDED_PHASE_TWO)
      return 'Completed';
    if (challenge.status === ChallengeStatus.PUBLIC)
      return challenge.joined ? 'Joined' : 'Joinable';
    if (challenge.status === ChallengeStatus.ASSIGNED)
      return challenge.joined ? 'Assigned' : 'Assigned';
    return challenge.status || 'Unknown';
  };

  const getChallengeRoute = (challenge) => {
    if (challenge.status === ChallengeStatus.STARTED_PHASE_TWO)
      return `/student/challenges/${challenge.id}/peer-review`;
    if (
      challenge.status === ChallengeStatus.ENDED_PHASE_TWO ||
      challenge.status === ChallengeStatus.ENDED_PHASE_ONE
    ) {
      return `/student/challenges/${challenge.id}/result`;
    }
    return `/student/challenges/${challenge.id}/match`;
  };

  const renderAction = (challenge) => {
    const isJoined = Boolean(challenge.joined);
    const { status } = challenge;
    const isUnjoinable = unjoinableStatuses.has(status);
    const isPhaseOneActive = status === ChallengeStatus.STARTED_PHASE_ONE;
    const isPhaseTwoActive = status === ChallengeStatus.STARTED_PHASE_TWO;
    const isPhaseOneComplete = status === ChallengeStatus.ENDED_PHASE_ONE;
    const isPhaseTwoComplete = status === ChallengeStatus.ENDED_PHASE_TWO;
    const startTimestamp = getChallengeStartTimestamp(challenge);
    const isUpcoming = startTimestamp !== null ? startTimestamp > nowMs : false;
    const isJoining = pendingActions[challenge.id]?.join;

    if (isUpcoming) {
      return (
        <div className='text-muted-foreground font-semibold text-sm'>
          Starts soon
        </div>
      );
    }

    if (!isJoined && status === ChallengeStatus.ASSIGNED) {
      return (
        <div className='text-destructive font-semibold text-sm'>
          Assignments are already set. Contact your teacher if you need access.
        </div>
      );
    }

    if (!isJoined && isUnjoinable) {
      return (
        <div className='text-destructive font-semibold text-sm'>
          the challenge is already in progress.
        </div>
      );
    }

    if (!isJoined) {
      return (
        <Button
          size='lg'
          onClick={() => handleJoin(challenge.id)}
          disabled={isJoining}
        >
          {isJoining ? 'Joining...' : 'Join'}
        </Button>
      );
    }

    if (isJoined && isPhaseOneActive) {
      return (
        <div className='text-primary font-semibold text-sm'>
          Challenge started. Redirecting...
        </div>
      );
    }

    if (isJoined && status === ChallengeStatus.ASSIGNED) {
      return (
        <div className='text-primary font-semibold text-sm'>
          Challenge assigned. Redirecting...
        </div>
      );
    }

    if (isJoined && isPhaseTwoActive) {
      return (
        <div className='text-primary font-semibold text-sm'>
          Peer review started. Redirecting...
        </div>
      );
    }

    if (isJoined && isPhaseOneComplete) {
      return (
        <Button
          size='lg'
          variant='secondary'
          onClick={() => router.push(getChallengeRoute(challenge))}
        >
          Open
        </Button>
      );
    }

    if (isJoined && isPhaseTwoComplete) {
      if (!challenge.resultsReady) {
        return null;
      }
      return (
        <Button
          size='lg'
          variant='secondary'
          onClick={() => router.push(getChallengeRoute(challenge))}
        >
          View Your Solution & Feedback
        </Button>
      );
    }

    return (
      <div className='text-primary font-semibold text-sm'>
        Wait for the teacher to start the challenge.
      </div>
    );
  };

  const activeChallenge = useMemo(() => {
    const joinedCandidates = challenges.filter(
      (challenge) => challenge.joined && activeStatuses.has(challenge.status)
    );
    if (joinedCandidates.length > 0) {
      const sorted = [...joinedCandidates].sort((a, b) => {
        const priorityDiff =
          getActivePriority(a.status) - getActivePriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return sortByStartAsc(a, b);
      });
      return sorted[0];
    }

    const joinableCurrent = challenges.filter((challenge) => {
      if (challenge.status !== ChallengeStatus.PUBLIC) return false;
      const startTimestamp = getChallengeStartTimestamp(challenge);
      if (startTimestamp == null) return false;
      return startTimestamp <= nowMs;
    });

    if (joinableCurrent.length > 0) {
      const sorted = [...joinableCurrent].sort(sortByStartAsc);
      return sorted[0];
    }

    const nonJoinedActive = challenges.filter(
      (challenge) => !challenge.joined && activeStatuses.has(challenge.status)
    );
    if (nonJoinedActive.length > 0) {
      const sorted = [...nonJoinedActive].sort((a, b) => {
        const priorityDiff =
          getActivePriority(a.status) - getActivePriority(b.status);
        if (priorityDiff !== 0) return priorityDiff;
        return sortByStartAsc(a, b);
      });
      return sorted[0];
    }

    return null;
  }, [challenges, nowMs]);

  const upcomingChallenge = useMemo(() => {
    const candidates = challenges.filter((challenge) => {
      const startTimestamp = getChallengeStartTimestamp(challenge);
      if (startTimestamp == null) return false;
      if (startTimestamp <= nowMs) return false;
      if (challenge.status === ChallengeStatus.ENDED_PHASE_TWO) return false;
      return !(activeChallenge && challenge.id === activeChallenge.id);
    });

    if (candidates.length === 0) return null;
    const sorted = [...candidates].sort(sortByStartAsc);
    return sorted[0];
  }, [activeChallenge, challenges, nowMs]);

  const endedChallenges = useMemo(() => {
    const ended = challenges.filter(
      (challenge) =>
        challenge.joined && challenge.status === ChallengeStatus.ENDED_PHASE_TWO
    );
    return [...ended].sort(sortByStartDesc);
  }, [challenges]);

  const renderEmptyCard = (message) => (
    <Card className='border border-dashed border-border bg-card'>
      <CardContent className='py-6'>
        <p className='text-muted-foreground text-sm'>{message}</p>
      </CardContent>
    </Card>
  );

  const renderChallengeCard = (challenge) => (
    <Card key={challenge.id} className='border border-border bg-card shadow-sm'>
      <CardHeader className='pb-4'>
        <div className='flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between'>
          <div className='space-y-1.5'>
            <CardTitle className='text-xl font-semibold'>
              {challenge.title}
            </CardTitle>
            <CardDescription className='text-muted-foreground'>
              {getStudentStatusLabel(challenge)}
            </CardDescription>
          </div>
          {renderStatusBadge(challenge.status)}
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <dl className='flex flex-wrap gap-6 text-sm text-muted-foreground'>
            <div className='space-y-1'>
              <dt className='text-xs font-semibold uppercase tracking-wide'>
                Start
              </dt>
              <dd className='text-foreground font-medium'>
                {formatDateTime(
                  challenge.startPhaseOneDateTime || challenge.startDatetime
                )}
              </dd>
            </div>
            <div className='space-y-1'>
              <dt className='text-xs font-semibold uppercase tracking-wide'>
                Duration
              </dt>
              <dd className='text-foreground font-medium'>
                {challenge.duration} min
              </dd>
            </div>
          </dl>

          <div className='flex flex-wrap gap-3 justify-end'>
            {renderAction(challenge)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!isAuthorized || !studentId) return null;

  return (
    <div className='max-w-5xl mx-auto px-6 py-8 space-y-6 relative'>
      <div className='space-y-2'>
        <p className='text-xs font-semibold uppercase tracking-wide text-muted-foreground'>
          Student area
        </p>
        <h1 className='text-3xl font-bold text-foreground'>
          Available Challenges
        </h1>
        <p className='text-muted-foreground text-sm'>
          Track future, active, and completed challenges in one place.
        </p>
      </div>

      {error && (
        <Card className='border border-destructive/30 bg-destructive/5 text-destructive'>
          <CardContent className='py-4'>
            <p className='text-sm'>{error}</p>
          </CardContent>
        </Card>
      )}

      <section className='space-y-3'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold text-foreground'>Active</h2>
          <p className='text-sm text-muted-foreground'>
            Your current challenge, if one is active.
          </p>
        </div>
        {activeChallenge
          ? renderChallengeCard(activeChallenge)
          : renderEmptyCard('No active challenges right now.')}
      </section>

      <section className='space-y-3'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold text-foreground'>Upcoming</h2>
          <p className='text-sm text-muted-foreground'>
            The nearest upcoming challenge in your schedule.
          </p>
        </div>
        {upcomingChallenge
          ? renderChallengeCard(upcomingChallenge)
          : renderEmptyCard('No upcoming challenges available.')}
      </section>

      <section className='space-y-3'>
        <div className='space-y-1'>
          <h2 className='text-lg font-semibold text-foreground'>Ended</h2>
          <p className='text-sm text-muted-foreground'>
            Completed challenges you participated in.
          </p>
        </div>
        {endedChallenges.length === 0
          ? renderEmptyCard('No completed challenges yet.')
          : endedChallenges.map((challenge) => renderChallengeCard(challenge))}
      </section>
    </div>
  );
}
