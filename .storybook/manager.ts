import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const granitTheme = create({
  base: 'light',
  brandTitle: 'Granit — Design System',
  brandUrl: '/',
  brandTarget: '_self',
  colorPrimary: '#475569',
  colorSecondary: '#475569',
  appBorderRadius: 8,
});

addons.setConfig({ theme: granitTheme });
