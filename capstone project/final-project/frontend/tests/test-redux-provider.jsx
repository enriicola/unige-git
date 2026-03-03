import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { authReducer } from '#js/store/slices/auth';
import { uiReducer } from '#js/store/slices/ui';

export function getMockedStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
}

export default function TestReduxProvider({ children, preloadedState }) {
  const store = getMockedStore(preloadedState);
  return <Provider store={store}>{children}</Provider>;
}

export function getMockedStoreWrapper(preloadedState) {
  const store = getMockedStore(preloadedState);
  return function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  };
}
