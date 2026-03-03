'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import useMatchSettings from '#js/useMatchSetting';
import useChallenge from '#js/useChallenge';
import ToggleSwitch from '#components/common/ToggleSwitch';
import Pagination from '#components/common/Pagination';
import { Button } from '#components/common/Button';
import AlertDialog from '#components/common/AlertDialog';
import Spinner from '#components/common/Spinner';
import * as Constants from '#js/constants';
import useRoleGuard from '#js/useRoleGuard';
import { formatDateTime } from '#js/date';
import {
  parsePositiveInt,
  isValidYearValue,
  resolvePickerValue,
  isDateTimeInputWithinLimits,
  DATE_TIME_PATTERN,
  normalizeDateTimeInput,
  resolveDateTimeInputValue,
  buildMinimumEndDate,
  formatDateTimeLocal,
  updateEndDateTime,
  buildDefaultDateTimes,
} from '#js/challenge-form-utils';
import styles from '../../../new-challenge/page.module.css';

const buildLocalDateTime = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return formatDateTimeLocal(parsed);
};

const mergeMatchSettings = (readySettings, selectedSettings) => {
  const merged = Array.isArray(readySettings) ? [...readySettings] : [];
  const seenIds = new Set(merged.map((setting) => setting.id));
  (Array.isArray(selectedSettings) ? selectedSettings : []).forEach(
    (setting) => {
      if (!setting?.id || seenIds.has(setting.id)) return;
      merged.push(setting);
      seenIds.add(setting.id);
    }
  );
  return merged;
};

const resolveChallengePayload = (result) => {
  if (!result || result?.success === false) return null;
  const direct =
    result?.challenge || result?.data?.challenge || result?.data || result;
  if (!direct || typeof direct !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(direct, 'id')) return null;
  return direct;
};

const resolveMatchSettingsPayload = (result) => {
  if (!result || result?.success === false) return [];
  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.matchSettings)) return result.matchSettings;
  if (Array.isArray(result?.data?.matchSettings)) {
    return result.data.matchSettings;
  }
  return [];
};

const resolveMatchSettingPayload = (result) => {
  if (!result || result?.success === false) return null;
  const direct =
    result?.matchSetting ||
    result?.data?.matchSetting ||
    result?.data ||
    result;
  if (!direct || typeof direct !== 'object') return null;
  if (!Object.prototype.hasOwnProperty.call(direct, 'id')) return null;
  return direct;
};

