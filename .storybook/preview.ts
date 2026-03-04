import { withThemeByClassName } from '@storybook/addon-themes';

import type { Preview } from '@storybook/react-vite';

import './storybook.css';

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
    options: {
      storySort: {
        method: 'alphabetical' as const,
        order: [
          'UI',
          [
            'Primitives',
            ['Button', 'Badge', 'Input', 'Label', 'Textarea', 'Checkbox', 'Switch', 'Spinner', 'Separator', 'Skeleton'],
            'Layout',
            ['Card', 'Avatar', 'Tabs', 'Table'],
            'Overlays',
            ['Dialog', 'Popover', 'Tooltip', 'Toaster'],
            'Menus',
            ['DropdownMenu', 'Select'],
            'Form',
          ],
          'Querying',
          '*',
        ],
      },
    },
  },
  decorators: [
    withThemeByClassName({
      themes: {
        'Front (light)': 'theme-front',
        'Front (dark)': 'theme-front dark',
        'Back-office (light)': 'theme-back',
        'Back-office (dark)': 'theme-back dark',
      },
      defaultTheme: 'Front (light)',
    }),
  ],
};

export default preview;
