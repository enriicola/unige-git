const COUNTDOWN_BUFFER_MS = 5000;

export const MESSAGE_PHASE1_NO_SUBMISSION_INVALID =
  'You did not submit any code. We checked your draft, but it did not pass the public tests, so your submission is not valid.';
export const MESSAGE_PHASE1_NO_SUBMISSION_VALID =
  'You did not submit any code. Your draft passed the public tests, so your submission is valid.';
export const MESSAGE_PHASE1_SUBMITTED = 'You submitted your code.';
export const MESSAGE_PHASE1_SUBMITTED_AUTO_BETTER =
  'You submitted your code. However, your latest version is better, so we kept this latest version automatically.';
export const MESSAGE_PEER_REVIEW_WAIT =
  "Wait for the peer review phase to start so you can review your classmates' code.";

export const buildTimeLeft = (startValue, durationMinutes, endValue) => {
  if (endValue) {
    const endMs = new Date(endValue).getTime();
    if (Number.isNaN(endMs)) return null;
    return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
  }
  if (!startValue || !durationMinutes) return null;
  const startMs = new Date(startValue).getTime();
  if (Number.isNaN(startMs)) return null;
  const endMs = startMs + durationMinutes * 60 * 1000 + COUNTDOWN_BUFFER_MS;
  return Math.max(0, Math.floor((endMs - Date.now()) / 1000));
};

export const formatCodeWithNewlines = (code) => {
  if (!code || typeof code !== 'string') return code;
  if (code.includes('\n')) return code;

  let formatted = code;
  formatted = formatted.replace(/(#include\s+<[^>]+>)/g, '$1\n');
  formatted = formatted.replace(/(\/\/[^\n]*)/g, '$1\n');
  formatted = formatted.replace(/(using\s+namespace\s+\w+;)/g, '$1\n\n');
  formatted = formatted.replace(/{/g, '{\n');
  formatted = formatted.replace(/}/g, '\n}\n');
  formatted = formatted.replace(/;(?!\s*{)/g, ';\n');
  formatted = formatted.replace(/\n\s*{/g, ' {');
  formatted = formatted.replace(/\n{3,}/g, '\n\n');

  const lines = formatted.split('\n');
  formatted = lines
    .map((line) => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      return trimmed;
    })
    .filter((line) => line.length > 0 || line === '')
    .join('\n');

  const result = [];
  let indentLevel = 0;
  const indentSize = 4;

  formatted.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
      return;
    }
    if (trimmed.startsWith('}')) {
      indentLevel = Math.max(0, indentLevel - 1);
    }
    result.push(' '.repeat(indentLevel * indentSize) + trimmed);
    if (trimmed.endsWith('{')) {
      indentLevel += 1;
    }
  });

  return result.join('\n');
};

export const resolveCodingPhaseMessage = (summary) => {
  if (!summary) return MESSAGE_PHASE1_NO_SUBMISSION_INVALID;
  const hasManual = summary?.hasManualSubmission;
  const hasAutomatic = summary?.hasAutomaticSubmission;
  const automaticValid =
    summary?.automaticStatus && summary.automaticStatus !== 'wrong';

  if (!hasManual) {
    return hasAutomatic && automaticValid
      ? MESSAGE_PHASE1_NO_SUBMISSION_VALID
      : MESSAGE_PHASE1_NO_SUBMISSION_INVALID;
  }

  return summary?.finalIsAutomatic
    ? MESSAGE_PHASE1_SUBMITTED_AUTO_BETTER
    : MESSAGE_PHASE1_SUBMITTED;
};
