import { defineConfig } from 'vitest/config';

export default defineConfig({
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
