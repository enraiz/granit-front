export { createReactLocalization } from './create-react-localization.js';
export { useLocale } from './use-locale.js';
export type { UseLocaleOptions } from './use-locale.js';

// Hooks — Admin
export {
  useDeleteLocalizationOverride,
  useLanguages,
  useSetLocalizationOverride,
  useToggleLanguage,
} from './hooks/use-admin-localization.js';
export type {
  DeleteOverrideVariables,
  LocalizationAdminOptions,
  SetOverrideVariables,
  ToggleLanguageVariables,
} from './hooks/use-admin-localization.js';

// Re-export from react-i18next so apps import everything from @granit/react-localization.
export { I18nextProvider, Trans, useTranslation } from 'react-i18next';
