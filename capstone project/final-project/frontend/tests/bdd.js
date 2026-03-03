import { act } from '@testing-library/react';

async function runStep(step) {
  let result;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  if (typeof window !== 'undefined') window.IS_REACT_ACT_ENVIRONMENT = true;
  await act(async () => {
    result = await step();
  });
  return result;
}

export function given(step) {
  return runStep(step);
}

export function when(step) {
  return runStep(step);
}

export function andThen(step) {
  return runStep(step);
}
