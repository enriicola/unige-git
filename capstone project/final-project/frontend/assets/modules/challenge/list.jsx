'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useChallenge from '#js/useChallenge';
import { API_REST_BASE, ChallengeStatus } from '#js/constants';
import useJsonSchema from '#js/useJsonSchema';
import ChallengeCard from '#components/challenge/ChallengeCard';
import Spinner from '#components/common/Spinner';
import { Button } from '#components/common/Button';
import Timer from '#components/common/Timer';
import { useAppDispatch, useAppSelector } from '#js/store/hooks';
import { setChallengeCountdown } from '#js/store/slices/ui';
import styles from './list.module.css';

const COUNTDOWN_DURATION = 5;
const isPrivateStatus = (status) =>
  status === ChallengeStatus.PRIVATE || status === 'draft';
const getChallengeStartTimestamp = (challenge) => {
  const value = challenge?.startPhaseOneDateTime || challenge?.startDatetime;
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return null;
  return timestamp;
};
const isActiveStatus = (challenge, nowMs) => {
  const status = challenge?.status;
  if (
    status === ChallengeStatus.STARTED_PHASE_ONE ||
    status === ChallengeStatus.ENDED_PHASE_ONE ||
    status === ChallengeStatus.STARTED_PHASE_TWO
  ) {
    return true;
  }
  if (
    status === ChallengeStatus.PUBLIC ||
    status === ChallengeStatus.ASSIGNED
  ) {
    const startTimestamp = getChallengeStartTimestamp(challenge);
    if (startTimestamp === null) return false;
    return startTimestamp <= nowMs;
  }
  return false;
};
const isUpcomingStatus = (challenge, nowMs) => {
  const status = challenge?.status;
  if (
    status === ChallengeStatus.PUBLIC ||
    status === ChallengeStatus.ASSIGNED
  ) {
    const startTimestamp = getChallengeStartTimestamp(challenge);
    if (startTimestamp === null) return true;
    return startTimestamp > nowMs;
  }
  return false;
};
const isEndedStatus = (status) => status === ChallengeStatus.ENDED_PHASE_TWO;
const parseNumericValue = (value) => {
  if (value === '' || value === null || value === undefined) return value;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? value : parsed;
};
const getMatchSettingIds = (challenge) => {
  if (Array.isArray(challenge?.matchSettingIds)) {
    return challenge.matchSettingIds.filter((id) => Number.isInteger(id));
  }
  if (Array.isArray(challenge?.matchSettings)) {
    return challenge.matchSettings
      .map((setting) => setting?.id)
      .filter((id) => Number.isInteger(id));
  }
  return [];
};
const buildPublishPayload = (challenge) => ({
  id: challenge?.id,
  title: challenge?.title,
  duration: parseNumericValue(challenge?.duration),
  startDatetime: challenge?.startDatetime,
  endDatetime: challenge?.endDatetime,
  durationPeerReview: parseNumericValue(challenge?.durationPeerReview),
  allowedNumberOfReview: parseNumericValue(challenge?.allowedNumberOfReview),
  matchSettingIds: getMatchSettingIds(challenge),
  status: ChallengeStatus.PUBLIC,
});

