import { NETWORK_RESPONSE_NOT_OK } from '#js/constants';

export const DEFAULT_IMPORTS = '#include <iostream>';
const IMPORTS_END_MARKER = '// __CODYMATCH_IMPORTS_END__';
const DEFAULT_PREFIX = `using namespace std;

int main() {
`;
const DEFAULT_SUFFIX = `
    return 0;
}
`;

const IMPORT_MARKERS = [
  '/* IMPORTS */',
  '// IMPORTS',
  '//IMPORTS',
  '{{IMPORTS}}',
];
const STUDENT_MARKERS = [
  '/* STUDENT_CODE */',
  '// STUDENT_CODE',
  '//STUDENT_CODE',
  '// TODO',
  '//TODO',
  '/* TODO */',
  '{{STUDENT_CODE}}',
];

export const MESSAGE_PHASE1_NO_SUBMISSION_INVALID =
  'You did not submit any code. We checked your draft, but it did not pass the public tests, so your submission is not valid.';
export const MESSAGE_PHASE1_NO_SUBMISSION_VALID =
  'You did not submit any code. Your draft passed the public tests, so your submission is valid.';
export const MESSAGE_PHASE1_SUBMITTED = 'You submitted your code.';
export const MESSAGE_PHASE1_SUBMITTED_AUTO_BETTER =
  'You submitted your code. However, your latest version is better, so we kept this latest version automatically.';
export const MESSAGE_SUBMISSION_SUCCESS = 'Thanks for your submission.';
export const MESSAGE_SUBMISSION_PUBLIC_FAIL =
  'Thanks for your submission. There are problems with your solution, try to improve it.';
export const MESSAGE_SUBMISSION_PRIVATE_FAIL =
  'Thanks for your submission. You passed all public test cases, but you missed some edge cases. Read the problem again and try to improve your code.';
export const MESSAGE_PEER_REVIEW_PENDING =
  "Wait for the peer review phase to start so you can review your classmates' code.";
export const MESSAGE_FINALIZING_SUBMISSION =
  'The coding phase has ended. We are finalizing your submission. Please wait.';

export const DRAFT_SAVE_DELAY_MS = 600;
export const FINALIZATION_POLL_DELAY_MS = 1500;

