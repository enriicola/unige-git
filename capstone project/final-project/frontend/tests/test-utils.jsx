import { render } from '@testing-library/react';
import TestReduxProvider from './test-redux-provider';

export const renderWithProviders = (ui, { preloadedState } = {}) =>
  render(
    <TestReduxProvider preloadedState={preloadedState}>{ui}</TestReduxProvider>
  );
