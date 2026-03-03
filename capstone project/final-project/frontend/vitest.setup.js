/* eslint-disable import/no-extraneous-dependencies, no-console */
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
if (typeof window !== 'undefined') {
  window.IS_REACT_ACT_ENVIRONMENT = true;
}

const originalConsoleError = console.error;
console.error = (...args) => {
  const [firstArg] = args;
  if (
    typeof firstArg === 'string' &&
    firstArg.includes(
      'The current testing environment is not configured to support act(...)'
    )
  ) {
    return;
  }
  originalConsoleError(...args);
};

const createMockEventSource = () => {
  const listeners = new Map();
  return {
    addEventListener: vi.fn((type, cb) => {
      if (!listeners.has(type)) listeners.set(type, []);
      listeners.get(type).push(cb);
    }),
    removeEventListener: vi.fn((type, cb) => {
      const list = listeners.get(type);
      if (list) {
        const idx = list.indexOf(cb);
        if (idx !== -1) list.splice(idx, 1);
      }
    }),
    close: vi.fn(),
    // Helper to trigger events in tests
    emit: (type, data) => {
      const list = listeners.get(type);
      if (list) {
        list.forEach((cb) => cb(data));
      }
    },
  };
};

function MockEventSource() {
  return createMockEventSource();
}

globalThis.EventSource = MockEventSource;

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.useRealTimers();
});