export const createCustomTestId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `custom-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const stripMarkers = (code, markers) =>
  markers.reduce((value, marker) => value.split(marker).join(''), code);

const extractImports = (code) => {
  const lines = code.split('\n');
  const importLines = [];
  const restLines = [];
  lines.forEach((line) => {
    if (/^\s*#include\b/.test(line)) {
      importLines.push(line);
    } else {
      restLines.push(line);
    }
  });
  return {
    imports: importLines.join('\n'),
    code: restLines.join('\n'),
  };
};

const splitAtMarker = (code, markers) => {
  const marker = markers.find((candidate) => code.includes(candidate));
  if (!marker) return null;
  const [before, after] = code.split(marker);
  return { before, after };
};

const splitAtReturn = (code) => {
  const marker = 'return 0;';
  const index = code.indexOf(marker);
  if (index === -1) return null;
  return {
    before: code.slice(0, index),
    after: code.slice(index),
  };
};

export const buildTemplateParts = (starterCode) => {
  if (!starterCode || !starterCode.trim()) {
    return {
      imports: DEFAULT_IMPORTS,
      fixedPrefix: DEFAULT_PREFIX,
      fixedSuffix: DEFAULT_SUFFIX,
    };
  }

  let working = stripMarkers(starterCode, IMPORT_MARKERS);
  const extracted = extractImports(working);
  const imports = extracted.imports.trim()
    ? extracted.imports
    : DEFAULT_IMPORTS;
  working = extracted.code;

  let split = splitAtMarker(working, STUDENT_MARKERS);
  if (!split) {
    split = splitAtReturn(working);
  }
  if (!split) {
    return {
      imports,
      fixedPrefix: working,
      fixedSuffix: '',
    };
  }
  return {
    imports,
    fixedPrefix: split.before,
    fixedSuffix: split.after,
  };
};

export const analyzeImports = (value) => {
  const rawValue = typeof value === 'string' ? value : '';
  const lines = rawValue.split('\n');
  const sanitizedLines = [];
  const invalidLines = [];
  lines.forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) {
      sanitizedLines.push(line);
      return;
    }
    if (/^\s*#include\b/.test(line)) {
      sanitizedLines.push(line);
      return;
    }
    invalidLines.push(line);
  });
  return {
    sanitized: sanitizedLines.join('\n'),
    invalidLines,
  };
};

export const assembleCode = (
  imports,
  fixedPrefix,
  studentCode,
  fixedSuffix
) => {
  const trimmedImports = imports && imports.trim();
  let importBlock = '';
  if (trimmedImports) {
    importBlock = `${trimmedImports}\n${IMPORTS_END_MARKER}\n\n`;
  }
  const prefix = fixedPrefix || '';
  const student = studentCode || '';
  const suffix = fixedSuffix || '';
  return `${importBlock}${prefix}${student}${suffix}`;
};

export const normalizeCode = (value) =>
  typeof value === 'string' ? value.trim() : '';

export const normalizeSnapshot = (value) => {
  if (!value) return null;
  if (typeof value === 'string') {
    return { imports: '', studentCode: value };
  }
  return {
    imports: value.imports || '',
    studentCode: value.studentCode || '',
  };
};

const IMPORTS_VALIDATION_MESSAGE =
  'Only #include lines are allowed in the imports section.';
const IMPORTS_USER_MESSAGE =
  'Imports can only contain #include lines. Remove any other statements.';

const parseNetworkErrorMessage = (value) => {
  if (typeof value !== 'string' || !value.trim()) return null;
  if (!value.startsWith(NETWORK_RESPONSE_NOT_OK)) return value;

  const raw = value.slice(NETWORK_RESPONSE_NOT_OK.length);
  try {
    const parsed = JSON.parse(raw);
    const parsedMessage =
      parsed?.error?.message ||
      parsed?.message ||
      parsed?.error?.errors?.[0]?.message;
    if (typeof parsedMessage === 'string' && parsedMessage.trim()) {
      return parsedMessage;
    }
  } catch {
    return null;
  }

  return null;
};

const parseApiErrorMessage = (result) => {
  if (!result) return null;
  if (typeof result === 'string') return parseNetworkErrorMessage(result);

  const directError = result?.error?.message;
  const parsedDirect = parseNetworkErrorMessage(directError);
  if (typeof parsedDirect === 'string' && parsedDirect.trim()) {
    return parsedDirect;
  }

  if (result?.error instanceof Error && result.error.message) {
    return parseNetworkErrorMessage(result.error.message);
  }

  const message = result?.message;
  return parseNetworkErrorMessage(message);
};

export const getUserFacingErrorMessage = (result, fallback) => {
  const parsed = parseApiErrorMessage(result);
  if (!parsed) return fallback;
  if (parsed === IMPORTS_VALIDATION_MESSAGE) return IMPORTS_USER_MESSAGE;
  if (parsed.includes(IMPORTS_VALIDATION_MESSAGE)) {
    return IMPORTS_USER_MESSAGE;
  }
  return parsed;
};

export const resolveCodingPhaseMessage = (summary) => {
  if (!summary) return MESSAGE_PHASE1_NO_SUBMISSION_INVALID;

  const hasManual = summary?.hasManualSubmission;
  const hasAutomatic = summary?.hasAutomaticSubmission;
  const automaticValid =
    summary?.automaticStatus && summary.automaticStatus !== 'wrong';

  if (!hasManual) {
    if (hasAutomatic && automaticValid) {
      return MESSAGE_PHASE1_NO_SUBMISSION_VALID;
    }
    return MESSAGE_PHASE1_NO_SUBMISSION_INVALID;
  }

  if (summary?.finalIsAutomatic) {
    return MESSAGE_PHASE1_SUBMITTED_AUTO_BETTER;
  }

  return MESSAGE_PHASE1_SUBMITTED;
};
