import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import type { LocalizationConfig } from './types.js';
import type { i18n } from 'i18next';

/**
 * Create an isolated i18next instance with Digital Dynamics defaults.
 *
 * Uses `createInstance()` instead of the global singleton to avoid
 * side effects at module import time.
 *
 * The instance is initialized **without** a `lng` option — the initial
 * locale is resolved by `resolveInitialLocale()` and applied later via
 * `applyTranslations()` once the backend responds.
 *
 * @example
 * ```typescript
 * // src/lib/i18n.ts
 * import { createLocalization } from '@granit/localization';
 * export const i18n = createLocalization();
 * ```
 */
export function createLocalization(config?: LocalizationConfig): i18n {
  const instance = createInstance();

  void instance.use(initReactI18next).init({
    defaultNS: config?.defaultNS ?? 'translation',
    interpolation: {
      escapeValue: false,
    },
    resources: {},
  });

  return instance;
}
