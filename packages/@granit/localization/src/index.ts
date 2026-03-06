export { createLocalization } from './create-localization.js';
export { resolveInitialLocale } from './resolve-initial-locale.js';
export { applyTranslations } from './apply-translations.js';
export { useLocale } from './use-locale.js';
export { LOCALE_STORAGE_KEY } from './constants.js';

export type { ApplicationLocalizationDto, LanguageInfo, LocalizationConfig } from './types.js';

// Re-export from react-i18next so apps import everything from @granit/localization.
export { I18nextProvider, Trans, useTranslation } from 'react-i18next';
