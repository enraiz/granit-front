import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const granitBackTheme = create({
  base: 'light',
  brandTitle: 'Granit — Back-office Design System',
  brandUrl: '/',
  brandTarget: '_self',

  colorPrimary: '#4f46e5',
  colorSecondary: '#4f46e5',

  appBorderRadius: 8,
});

addons.setConfig({
  theme: granitBackTheme,
});
