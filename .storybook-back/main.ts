import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../stories-back/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
  features: {
    sidebarOnboardingChecklist: false,
  },
  docs: {
    defaultName: 'Documentation',
  },
  viteFinal: async (config) => {
    const path = await import('node:path');
    const root = path.resolve(import.meta.dirname, '..');

    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      // Override: stories import @granit/ui but resolve to @granit/ui-back
      '@granit/ui': path.join(root, 'packages/@granit/ui-back/src/index.ts'),
    };

    return config;
  },
};

export default config;