export default function EditChallengePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthorized } = useRoleGuard({
    allowedRoles: ['teacher', 'admin'],
  });
  const { getMatchSettings, getMatchSetting } = useMatchSettings();
  const { getChallengeById, updateChallenge } = useChallenge();
  const challengeId = params?.id;
  const defaultDateTimes = buildDefaultDateTimes({
    durationMinutes: 30,
    peerReviewMinutes: 30,
  });
  const mountedRef = useRef(false);
  const [challenge, setChallenge] = useState({
    title: '',
    startDatetime: defaultDateTimes.startDatetime,
    endDatetime: defaultDateTimes.endDatetime,
    startDatetimeInput: defaultDateTimes.startDatetimeInput,
    endDatetimeInput: defaultDateTimes.endDatetimeInput,
    duration: '30',
    allowedNumberOfReview: '5',
    matchSettingIds: [],
    status: Constants.ChallengeStatus.PRIVATE,
    durationPeerReview: '30',
  });
  const [matchSettings, setMatchSettings] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [overlapDialogOpen, setOverlapDialogOpen] = useState(false);
  const [overlapPayload, setOverlapPayload] = useState(null);
  const [initialStatus, setInitialStatus] = useState(null);
  const startPickerRef = useRef(null);
  const endPickerRef = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const totalPages = Math.ceil(matchSettings.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = matchSettings.slice(startIndex, endIndex);

  const toggleSetting = (id) => {
    setChallenge((prev) => ({
      ...prev,
      matchSettingIds: prev.matchSettingIds.includes(id)
        ? prev.matchSettingIds.filter((settingId) => settingId !== id)
        : [...prev.matchSettingIds, id],
    }));
  };

  const handleDataField = (event) => {
    const { name, value } = event.target;
    let nextChallenge = { ...challenge };

    if (name === 'startDatetime' || name === 'endDatetime') {
      if (!isDateTimeInputWithinLimits(value)) return;
      const { normalized, inputValue } = resolveDateTimeInputValue(value);
      nextChallenge = {
        ...nextChallenge,
        [name]: normalized,
        [`${name}Input`]: inputValue,
      };
    } else {
      nextChallenge = { ...nextChallenge, [name]: value };
    }

    if (
      name === 'startDatetime' ||
      name === 'duration' ||
      name === 'durationPeerReview'
    ) {
      const updated = updateEndDateTime(nextChallenge);
      if (updated) {
        nextChallenge = { ...nextChallenge, ...updated };
      }
    }

    setChallenge(nextChallenge);
  };

  const handleDatePickerChange = (name) => (event) => {
    const { value } = event.target;
    setChallenge((prev) => {
      let next = {
        ...prev,
        [name]: value,
        [`${name}Input`]: value ? formatDateTime(value) : '',
      };
      if (name === 'startDatetime') {
        const updated = updateEndDateTime(next);
        if (updated) {
          next = { ...next, ...updated };
        }
      }
      return next;
    });
  };

  const handleDateBlur = (name) => {
    setChallenge((prev) => {
      const rawValue = prev[`${name}Input`] || '';
      const normalized = normalizeDateTimeInput(rawValue);
      const parsed = new Date(normalized);
      if (Number.isNaN(parsed.getTime())) return prev;
      return {
        ...prev,
        [name]: normalized,
        [`${name}Input`]: formatDateTime(normalized),
      };
    });
  };

  const openPicker = (ref) => {
    if (ref.current?.showPicker) {
      ref.current.showPicker();
    } else {
      ref.current?.focus();
      ref.current?.click?.();
    }
  };

  const toISODateTime = (localDateTime) => {
    if (!localDateTime) return null;
    const dt = new Date(localDateTime);
    return dt.toISOString();
  };

  const buildReadableError = ({ message, code }) => {
    if (code === 'challenge_overlap') {
      return {
        message:
          'This challenge overlaps another scheduled challenge. Choose a different time or keep it private.',
        code,
      };
    }
    if (!message) {
      return { message: 'An unknown error occurred', code: null };
    }
    return { message, code: code || null };
  };

  const readErrorPayload = (payload) => {
    if (!payload || typeof payload !== 'object') return null;
    const errorCode = payload?.error?.code || payload?.code || null;
    if (payload?.error?.errors?.length > 0) {
      return { message: payload.error.errors[0].message, code: errorCode };
    }
    if (payload?.errors?.length > 0) {
      return { message: payload.errors[0].message, code: errorCode };
    }
    if (typeof payload?.message === 'string') {
      return { message: payload.message, code: errorCode };
    }
    if (typeof payload?.error?.message === 'string') {
      return { message: payload.error.message, code: errorCode };
    }
    return { message: null, code: errorCode };
  };

  const parseUpdateError = (result) => {
    const fallback = { message: 'An unknown error occurred', code: null };
    if (!result) return fallback;

    if (typeof result.message === 'string') {
      if (!result.message.startsWith(Constants.NETWORK_RESPONSE_NOT_OK)) {
        return buildReadableError({ message: result.message, code: null });
      }
      const rawMessage = result.message.slice(
        Constants.NETWORK_RESPONSE_NOT_OK.length
      );
      try {
        const jsonError = JSON.parse(rawMessage);
        return buildReadableError(readErrorPayload(jsonError) || fallback);
      } catch {
        return fallback;
      }
    }

    const payloads = [];
    if (result.details && typeof result.details === 'object') {
      payloads.push(result.details);
    }
    if (result.error && typeof result.error === 'object') {
      payloads.push({ error: result.error });
    }
    if (result.message && typeof result.message === 'object') {
      payloads.push({ error: result.message });
    }

    const parsed = payloads
      .map((payload) => readErrorPayload(payload))
      .find((entry) => entry?.message || entry?.code);
    if (parsed) {
      return buildReadableError(parsed);
    }

    return fallback;
  };

  useEffect(() => {
    if (!isAuthorized) return undefined;
    if (!challengeId) return undefined;
    mountedRef.current = true;

    const loadData = async () => {
      setLoadingChallenge(true);
      setError(null);
      try {
        const [challengeResult, matchSettingsResult] = await Promise.all([
          getChallengeById(challengeId),
          getMatchSettings(),
        ]);
        if (!mountedRef.current) return;

        const challengeData = resolveChallengePayload(challengeResult);
        if (!challengeData) {
          setError(
            challengeResult?.message || 'Unable to load challenge details.'
          );
          setLoadingChallenge(false);
          return;
        }

        const {
          title,
          duration,
          allowedNumberOfReview,
          durationPeerReview,
          status,
          startDatetime,
          endDatetime,
          startPhaseOneDateTime,
          endPhaseTwoDateTime,
          matchSettings: challengeMatchSettings,
        } = challengeData;

        const startSource = startDatetime || startPhaseOneDateTime || null;
        const endSource = endDatetime || endPhaseTwoDateTime || null;
        const localStart = buildLocalDateTime(startSource);
        const localEnd = buildLocalDateTime(endSource);
        let matchSettingIds = [];
        if (Array.isArray(challengeData.matchSettingIds)) {
          matchSettingIds = challengeData.matchSettingIds;
        } else if (Array.isArray(challengeMatchSettings)) {
          matchSettingIds = challengeMatchSettings
            .map((setting) => setting?.id)
            .filter(Boolean);
        }
        matchSettingIds = Array.from(new Set(matchSettingIds));

        let nextChallenge = {
          title: title || '',
          startDatetime: localStart,
          endDatetime: localEnd,
          startDatetimeInput: localStart ? formatDateTime(localStart) : '',
          endDatetimeInput: localEnd ? formatDateTime(localEnd) : '',
          duration: String(duration ?? ''),
          allowedNumberOfReview: String(allowedNumberOfReview ?? ''),
          matchSettingIds,
          status: status || Constants.ChallengeStatus.PRIVATE,
          durationPeerReview: String(durationPeerReview ?? ''),
        };

        if (!localEnd && localStart) {
          const updated = updateEndDateTime(nextChallenge);
          if (updated) {
            nextChallenge = {
              ...nextChallenge,
              ...updated,
            };
          }
        }

        setChallenge(nextChallenge);
        setInitialStatus(status || Constants.ChallengeStatus.PRIVATE);

        const readySettings = resolveMatchSettingsPayload(matchSettingsResult);
        let mergedSettings = mergeMatchSettings(
          readySettings,
          challengeMatchSettings
        );

        if (mergedSettings.length === 0 && matchSettingIds.length > 0) {
          const selectedSettings = await Promise.all(
            matchSettingIds.map((id) => getMatchSetting(id))
          );
          const resolvedSelected = selectedSettings
            .map((result) => resolveMatchSettingPayload(result))
            .filter(Boolean);
          mergedSettings = mergeMatchSettings(readySettings, resolvedSelected);
        }

        setMatchSettings(mergedSettings);

        if (status && status !== Constants.ChallengeStatus.PRIVATE) {
          setError(
            'This challenge must be private to edit. Unpublish it first.'
          );
        }
      } catch (err) {
        if (mountedRef.current) {
          setError('Error loading challenge details.');
        }
      } finally {
        if (mountedRef.current) {
          setLoadingChallenge(false);
        }
      }
    };

    loadData();
    return () => {
      mountedRef.current = false;
    };
  }, [
    challengeId,
    getChallengeById,
    getMatchSetting,
    getMatchSettings,
    isAuthorized,
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAuthorized) return;
    if (initialStatus !== Constants.ChallengeStatus.PRIVATE) return;
    setSuccessMessage(null);
    setError(null);

    const form = event.currentTarget;
    const titleInput = form?.querySelector?.('#title');
    const trimmedTitle = challenge.title.trim();
    if (titleInput && titleInput.value !== trimmedTitle) {
      titleInput.value = trimmedTitle;
    }
    if (trimmedTitle !== challenge.title) {
      setChallenge((prev) => ({
        ...prev,
        title: trimmedTitle,
      }));
    }
    const startInput = form?.querySelector?.('#startDatetime');
    const endInput = form?.querySelector?.('#endDatetime');
    if (startInput) startInput.setCustomValidity('');
    if (endInput) endInput.setCustomValidity('');
    if (
      startInput &&
      challenge.startDatetime &&
      !isValidYearValue(challenge.startDatetime)
    ) {
      startInput.setCustomValidity('Invalid date.');
    }
    if (
      endInput &&
      challenge.endDatetime &&
      !isValidYearValue(challenge.endDatetime)
    ) {
      endInput.setCustomValidity('Invalid date.');
    }
    const minEndDate = buildMinimumEndDate(challenge);
    if (endInput && challenge.endDatetime && minEndDate) {
      const endDate = new Date(challenge.endDatetime);
      if (Number.isNaN(endDate.getTime()) || endDate < minEndDate) {
        endInput.setCustomValidity(
          'End date/time must cover the coding and peer review durations.'
        );
      }
    }

    const isValid = form?.checkValidity ? form.checkValidity() : true;
    if (!isValid) {
      form?.reportValidity?.();
      return;
    }
    if (!challenge.matchSettingIds || challenge.matchSettingIds.length === 0) {
      setError('Select at least one match setting');
      return;
    }
    const durationValue = parsePositiveInt(challenge.duration) ?? 0;
    const durationPeerReviewValue =
      parsePositiveInt(challenge.durationPeerReview) ?? 0;
    const allowedNumberValue =
      parsePositiveInt(challenge.allowedNumberOfReview) ?? 0;
    setIsSubmitting(true);
    const payload = {
      ...challenge,
      title: trimmedTitle,
      duration: durationValue,
      durationPeerReview: durationPeerReviewValue,
      allowedNumberOfReview: allowedNumberValue,
      startDatetime: toISODateTime(challenge.startDatetime),
      endDatetime: toISODateTime(challenge.endDatetime),
    };

    try {
      const result = await updateChallenge(challengeId, payload);
      if (result?.success) {
        setSuccessMessage('Challenge updated successfully! Redirecting...');
        setTimeout(() => {
          router.push(`/challenges/${challengeId}`);
        }, 2000);
        return;
      }
      const { message, code } = parseUpdateError(result);
      if (code === 'challenge_overlap') {
        setOverlapPayload(payload);
        setOverlapDialogOpen(true);
        setIsSubmitting(false);
        return;
      }
      setError(message);
      setIsSubmitting(false);
    } catch (err) {
      setError(`Error: ${err.message}`);
      setIsSubmitting(false);
    }
  };

  const handleOverlapConfirm = async () => {
    if (!overlapPayload) return;
    setOverlapDialogOpen(false);
    setIsSubmitting(true);
    setError(null);
    try {
      const overridePayload = {
        ...overlapPayload,
        status: Constants.ChallengeStatus.PRIVATE,
        allowOverlap: true,
      };
      const overrideResult = await updateChallenge(
        challengeId,
        overridePayload
      );
      if (overrideResult?.success) {
        setChallenge((prev) => ({
          ...prev,
          status: Constants.ChallengeStatus.PRIVATE,
        }));
        setSuccessMessage(
          'Challenge saved as private because it overlaps another challenge. Redirecting...'
        );
        setTimeout(() => {
          router.push(`/challenges/${challengeId}`);
        }, 2000);
        return;
      }
      const overrideError = parseUpdateError(overrideResult);
      setError(overrideError.message);
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
      setOverlapPayload(null);
    }
  };

  const handleOverlapCancel = () => {
    setOverlapDialogOpen(false);
    setOverlapPayload(null);
    setError('Challenge update cancelled.');
  };

  const durationValue = parsePositiveInt(challenge.duration);
  const durationPeerReviewValue = parsePositiveInt(
    challenge.durationPeerReview
  );
  const canPickEndDate =
    Boolean(challenge.startDatetime) &&
    Number.isInteger(durationValue) &&
    durationValue >= 2 &&
    Number.isInteger(durationPeerReviewValue) &&
    durationPeerReviewValue >= 2;

  const getMinDateTimeValue = () => {
    const now = new Date();
    now.setSeconds(0, 0);
    return formatDateTimeLocal(now);
  };

  const getMinEndDateValue = () => {
    const minEndDate = buildMinimumEndDate(challenge);
    if (!minEndDate) return getMinDateTimeValue();
    return formatDateTimeLocal(minEndDate);
  };

  const formDisabled =
    loadingChallenge || initialStatus !== Constants.ChallengeStatus.PRIVATE;

  if (!isAuthorized) return null;

  if (loadingChallenge) {
    return (
      <div className={styles.main}>
        <div className={styles.card}>
          <Spinner label='Loading challenge details...' />
        </div>
      </div>
    );
  }

  return (
    <main role='main' className={styles.main} aria-labelledby='page-title'>
      <div className={styles.header}>
        <h1 id='page-title'>Edit Challenge</h1>
        <p>Update the challenge details below.</p>
      </div>
      <form
        data-testid='challenge-form'
        onSubmit={handleSubmit}
        className={styles.card}
      >
        <div className={styles.field}>
          <label htmlFor='title'>
            Challenge Name
            <input
              id='title'
              type='text'
              value={challenge.title}
              onChange={handleDataField}
              name='title'
              className={styles.input}
              required
              disabled={formDisabled}
            />
          </label>
        </div>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor='startDatetime'>
              Start Date/Time
              <div className={styles.datetimeGroup}>
                <input
                  id='startDatetime'
                  type='text'
                  name='startDatetime'
                  value={challenge.startDatetimeInput}
                  onChange={handleDataField}
                  onBlur={() => handleDateBlur('startDatetime')}
                  className={styles.datetime}
                  placeholder='8:32 PM, 30/12/2026'
                  pattern={DATE_TIME_PATTERN}
                  title='Use format: 8:32 PM, 30/12/2026'
                  required
                  disabled={formDisabled}
                />
                <button
                  type='button'
                  className={styles.datetimeButton}
                  onClick={() => openPicker(startPickerRef)}
                  aria-label='Pick start date and time'
                  disabled={formDisabled}
                >
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    className={styles.datetimeIcon}
                  >
                    <path
                      fill='currentColor'
                      d='M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v13A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-13A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1zm12.5 6H4.5v11.5c0 .3.2.5.5.5h15a.5.5 0 0 0 .5-.5V8zM4.5 6a.5.5 0 0 0-.5.5V7h16v-.5a.5.5 0 0 0-.5-.5H4.5z'
                    />
                  </svg>
                </button>
                <input
                  ref={startPickerRef}
                  type='datetime-local'
                  className={styles.datetimePicker}
                  value={resolvePickerValue(challenge.startDatetime)}
                  onChange={handleDatePickerChange('startDatetime')}
                  min={getMinDateTimeValue()}
                  tabIndex={-1}
                  aria-hidden='true'
                  disabled={formDisabled}
                />
              </div>
            </label>
          </div>
          <div className={styles.field}>
            <label htmlFor='endDatetime'>
              End Date/Time
              <div className={styles.datetimeGroup}>
                <input
                  id='endDatetime'
                  type='text'
                  name='endDatetime'
                  value={challenge.endDatetimeInput}
                  onChange={handleDataField}
                  onBlur={() => handleDateBlur('endDatetime')}
                  className={styles.datetime}
                  placeholder='8:32 PM, 30/12/2026'
                  pattern={DATE_TIME_PATTERN}
                  title='Use format: 8:32 PM, 30/12/2026'
                  required
                  disabled={formDisabled || !canPickEndDate}
                />
                <button
                  type='button'
                  className={styles.datetimeButton}
                  onClick={() => openPicker(endPickerRef)}
                  aria-label='Pick end date and time'
                  disabled={formDisabled || !canPickEndDate}
                >
                  <svg
                    aria-hidden='true'
                    viewBox='0 0 24 24'
                    className={styles.datetimeIcon}
                  >
                    <path
                      fill='currentColor'
                      d='M7 2a1 1 0 0 1 1 1v1h8V3a1 1 0 1 1 2 0v1h1.5A2.5 2.5 0 0 1 22 6.5v13A2.5 2.5 0 0 1 19.5 22h-15A2.5 2.5 0 0 1 2 19.5v-13A2.5 2.5 0 0 1 4.5 4H6V3a1 1 0 0 1 1-1zm12.5 6H4.5v11.5c0 .3.2.5.5.5h15a.5.5 0 0 0 .5-.5V8zM4.5 6a.5.5 0 0 0-.5.5V7h16v-.5a.5.5 0 0 0-.5-.5H4.5z'
                    />
                  </svg>
                </button>
                <input
                  ref={endPickerRef}
                  type='datetime-local'
                  className={styles.datetimePicker}
                  value={resolvePickerValue(challenge.endDatetime)}
                  onChange={handleDatePickerChange('endDatetime')}
                  min={getMinEndDateValue()}
                  tabIndex={-1}
                  aria-hidden='true'
                  disabled={formDisabled || !canPickEndDate}
                />
              </div>
            </label>
          </div>
        </div>
        <div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='duration'>
                Coding Phase Duration (min)
                <input
                  id='duration'
                  type='number'
                  name='duration'
                  value={challenge.duration}
                  onChange={handleDataField}
                  className={styles.number}
                  min={2}
                  required
                  disabled={formDisabled}
                />
              </label>
            </div>
            <div className={styles.field}>
              <label htmlFor='durationPeerReview'>
                Duration Peer Review Duration (min)
                <input
                  id='durationPeerReview'
                  type='number'
                  name='durationPeerReview'
                  value={challenge.durationPeerReview}
                  onChange={handleDataField}
                  className={styles.number}
                  min={2}
                  required
                  disabled={formDisabled}
                />
              </label>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='allowedNumberOfReview'>
                Expected Reviews per Submission
                <input
                  id='allowedNumberOfReview'
                  type='number'
                  name='allowedNumberOfReview'
                  value={challenge.allowedNumberOfReview}
                  onChange={handleDataField}
                  className={`${styles.number} ${styles.expectedReviewInput}`}
                  min={2}
                  required
                  disabled={formDisabled}
                />
              </label>
            </div>
          </div>
        </div>
        <div className={styles.field}>
          <span>Status</span>
          <ToggleSwitch
            checked={challenge.status === Constants.ChallengeStatus.PUBLIC}
            label={
              challenge.status === Constants.ChallengeStatus.PUBLIC
                ? 'Public'
                : 'Private'
            }
            onChange={() =>
              setChallenge((prev) => ({
                ...prev,
                status:
                  prev.status === Constants.ChallengeStatus.PUBLIC
                    ? Constants.ChallengeStatus.PRIVATE
                    : Constants.ChallengeStatus.PUBLIC,
              }))
            }
            disabled={formDisabled}
          />
        </div>
        <div className={styles.field}>
          <strong>
            Selected Match Settings: {challenge?.matchSettingIds?.length}
          </strong>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>Select</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((match) => {
              const isSelected = challenge.matchSettingIds.includes(match.id);
              const handleRowToggle = () => toggleSetting(match.id);
              const handleRowKeyDown = (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  handleRowToggle();
                }
              };

              return (
                <tr
                  key={match.id}
                  role='button'
                  tabIndex={0}
                  onClick={handleRowToggle}
                  onKeyDown={handleRowKeyDown}
                >
                  <td style={{ textAlign: 'center' }}>
                    <input
                      aria-label='select setting'
                      type='checkbox'
                      checked={isSelected}
                      onChange={handleRowToggle}
                      onClick={(event) => event.stopPropagation()}
                      disabled={formDisabled}
                    />
                  </td>
                  <td style={{ textAlign: 'center' }}>{match.problemTitle}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <div className={styles.submitWrapper}>
          <div className={styles.feedback} aria-live='polite'>
            {error && (
              <span className={styles.feedbackError} role='alert'>
                {error}
              </span>
            )}
            {!error && successMessage && (
              <span className={styles.feedbackSuccess} role='status'>
                {successMessage}
              </span>
            )}
          </div>
          <Button
            data-testid='update-challenge-button'
            type='submit'
            disabled={isSubmitting || formDisabled}
            aria-busy={isSubmitting}
            name='submit'
            title='Update this challenge'
          >
            {isSubmitting && <span className={styles.spinner} aria-hidden />}
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </div>
      </form>
      <AlertDialog
        open={overlapDialogOpen}
        title='Overlap detected'
        description='This challenge overlaps with an existing one. Save it anyway? It will remain private.'
        confirmLabel='Save as private'
        cancelLabel='Cancel'
        confirmVariant='primary'
        cancelVariant='outline'
        confirmDisabled={isSubmitting}
        cancelDisabled={isSubmitting}
        onConfirm={handleOverlapConfirm}
        onCancel={handleOverlapCancel}
      />
    </main>
  );
}
