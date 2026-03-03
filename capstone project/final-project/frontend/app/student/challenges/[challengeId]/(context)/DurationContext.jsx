'use client';

import { createContext, useContext } from 'react';

const DurationContext = createContext(null);

export function DurationProvider({ value, children }) {
  return (
    <DurationContext.Provider value={value}>
      {children}
    </DurationContext.Provider>
  );
}

export function useDuration() {
  return useContext(DurationContext);
}
