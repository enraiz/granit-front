import { createLocalization } from '@granit/localization';
import { initReactI18next } from 'react-i18next';

import type { LocalizationConfig } from '@granit/localization';
import type { i18n } from 'i18next';

/**
 * Create an i18next instance pre-configured with React integration.
 *
 * Convenience wrapper around `createLocalization()` that automatically
 * injects `initReactI18next` as a plugin.
 *
 * @example
 * ```typescript
 * // src/lib/i18n.ts
 * import { createReactLocalization } from '@granit/react-localization';
 * export const i18n = createReactLocalization();
 * ```
 */
export function createReactLocalization(config?: Omit<LocalizationConfig, 'plugins'>): i18n {
  return createLocalization({ ...config, plugins: [initReactI18next] });
}
