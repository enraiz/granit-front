import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
  docs: {
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    const path = await import('node:path');
    const { default: tailwindcss } = await import('@tailwindcss/vite');

    config.plugins = config.plugins ?? [];
    config.plugins.push(tailwindcss());

    const root = path.resolve(import.meta.dirname, '..');
    const pkg = (name: string) =>
      path.join(root, `packages/@granit/${name}/src/index.ts`);

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@granit/logger': pkg('logger'),
      '@granit/utils': pkg('utils'),
      '@granit/storage': pkg('storage'),
      '@granit/cookies': pkg('cookies'),
      '@granit/ui': pkg('ui'),
      '@granit/ui-back': pkg('ui-back'),
      '@granit/querying': pkg('querying'),
    };

    return config;
  },
};

export default config;
