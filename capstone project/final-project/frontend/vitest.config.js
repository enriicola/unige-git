import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    IS_REACT_ACT_ENVIRONMENT: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.globals.js', './vitest.setup.js'],
    pool: 'forks',
    maxThreads: 1,
    minThreads: 1,
    isolate: true,
    sequence: {
      concurrent: false,
    },
    watch: false,
  },
});