export default function ChallengeList({ scope = 'main' }) {
  const {
    loading,
    getChallenges,
    getChallengeParticipants,
    publishChallenge,
    assignChallenge,
    startChallenge,
    assignPeerReviews,
    startPeerReview,
  } = useChallenge();

  const { validate } = useJsonSchema();
  const [challenges, setChallenges] = useState([]);
  const [participantsMap, setParticipantsMap] = useState({});
  const [error, setError] = useState(null);
  const [pending, setPending] = useState({});
  const [reviewErrors, setReviewErrors] = useState({});
  const [assignNotice, setAssignNotice] = useState(null);
  const [publishEligibility, setPublishEligibility] = useState({});
  const [publishValidationError, setPublishValidationError] = useState(null);
  const [publishValidationLoading, setPublishValidationLoading] =
    useState(false);
  const isPrivateView = scope === 'private';
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth?.user?.id);
  const countdowns = useAppSelector((state) => {
    if (!userId) return {};
    return state.ui.challengeCountdowns?.[userId] || {};
  });
  const countdownsRef = useRef(countdowns);

  const getChallengeParticipantsRef = useRef(getChallengeParticipants);
  useEffect(() => {
    getChallengeParticipantsRef.current = getChallengeParticipants;
  }, [getChallengeParticipants]);

  useEffect(() => {
    countdownsRef.current = countdowns;
  }, [countdowns]);

  const load = useCallback(async () => {
    setError(null);
    const result = await getChallenges();
    if (result?.success === false) {
      setError(result.message || 'Unable to load challenges');
      setChallenges([]);
      setParticipantsMap({});
      return;
    }
    let nextChallenges = [];
    if (Array.isArray(result)) nextChallenges = result;
    else if (Array.isArray(result?.data)) nextChallenges = result.data;
    setChallenges(nextChallenges);
    setParticipantsMap((prev) => {
      if (!nextChallenges.length) return {};
      const next = {};
      nextChallenges.forEach((challenge) => {
        const challengeId = challenge?.id;
        if (!challengeId) return;
        if (Object.prototype.hasOwnProperty.call(prev, challengeId)) {
          next[challengeId] = prev[challengeId];
        }
      });
      return next;
    });
  }, [getChallenges]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const source = new EventSource(`${API_REST_BASE}/events`, {
      withCredentials: true,
    });

    const handleChallengeUpdated = (event) => {
      let payload = null;
      if (event?.data) {
        try {
          payload = JSON.parse(event.data);
        } catch {
          payload = null;
        }
      }
      if (!payload?.challengeId) {
        load();
        return;
      }

      setChallenges((prev) =>
        prev.map((challenge) => {
          if (challenge.id !== payload.challengeId) return challenge;
          return {
            ...challenge,
            status: payload.status ?? challenge.status,
          };
        })
      );
      load();
    };

    const handleParticipantJoined = async (event) => {
      let payload = null;
      if (event?.data) {
        try {
          payload = JSON.parse(event.data);
        } catch {
          payload = null;
        }
      }
      if (!payload?.challengeId) return;

      if (typeof payload?.count === 'number') {
        setParticipantsMap((prev) => ({
          ...prev,
          [payload.challengeId]: payload.count,
        }));
        return;
      }

      try {
        const res = await getChallengeParticipantsRef.current(
          payload?.challengeId
        );
        const count =
          res?.success && Array.isArray(res.data) ? res.data.length : 0;
        setParticipantsMap((prev) => ({
          ...prev,
          [payload.challengeId]: count,
        }));
      } catch {
        setParticipantsMap((prev) => ({
          ...prev,
          [payload.challengeId]: 0,
        }));
      }
    };

    source.addEventListener('challenge-updated', handleChallengeUpdated);
    source.addEventListener('finalization-updated', handleChallengeUpdated);
    source.addEventListener(
      'challenge-participant-joined',
      handleParticipantJoined
    );

    return () => {
      source.close();
    };
  }, [load]);

  const privateChallenges = useMemo(
    () =>
      challenges.filter((challenge) => isPrivateStatus(challenge.status ?? '')),
    [challenges]
  );
  const nonPrivateChallenges = useMemo(
    () =>
      challenges.filter(
        (challenge) => !isPrivateStatus(challenge.status ?? '')
      ),
    [challenges]
  );
  const nowMs = Date.now();
  const activeChallenges = useMemo(
    () =>
      nonPrivateChallenges.filter((challenge) =>
        isActiveStatus(challenge, nowMs)
      ),
    [nonPrivateChallenges, nowMs]
  );
  const upcomingChallenges = useMemo(
    () =>
      nonPrivateChallenges.filter((challenge) =>
        isUpcomingStatus(challenge, nowMs)
      ),
    [nonPrivateChallenges, nowMs]
  );
  const endedChallenges = useMemo(
    () =>
      nonPrivateChallenges.filter((challenge) =>
        isEndedStatus(challenge.status ?? '')
      ),
    [nonPrivateChallenges]
  );
  const visibleChallenges = useMemo(() => {
    if (isPrivateView) return privateChallenges;
    return [...activeChallenges, ...upcomingChallenges, ...endedChallenges];
  }, [
    activeChallenges,
    endedChallenges,
    isPrivateView,
    privateChallenges,
    upcomingChallenges,
  ]);
  const participantChallenges = useMemo(
    () => (isPrivateView ? privateChallenges : nonPrivateChallenges),
    [isPrivateView, nonPrivateChallenges, privateChallenges]
  );

  useEffect(() => {
    let isActive = true;
    if (!isPrivateView) {
      setPublishEligibility({});
      setPublishValidationError(null);
      setPublishValidationLoading(false);
      return () => {
        isActive = false;
      };
    }
    if (!privateChallenges.length) {
      setPublishEligibility({});
      setPublishValidationError(null);
      setPublishValidationLoading(false);
      return () => {
        isActive = false;
      };
    }
    const validateForPublish = async () => {
      setPublishValidationLoading(true);
      setPublishValidationError(null);
      try {
        const results = await Promise.all(
          privateChallenges.map(async (challenge) => {
            const payload = buildPublishPayload(challenge);
            const outcome = await validate({
              itemTypeData: { type: 'challenge-public' },
              data: payload,
              kind: 'public',
            });
            return {
              id: challenge.id,
              valid: outcome.valid,
              errors: outcome.errors,
            };
          })
        );

        if (!isActive) return;
        const nextEligibility = {};
        results.forEach((result) => {
          if (!result?.id) return;
          nextEligibility[result.id] = {
            valid: result.valid,
            errors: result.errors,
          };
        });
        setPublishEligibility(nextEligibility);
      } catch (validationError) {
        if (!isActive) return;
        setPublishEligibility({});
        setPublishValidationError(
          validationError?.message ||
            'Unable to validate challenges for publishing.'
        );
      } finally {
        if (isActive) {
          setPublishValidationLoading(false);
        }
      }
    };

    validateForPublish();
    return () => {
      isActive = false;
    };
  }, [isPrivateView, privateChallenges, validate]);

  useEffect(() => {
    if (!participantChallenges.length) return;
    const fetchParticipantsForPage = async () => {
      const newCounts = {};
      await Promise.all(
        participantChallenges.map(async (challenge) => {
          try {
            const res = await getChallengeParticipantsRef.current(challenge.id);
            newCounts[challenge.id] =
              res?.success && Array.isArray(res.data) ? res.data.length : 0;
          } catch {
            newCounts[challenge.id] = 0;
          }
        })
      );
      setParticipantsMap((prev) => ({ ...prev, ...newCounts }));
    };
    fetchParticipantsForPage();
  }, [participantChallenges]);

  const setPendingAction = (id, key, value) => {
    setPending((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || {}), [key]: value },
    }));
  };

  const handleAssign = async (challengeId) => {
    setError(null);
    setPendingAction(challengeId, 'assign', true);
    try {
      const res = await assignChallenge(challengeId);
      if (res?.success)
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challengeId
              ? { ...c, status: ChallengeStatus.ASSIGNED }
              : c
          )
        );
      else setError(res?.message || 'Unable to assign students to challenge');
    } catch {
      setError('Unable to assign students to challenge');
    } finally {
      setPendingAction(challengeId, 'assign', false);
    }
  };

  const handleStart = async (challengeId) => {
    setError(null);
    setPendingAction(challengeId, 'start', true);
    try {
      const res = await startChallenge(challengeId);
      if (res?.success)
        setChallenges((prev) =>
          prev.map((c) =>
            c.id === challengeId
              ? { ...c, status: ChallengeStatus.STARTED_PHASE_ONE }
              : c
          )
        );
      else setError(res?.message || 'Unable to start challenge');
    } catch {
      setError('Unable to start challenge');
    } finally {
      setPendingAction(challengeId, 'start', false);
    }
  };

  const handleAllowedNumberChange = (challengeId, value) => {
    setChallenges((prev) =>
      prev.map((challenge) =>
        challenge.id === challengeId
          ? { ...challenge, allowedNumberOfReview: value }
          : challenge
      )
    );
    setReviewErrors((prev) => {
      if (!prev[challengeId]) return prev;
      const next = { ...prev };
      delete next[challengeId];
      return next;
    });
  };

  const parseExpectedReviews = (value) => {
    const parsed = Number(value);
    if (!Number.isInteger(parsed) || parsed < 2) {
      return null;
    }
    return parsed;
  };

  const handleAssignReviews = async (challengeId, expectedValue) => {
    const parsed = parseExpectedReviews(expectedValue);
    if (!parsed) {
      setReviewErrors((prev) => ({
        ...prev,
        [challengeId]:
          'Enter a whole number greater than or equal to 2 before assigning.',
      }));
      return;
    }
    setAssignNotice(null);
    setReviewErrors((prev) => {
      if (!prev[challengeId]) return prev;
      const next = { ...prev };
      delete next[challengeId];
      return next;
    });
    setPendingAction(challengeId, 'assignReviews', true);
    setError(null);
    try {
      const res = await assignPeerReviews(challengeId, parsed);
      if (res?.success === false) {
        setError(res?.message || 'Unable to assign peer reviews');
        return;
      }
      if (Array.isArray(res?.results)) {
        const assignedCount = res.results.filter(
          (result) => result.status === 'assigned'
        ).length;
        const insufficient = res.results.find(
          (result) => result.status === 'insufficient_valid_submissions'
        );
        const failed = res.results.find(
          (result) =>
            result.status !== 'assigned' &&
            result.status !== 'insufficient_valid_submissions'
        );
        const reduced = res.results.find(
          (result) => result.status === 'assigned' && result.teacherMessage
        );
        const allAssignableAssigned = res.results.every(
          (result) =>
            result.status === 'assigned' ||
            result.status === 'insufficient_valid_submissions'
        );
        if (assignedCount > 0) {
          setAssignNotice({
            tone: reduced ? 'warning' : 'success',
            text: reduced
              ? 'Peer reviews assigned, but expected reviews per submission were reduced.'
              : 'Peer reviews assigned successfully.',
          });
          if (allAssignableAssigned) {
            setChallenges((prev) =>
              prev.map((challenge) =>
                challenge.id === challengeId
                  ? { ...challenge, peerReviewReady: true }
                  : challenge
              )
            );
          }
        } else if (failed) {
          setAssignNotice({
            tone: 'error',
            text: failed.teacherMessage || 'Unable to assign peer reviews.',
          });
        } else if (insufficient) {
          setAssignNotice({
            tone: 'warning',
            text: 'Peer review could not be assigned because there are not enough valid submissions.',
          });
        }
      }
    } catch {
      setError('Unable to assign peer reviews');
    } finally {
      setPendingAction(challengeId, 'assignReviews', false);
    }
  };

  const handleStartPeerReview = async (challengeId) => {
    setAssignNotice(null);
    setPendingAction(challengeId, 'startPeerReview', true);
    setError(null);
    try {
      const res = await startPeerReview(challengeId);
      if (res?.success === false) {
        setError(res?.message || 'Unable to start peer review');
        return;
      }
      setAssignNotice({
        tone: 'success',
        text: 'Peer review started successfully.',
      });
      setChallenges((prev) =>
        prev.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, status: ChallengeStatus.STARTED_PHASE_TWO }
            : challenge
        )
      );
    } catch {
      setError('Unable to start peer review');
    } finally {
      setPendingAction(challengeId, 'startPeerReview', false);
    }
  };

  const handlePublish = async (challenge) => {
    if (!challenge?.id) return;
    setAssignNotice(null);
    setError(null);
    setPendingAction(challenge.id, 'publish', true);
    try {
      const res = await publishChallenge(challenge.id);
      if (res?.success) {
        setAssignNotice({
          tone: 'success',
          text: 'Challenge published successfully.',
        });
        setChallenges((prev) =>
          prev.map((item) =>
            item.id === challenge.id
              ? { ...item, status: ChallengeStatus.PUBLIC }
              : item
          )
        );
        return;
      }
      setError(
        res?.error?.message || res?.message || 'Unable to publish challenge'
      );
    } catch {
      setError('Unable to publish challenge');
    } finally {
      setPendingAction(challenge.id, 'publish', false);
    }
  };

  const renderTimeLeft = (challenge) => {
    if (challenge.status === ChallengeStatus.STARTED_PHASE_ONE) {
      return (
        <Timer
          duration={challenge.duration}
          challengeId={challenge.id}
          startTime={challenge.startPhaseOneDateTime || challenge.startDatetime}
          label='Time left'
        />
      );
    }
    if (challenge.status === ChallengeStatus.STARTED_PHASE_TWO) {
      return (
        <Timer
          duration={challenge.durationPeerReview}
          challengeId={`${challenge.id}-peer-review`}
          startTime={challenge.startPhaseTwoDateTime}
          label='Time left'
        />
      );
    }
    return null;
  };

  // Countdown with persistence (Redux)
  useEffect(() => {
    if (!userId) return undefined;
    const timers = {};
    visibleChallenges.forEach((challenge) => {
      if (challenge.status === ChallengeStatus.STARTED_PHASE_ONE) {
        const storedValue = countdownsRef.current?.[challenge.id];
        const initialValue =
          typeof storedValue === 'number' ? storedValue : COUNTDOWN_DURATION;

        if (storedValue == null) {
          dispatch(
            setChallengeCountdown({
              userId,
              challengeId: challenge.id,
              value: initialValue,
            })
          );
        }

        if (initialValue <= 0) return;

        timers[challenge.id] = setInterval(() => {
          const currentValue = countdownsRef.current?.[challenge.id];
          if (typeof currentValue !== 'number') return;
          if (currentValue <= 1) {
            clearInterval(timers[challenge.id]);
            dispatch(
              setChallengeCountdown({
                userId,
                challengeId: challenge.id,
                value: 0,
              })
            );
            return;
          }
          dispatch(
            setChallengeCountdown({
              userId,
              challengeId: challenge.id,
              value: currentValue - 1,
            })
          );
        }, 1000);
      }
    });
    return () => Object.values(timers).forEach(clearInterval);
  }, [dispatch, userId, visibleChallenges]);

  const renderActions = (challenge, studentCount) => {
    if (isPrivateView) {
      const eligibility = publishEligibility[challenge.id];
      const isPublishing = pending[challenge.id]?.publish;
      const isValid = Boolean(eligibility?.valid);
      const isChecking = publishValidationLoading && !eligibility;
      let label = 'Publish';
      if (isPublishing) {
        label = 'Publishing...';
      } else if (isChecking) {
        label = 'Checking...';
      }
      let title = 'Publish this challenge';
      if (publishValidationError) {
        title = publishValidationError;
      } else if (!isValid) {
        if (eligibility?.errors?.length) {
          title = `Complete required fields: ${eligibility.errors.join(' | ')}`;
        } else {
          title = 'Complete required fields before publishing.';
        }
      }

      return (
        <Button
          size='sm'
          onClick={(event) => {
            event.preventDefault();
            handlePublish(challenge);
          }}
          disabled={
            isPublishing ||
            !isValid ||
            Boolean(publishValidationError) ||
            isChecking
          }
          title={title}
        >
          {label}
        </Button>
      );
    }

    const hasStudents = studentCount > 0;
    const now = new Date();
    const canStartNow =
      challenge.startDatetime && new Date(challenge.startDatetime) <= now;
    let pendingFinalizations = false;
    if (typeof challenge.pendingFinalCount === 'number') {
      pendingFinalizations = challenge.pendingFinalCount > 0;
    } else if (
      typeof challenge.totalMatches === 'number' &&
      typeof challenge.finalSubmissionCount === 'number'
    ) {
      pendingFinalizations =
        challenge.totalMatches > challenge.finalSubmissionCount;
    }

    if (challenge.status === ChallengeStatus.PUBLIC && canStartNow) {
      return (
        <Button
          onClick={(e) => {
            e.preventDefault();
            if (!hasStudents) {
              setError('No students have joined this challenge yet.');
              return;
            }
            handleAssign(challenge.id);
          }}
          disabled={pending[challenge.id]?.assign}
          size='sm'
          title='Assign students to this challenge'
        >
          {pending[challenge.id]?.assign ? 'Assigning...' : 'Assign students'}
        </Button>
      );
    }

    if (challenge.status === ChallengeStatus.ASSIGNED) {
      return (
        <Button
          variant='secondary'
          size='sm'
          onClick={(e) => {
            e.preventDefault();
            if (!hasStudents) {
              setError('No students have joined this challenge yet.');
              return;
            }
            handleStart(challenge.id);
          }}
          disabled={pending[challenge.id]?.start}
          title='Start this challenge'
        >
          {pending[challenge.id]?.start ? 'Starting...' : 'Start'}
        </Button>
      );
    }

    if (challenge.status === ChallengeStatus.STARTED_PHASE_ONE) {
      return null;
    }

    if (challenge.status === ChallengeStatus.ENDED_PHASE_ONE) {
      if (pendingFinalizations) return null;
      if (challenge.peerReviewReady) {
        return (
          <Button
            size='sm'
            onClick={(event) => {
              event.preventDefault();
              handleStartPeerReview(challenge.id);
            }}
            disabled={pending[challenge.id]?.startPeerReview}
            title='Start the peer review phase'
          >
            {pending[challenge.id]?.startPeerReview
              ? 'Starting...'
              : 'Start Peer Review'}
          </Button>
        );
      }
      return (
        <Button
          size='sm'
          onClick={(event) => {
            event.preventDefault();
            handleAssignReviews(challenge.id, challenge.allowedNumberOfReview);
          }}
          disabled={pending[challenge.id]?.assignReviews}
          title='Assign peer reviews for this challenge'
        >
          {pending[challenge.id]?.assignReviews ? 'Assigning...' : 'Assign'}
        </Button>
      );
    }

    return null;
  };

  const getNoticeClassName = (tone) => {
    if (tone === 'success') return styles.noticeSuccess;
    if (tone === 'warning') return styles.noticeWarning;
    return styles.noticeError;
  };

  const renderChallengeCards = (items) => (
    <div className={styles.grid}>
      {items.map((challenge) => {
        const studentCount = participantsMap[challenge.id] || 0;
        return (
          <ChallengeCard
            key={challenge.id ?? challenge.title}
            challenge={{ ...challenge, participants: studentCount }}
            href={`/challenges/${challenge.id}`}
            actions={renderActions(challenge, studentCount)}
            extraInfo={renderTimeLeft(challenge)}
            onAllowedNumberChange={handleAllowedNumberChange}
            allowedNumberError={reviewErrors[challenge.id]}
          />
        );
      })}
    </div>
  );

  if (loading && !challenges.length && !error) {
    return (
      <div className={styles.center}>
        <Spinner label='Loading challenges…' />
      </div>
    );
  }

  if (isPrivateView) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <h2>Private challenges</h2>
          <div className={styles.headerActions}>
            <Button variant='outline' onClick={load} title='Refresh challenges'>
              Refresh
            </Button>
          </div>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        {publishValidationError && (
          <p className={styles.error}>{publishValidationError}</p>
        )}
        {assignNotice && (
          <p
            className={`${styles.notice} ${getNoticeClassName(
              assignNotice.tone
            )}`}
          >
            {assignNotice.text}
          </p>
        )}
        {!error && !loading && !challenges.length && (
          <p className={styles.empty}>
            No challenges yet. Try creating one from the backend.
          </p>
        )}
        <div className={styles.group}>
          <div className={styles.groupHeader}>
            <h3 className={styles.groupTitle}>Private challenges</h3>
            <span className={styles.groupHint}>
              {privateChallenges.length
                ? 'Not visible to students'
                : 'None yet'}
            </span>
          </div>
          {privateChallenges.length ? (
            renderChallengeCards(privateChallenges)
          ) : (
            <p className={styles.empty}>No private challenges yet.</p>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>Challenges</h2>
        <div className={styles.headerActions}>
          <Button variant='outline' onClick={load} title='Refresh challenges'>
            Refresh
          </Button>
        </div>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {assignNotice && (
        <p
          className={`${styles.notice} ${getNoticeClassName(assignNotice.tone)}`}
        >
          {assignNotice.text}
        </p>
      )}
      {!error && !loading && !challenges.length && (
        <p className={styles.empty}>
          No challenges yet. Try creating one from the backend.
        </p>
      )}
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <h3 className={styles.groupTitle}>Active</h3>
          <span className={styles.groupHint}>
            {activeChallenges.length ? 'In progress' : 'None running'}
          </span>
        </div>
        {activeChallenges.length ? (
          renderChallengeCards(activeChallenges)
        ) : (
          <p className={styles.empty}>No active challenges right now.</p>
        )}
      </div>
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <h3 className={styles.groupTitle}>Upcoming</h3>
          <span className={styles.groupHint}>
            {upcomingChallenges.length ? 'Scheduled' : 'None scheduled'}
          </span>
        </div>
        {upcomingChallenges.length ? (
          renderChallengeCards(upcomingChallenges)
        ) : (
          <p className={styles.empty}>No upcoming challenges.</p>
        )}
      </div>
      <div className={styles.group}>
        <div className={styles.groupHeader}>
          <h3 className={styles.groupTitle}>Ended</h3>
          <span className={styles.groupHint}>
            {endedChallenges.length ? 'Completed' : 'No history yet'}
          </span>
        </div>
        {endedChallenges.length ? (
          renderChallengeCards(endedChallenges)
        ) : (
          <p className={styles.empty}>No ended challenges yet.</p>
        )}
      </div>
    </section>
  );
}
