import { afterAll, afterEach } from 'vitest';

const originalConsoleError = console.error;
let consoleErrorCalls = [];

const formatConsoleArg = (arg) => {
  if (arg instanceof Error) return arg.stack || arg.message;
  if (typeof arg === 'string') return arg;
  if (arg === null) return 'null';
  if (arg === undefined) return 'undefined';

  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
};

// Fail tests on unexpected console.error calls.
// We avoid vi.spyOn here because many tests call vi.resetAllMocks(),
// which would reset spies and make this check unreliable.
console.error = (...args) => {
  consoleErrorCalls.push(args);
};

afterEach(() => {
  if (consoleErrorCalls.length === 0) return;

  const details = consoleErrorCalls
    .map((args) => args.map(formatConsoleArg).join(' '))
    .join('\n');

  consoleErrorCalls = [];
  throw new Error(`Unexpected console.error call(s):\n${details}`);
});

afterAll(() => {
  console.error = originalConsoleError;
});
