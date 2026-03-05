import { withThemeByClassName } from '@storybook/addon-themes';

import type { Preview } from '@storybook/react-vite';

import '../packages/@granit/ui-back/src/theme.css';

const preview: Preview = {
  parameters: {
    layout: 'centered',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      source: { state: 'open' as const },
    },
    a11y: {
      test: 'todo',
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: ['UI', '*'],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
    }),
  ],
};

export default preview;
