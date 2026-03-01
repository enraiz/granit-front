import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@granit/storage': path.resolve(__dirname, 'packages/@granit/storage/src/index.ts'),
      '@granit/logger': path.resolve(__dirname, 'packages/@granit/logger/src/index.ts'),
      '@granit/cookies': path.resolve(__dirname, 'packages/@granit/cookies/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['packages/@granit/*/src/**/*.test.ts', 'packages/@granit/*/src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'cobertura'],
      reportsDirectory: './coverage',
      include: ['packages/@granit/*/src/**/*.{ts,tsx}'],
      exclude: ['**/*.d.ts', '**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
    },
  },
});
