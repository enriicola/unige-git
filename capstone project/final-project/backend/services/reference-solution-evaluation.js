import { runCode } from '#root/services/code-runner.js';

const JS_STDIN_REGEX =
  /process\.stdin|readFileSync\(0|fs\.readFileSync|require\(['"]fs['"]\)/;

function detectLanguage(referenceSolution) {
  const code = referenceSolution || '';

  if (
    /#include\s+</.test(code) ||
    /\bint\s+main\s*\(/.test(code) ||
    /\busing\s+namespace\s+std\b/.test(code)
  ) {
    return 'cpp';
  }

  if (
    /\bdef\s+\w+\s*\(/.test(code) ||
    /\bprint\s*\(/.test(code) ||
    /\bimport\s+\w+/.test(code)
  ) {
    return 'python';
  }

  if (/\bpublic\s+class\s+\w+/.test(code)) {
    return 'java';
  }

  return 'javascript';
}

function shouldWrapJavascriptReference(referenceSolution) {
  return !JS_STDIN_REGEX.test(referenceSolution || '');
}

function buildJavascriptReferenceRunner(referenceSolution) {
  const match = referenceSolution.match(/function\s+([A-Za-z0-9_$]+)/);
  const fallbackName = match ? match[1] : null;
  const fallbackLine = fallbackName
    ? `const __fallbackFn = ${fallbackName};`
    : 'const __fallbackFn = null;';

  return `
const fs = require('fs');

const inputRaw = fs.readFileSync(0, 'utf8').trim();
const input = inputRaw ? JSON.parse(inputRaw) : null;

${referenceSolution}

${fallbackLine}

function __resolveFn() {
  if (typeof solve === 'function') return { fn: solve, mode: 'single' };
  if (typeof solution === 'function') return { fn: solution, mode: 'single' };
  if (__fallbackFn) return { fn: __fallbackFn, mode: 'spread' };
  return { fn: null, mode: 'none' };
}

function __run() {
  const resolved = __resolveFn();
  if (!resolved.fn) {
    throw new Error('No callable function found in reference solution');
  }
  if (resolved.mode === 'single') {
    return resolved.fn(input);
  }
  if (Array.isArray(input)) {
    return resolved.fn(...input);
  }
  return resolved.fn(input);
}

const result = __run();
process.stdout.write(JSON.stringify(result));
`;
}

function parseJsonInput(testCaseInput) {
  try {
    return JSON.parse(testCaseInput);
  } catch {
    return null;
  }
}

function formatReferenceOutput(actualOutput) {
  if (actualOutput === null || actualOutput === undefined) {
    return null;
  }
  if (typeof actualOutput === 'string') {
    return actualOutput;
  }
  try {
    return JSON.stringify(actualOutput);
  } catch {
    return String(actualOutput);
  }
}

function normalizeRunnerOutput(output) {
  if (output === null || output === undefined) {
    return null;
  }

  if (typeof output === 'string') {
    const trimmed = output.trim();
    if (!trimmed) return '';
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return output;
}

export function normalizeOutputForComparison(value) {
  if (value === null || value === undefined) return null;

  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value));
    } catch {
      return value.trim();
    }
  }

  return JSON.stringify(value);
}

export async function runReferenceSolution({
  referenceSolution,
  testCaseInput,
}) {
  const parsedInput = parseJsonInput(testCaseInput);
  if (parsedInput === null) {
    const error = new Error('Invalid test case input JSON');
    error.code = 'INVALID_TEST_INPUT';
    throw error;
  }

  const language = detectLanguage(referenceSolution);
  const code =
    language === 'javascript' &&
    shouldWrapJavascriptReference(referenceSolution)
      ? buildJavascriptReferenceRunner(referenceSolution)
      : referenceSolution;

  const inputPayload = JSON.stringify(parsedInput);
  const runResult = await runCode(code, language, inputPayload);
  const normalizedActual = normalizeRunnerOutput(runResult?.stdout);
  const referenceOutput = formatReferenceOutput(normalizedActual);

  return {
    referenceOutput,
    language,
    testResult: {
      exitCode: runResult?.exitCode ?? 0,
      stdout: runResult?.stdout ?? '',
      stderr: runResult?.stderr ?? '',
      actualOutput: normalizedActual,
    },
  };
}
