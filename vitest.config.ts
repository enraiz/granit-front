import path from 'node:path';

import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@granit/api-client/test-utils': path.resolve(
        __dirname,
        'packages/@granit/api-client/src/test-utils.ts'
      ),
      '@granit/api-client': path.resolve(__dirname, 'packages/@granit/api-client/src/index.ts'),
      '@granit/auth': path.resolve(__dirname, 'packages/@granit/auth/src/index.ts'),
      '@granit/cookies': path.resolve(__dirname, 'packages/@granit/cookies/src/index.ts'),
      '@granit/cookies-klaro': path.resolve(
        __dirname,
        'packages/@granit/cookies-klaro/src/index.ts'
      ),
      '@granit/data-exchange': path.resolve(
        __dirname,
        'packages/@granit/data-exchange/src/index.ts'
      ),
      '@granit/error-boundary': path.resolve(
        __dirname,
        'packages/@granit/error-boundary/src/index.ts'
      ),
      '@granit/localization': path.resolve(__dirname, 'packages/@granit/localization/src/index.ts'),
      '@granit/logger': path.resolve(__dirname, 'packages/@granit/logger/src/index.ts'),
      '@granit/logger-otlp': path.resolve(__dirname, 'packages/@granit/logger-otlp/src/index.ts'),
      '@granit/notifications-mobile-push': path.resolve(
        __dirname,
        'packages/@granit/notifications-mobile-push/src/index.ts'
      ),
      '@granit/notifications-signalr': path.resolve(
        __dirname,
        'packages/@granit/notifications-signalr/src/index.ts'
      ),
      '@granit/notifications-sse': path.resolve(
        __dirname,
        'packages/@granit/notifications-sse/src/index.ts'
      ),
      '@granit/notifications-web-push': path.resolve(
        __dirname,
        'packages/@granit/notifications-web-push/src/index.ts'
      ),
      '@granit/notifications': path.resolve(
        __dirname,
        'packages/@granit/notifications/src/index.ts'
      ),
      '@granit/querying': path.resolve(__dirname, 'packages/@granit/querying/src/index.ts'),
      '@granit/storage': path.resolve(__dirname, 'packages/@granit/storage/src/index.ts'),
      '@granit/timeline': path.resolve(__dirname, 'packages/@granit/timeline/src/index.ts'),
      '@granit/tracing': path.resolve(__dirname, 'packages/@granit/tracing/src/index.ts'),
      '@granit/utils': path.resolve(__dirname, 'packages/@granit/utils/src/index.ts'),
      '@granit/workflow': path.resolve(__dirname, 'packages/@granit/workflow/src/index.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['packages/@granit/notifications/src/__tests__/setup.ts'],
    include: ['packages/@granit/*/src/**/*.test.ts', 'packages/@granit/*/src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html', 'cobertura'],
      reportsDirectory: './coverage',
      include: ['packages/@granit/*/src/**/*.{ts,tsx}'],
      exclude: [
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.spec.ts',
        '**/types/**',
        '**/src/index.ts',
        '**/__tests__/setup.ts',
        '**/__tests__/test-utils.tsx',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
