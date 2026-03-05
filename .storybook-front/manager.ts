import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const granitFrontTheme = create({
  base: 'light',
  brandTitle: 'Granit — Front Design System',
  brandUrl: '/',
  brandTarget: '_self',

  colorPrimary: '#0d9488',
  colorSecondary: '#0d9488',

  appBorderRadius: 8,
});

addons.setConfig({
  theme: granitFrontTheme,
});
