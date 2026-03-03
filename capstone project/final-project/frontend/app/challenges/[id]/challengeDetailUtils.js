'use client';

import { ChallengeStatus } from '#js/constants';

export const isEndedChallengeStatus = (status) =>
  status === ChallengeStatus.ENDED_PHASE_ONE ||
  status === ChallengeStatus.ENDED_PHASE_TWO;

export const normalizeMultilineValue = (value) =>
  typeof value === 'string' ? value.replace(/\\n/g, '\n') : value;

export const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'string') return normalizeMultilineValue(value);
  try {
    return normalizeMultilineValue(JSON.stringify(value));
  } catch {
    return normalizeMultilineValue(String(value));
  }
};

export const buildResultBadge = (count, tone) => {
  const base =
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold';
  if (tone === 'success') {
    return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200`;
  }
  if (tone === 'danger') {
    return `${base} bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-200`;
  }
  return `${base} bg-muted text-muted-foreground`;
};

export const getResultCardClasses = (passed) =>
  passed
    ? 'border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/40 dark:bg-emerald-500/10'
    : 'border-rose-200 bg-rose-50/70 dark:border-rose-400/40 dark:bg-rose-500/10';

export const getResultStatusClasses = (passed) =>
  passed
    ? 'text-emerald-700 bg-emerald-100 dark:text-emerald-200 dark:bg-emerald-500/15'
    : 'text-rose-700 bg-rose-100 dark:text-rose-200 dark:bg-rose-500/15';

export const parseJsonValue = (value) => {
  if (value === null || value === undefined) return { ok: false, value: null };
  if (typeof value !== 'string') return { ok: true, value };
  try {
    return { ok: true, value: JSON.parse(value) };
  } catch {
    return { ok: false, value: null };
  }
};

export const getTestFailureDetails = (result) => {
  if (!result || result.passed) return null;
  if (result.error) return result.error;
  if (result.stderr) return result.stderr;
  if (typeof result.exitCode === 'number' && result.exitCode !== 0) {
    return `Execution failed with exit code ${result.exitCode}.`;
  }
  return 'Output did not match the expected result.';
};

export const buildTestKey = (result) => {
  if (Number.isInteger(result?.testIndex)) {
    return `test-${result.testIndex}`;
  }
  return JSON.stringify({
    expectedOutput: result?.expectedOutput,
    actualOutput: result?.actualOutput,
    passed: result?.passed,
  });
};

export const formatTimer = (seconds) => {
  if (seconds == null) return '—';
  const safeSeconds = Math.max(0, seconds);
  const hours = String(Math.floor(safeSeconds / 3600)).padStart(2, '0');
  const mins = String(Math.floor((safeSeconds % 3600) / 60)).padStart(2, '0');
  const secs = String(safeSeconds % 60).padStart(2, '0');
  return `${hours}:${mins}:${secs}`;
};

export const COUNTDOWN_BUFFER_MS = 5000;

export const getPhaseEndMs = (
  startValue,
  durationMinutes,
  explicitEndValue
) => {
  if (explicitEndValue) {
    const explicitEnd = new Date(explicitEndValue).getTime();
    return Number.isNaN(explicitEnd) ? null : explicitEnd;
  }
  if (!startValue || !durationMinutes) return null;
  const startMs = new Date(startValue).getTime();
  if (Number.isNaN(startMs)) return null;
  return startMs + durationMinutes * 60 * 1000 + COUNTDOWN_BUFFER_MS;
};

export const resolveEndDisplay = (explicitEndValue, computedEndMs) => {
  if (explicitEndValue) return explicitEndValue;
  if (computedEndMs) return new Date(computedEndMs);
  return null;
};

export const getBufferedStartMs = (value) => {
  if (!value) return null;
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return null;
  return timestamp + COUNTDOWN_BUFFER_MS;
};

const normalizeNameValue = (value) =>
  typeof value === 'string' ? value.trim() : '';

const titleizeValue = (value) => {
  const normalized = normalizeNameValue(value);
  if (!normalized) return '';
  const base = normalized.split('@')[0];
  const cleaned = base.replace(/[_\-.]+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned
    .split(/\s+/)
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ''))
    .join(' ');
};

export function buildStudentName(student, fallbackId) {
  const directFirst = normalizeNameValue(student?.firstName);
  const directLast = normalizeNameValue(student?.lastName);
  if (directFirst || directLast) {
    return `${directFirst} ${directLast}`.trim();
  }

  const settings = student?.settings || {};
  const settingsFirst = normalizeNameValue(
    settings.firstName || settings.first_name || settings.givenName
  );
  const settingsLast = normalizeNameValue(
    settings.lastName || settings.last_name || settings.surname
  );
  if (settingsFirst || settingsLast) {
    return `${settingsFirst} ${settingsLast}`.trim();
  }

  const settingsFull = normalizeNameValue(
    settings.fullName || settings.full_name || settings.name
  );
  if (settingsFull) return settingsFull;

  const username = titleizeValue(student?.username);
  if (username) return username;

  const email = titleizeValue(student?.email);
  if (email) return email;

  if (Number.isInteger(fallbackId)) {
    return `Student ${fallbackId}`;
  }

  return 'Student';
}

export const normalizeSubmissionStatus = (status) => {
  if (typeof status !== 'string') return '';
  return status.toLowerCase();
};

export const getExpectedEvaluationFromSubmissionStatus = (status) => {
  const normalizedStatus = normalizeSubmissionStatus(status);
  if (normalizedStatus === 'probably_correct') return 'correct';
  if (normalizedStatus === 'improvable' || normalizedStatus === 'wrong') {
    return 'incorrect';
  }
  return 'unknown';
};

export const getEarnedCreditFromVote = (voteRecord, submissionStatus) => {
  if (!voteRecord) return false;

  const voteType = voteRecord.vote;
  const normalizedStatus = normalizeSubmissionStatus(submissionStatus);
  const isSubmissionValid = normalizedStatus === 'probably_correct';

  if (voteType === 'correct') {
    if (typeof voteRecord.isVoteCorrect === 'boolean') {
      return voteRecord.isVoteCorrect;
    }
    return isSubmissionValid;
  }

  if (voteType === 'incorrect') {
    let baseCorrect = false;
    if (typeof voteRecord.isVoteCorrect === 'boolean') {
      baseCorrect = voteRecord.isVoteCorrect;
    } else if (normalizedStatus) {
      baseCorrect = !isSubmissionValid;
    }

    if (typeof voteRecord.isExpectedOutputCorrect === 'boolean') {
      return baseCorrect && voteRecord.isExpectedOutputCorrect;
    }
    if (typeof voteRecord.isBugProven === 'boolean') {
      return baseCorrect && voteRecord.isBugProven;
    }
    return baseCorrect;
  }

  return false;
};
