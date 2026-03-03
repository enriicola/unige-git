import { formatDateTime } from '#js/date';

const parsePositiveInt = (value) => {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number.parseInt(trimmed, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const isValidYearValue = (value) => {
  if (typeof value !== 'string') return false;
  return /^20\d{2}-/.test(value);
};

const resolvePickerValue = (value) => {
  if (!value) return '';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return '';
  return value;
};

const isDateTimeInputWithinLimits = (value) => {
  if (typeof value !== 'string') return true;
  if (!value) return true;
  const matches = [...value.matchAll(/\d+/g)];
  return matches.every((match) => {
    const digits = match[0];
    const startIndex = match.index ?? 0;
    const endIndex = startIndex + digits.length;
    const prevChar = value[startIndex - 1];
    const nextChar = value[endIndex];
    let maxLength = 2;

    if (nextChar === ':') {
      maxLength = 2;
    } else if (prevChar === ':') {
      maxLength = 2;
    } else if (nextChar === '/') {
      maxLength = 2;
    } else if (prevChar === '/') {
      maxLength = nextChar === '/' ? 2 : 4;
    }

    return digits.length <= maxLength;
  });
};

const DATE_TIME_PATTERN =
  '^\\d{1,2}:\\d{2}\\s*(AM|PM),\\s*\\d{2}/\\d{2}/\\d{4}$';

const isPreferredDateTimeFormat = (value) => {
  if (typeof value !== 'string') return false;
  const trimmed = value.trim();
  if (!trimmed) return false;
  return new RegExp(DATE_TIME_PATTERN, 'i').test(trimmed);
};

const normalizeDateTimeInput = (value) => {
  if (typeof value !== 'string') return value;
  const trimmed = value.trim();
  if (!trimmed) return value;

  const timeFirstMatch = trimmed.match(
    /^(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])\s*,\s*(\d{1,2})\/(\d{1,2})\/(\d{4,})$/
  );
  if (timeFirstMatch) {
    const [, hourRaw, minuteRaw, meridianRaw, dayRaw, monthRaw, yearRaw] =
      timeFirstMatch;
    const year = yearRaw.slice(0, 4);
    const month = Number.parseInt(monthRaw, 10);
    const day = Number.parseInt(dayRaw, 10);

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      let hour = hourRaw ? Number.parseInt(hourRaw, 10) : 0;
      const minute = minuteRaw ? Number.parseInt(minuteRaw, 10) : 0;
      const meridian = meridianRaw?.toUpperCase();
      if (meridian === 'PM' && hour < 12) hour += 12;
      if (meridian === 'AM' && hour === 12) hour = 0;
      const pad = (num) => String(num).padStart(2, '0');
      return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
    }
  }

  const slashMatch = trimmed.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4,})(?:,\s*(\d{1,2})(?::(\d{2}))?\s*([AaPp][Mm])?)?$/
  );
  if (slashMatch) {
    const [, part1, part2, yearRaw, hourRaw, minuteRaw, meridianRaw] =
      slashMatch;
    const year = yearRaw.slice(0, 4);
    let month = Number.parseInt(part1, 10);
    let day = Number.parseInt(part2, 10);

    if (month > 12 && day <= 12) {
      const swap = day;
      day = month;
      month = swap;
    }

    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      let hour = hourRaw ? Number.parseInt(hourRaw, 10) : 0;
      const minute = minuteRaw ? Number.parseInt(minuteRaw, 10) : 0;
      const meridian = meridianRaw?.toUpperCase();
      if (meridian === 'PM' && hour < 12) hour += 12;
      if (meridian === 'AM' && hour === 12) hour = 0;
      const pad = (num) => String(num).padStart(2, '0');
      return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`;
    }
  }

  const yearMatch = trimmed.match(/^(\d{4,})(.*)$/);
  if (yearMatch && yearMatch[1].length > 4) {
    return `${yearMatch[1].slice(0, 4)}${yearMatch[2] || ''}`;
  }

  return value;
};

const resolveDateTimeInputValue = (rawValue) => {
  const normalized = normalizeDateTimeInput(rawValue);
  const parsed = new Date(normalized);
  if (Number.isNaN(parsed.getTime())) {
    return { normalized, inputValue: rawValue };
  }
  const inputValue = isPreferredDateTimeFormat(rawValue)
    ? rawValue
    : formatDateTime(normalized);
  return { normalized, inputValue };
};

const buildMinimumEndDate = (draft) => {
  const { startDatetime, duration, durationPeerReview } = draft;
  const durationVal = parsePositiveInt(duration);
  const durationPeerReviewVal = parsePositiveInt(durationPeerReview);
  if (
    !startDatetime ||
    durationVal === null ||
    durationPeerReviewVal === null
  ) {
    return null;
  }
  const start = new Date(startDatetime);
  if (Number.isNaN(start.getTime())) return null;

  const durationMs = (durationVal || 0) * 60 * 1000;
  const durationPeerReviewMs = (durationPeerReviewVal || 0) * 60 * 1000;
  return new Date(start.getTime() + durationMs + durationPeerReviewMs);
};

const formatDateTimeLocal = (dateValue) => {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  const hours = String(dateValue.getHours()).padStart(2, '0');
  const minutes = String(dateValue.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const updateEndDateTime = (draft) => {
  const minEndDate = buildMinimumEndDate(draft);
  if (!minEndDate) return null;
  const normalizedEnd = formatDateTimeLocal(minEndDate);
  return {
    endDatetime: normalizedEnd,
    endDatetimeInput: formatDateTime(normalizedEnd),
  };
};

const buildDefaultDateTimes = ({
  durationMinutes = 30,
  peerReviewMinutes = 30,
} = {}) => {
  const now = new Date();
  now.setSeconds(0, 0);
  const safeDuration = Number.isFinite(durationMinutes) ? durationMinutes : 0;
  const safePeerReview = Number.isFinite(peerReviewMinutes)
    ? peerReviewMinutes
    : 0;
  const totalMinutes = safeDuration + safePeerReview;
  const endDate = new Date(now.getTime() + totalMinutes * 60 * 1000);
  const startIso = formatDateTimeLocal(now);
  const endIso = formatDateTimeLocal(endDate);
  return {
    startDatetime: startIso,
    startDatetimeInput: formatDateTime(startIso),
    endDatetime: endIso,
    endDatetimeInput: formatDateTime(endIso),
  };
};

export {
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
};
