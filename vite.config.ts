/**
 * Vite config for development tooling (Storybook, vitest).
 * granit-front is a library workspace — there is no app build.
 */
import path from 'node:path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = __dirname;
const pkg = (name: string) =>
  path.join(root, `packages/@granit/${name}/src/index.ts`);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@granit/logger': pkg('logger'),
      '@granit/utils': pkg('utils'),
      '@granit/storage': pkg('storage'),
      '@granit/cookies': pkg('cookies'),
      '@granit/ui': pkg('ui'),
      '@granit/ui-back': pkg('ui-back'),
      '@granit/querying': pkg('querying'),
      '@granit/data-exchange': pkg('data-exchange'),
    },
  },
});
