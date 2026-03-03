import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['tests/**/*.test.js'],
    setupFiles: ['./vitest.setup.js'],
    bail: 1,
    coverage: {
      reporter: ['text', 'lcov'],
      include: ['**/*.mjs', '**/*.js'],
    },
    alias: {
      '#root': new URL('./', import.meta.url).pathname,
    },
    threads: false,
    fileParallelism: false,
    isolate: true,
    sequence: { concurrent: false },
  },
});
