import { createStorage } from '@granit/storage';

import { LOCALE_STORAGE_KEY } from './constants.js';

import type { LanguageInfo } from './types.js';

/**
 * Resolve the initial locale before backend data is available.
 *
 * Detection cascade:
 * 1. Read `dd:locale` from localStorage → if present, return it
 * 2. Read `navigator.language` (e.g. "fr-FR" → "fr") → if in available languages, return it
 * 3. If `languages` provided → return the one with `isDefault === true`
 * 4. Fallback → `'fr'`
 *
 * This function is called **before** the first backend fetch. It returns
 * the locale to use for `GET /api/granit/localization?cultureName=...`.
 */
export function resolveInitialLocale(
  languages?: LanguageInfo[],
  storageKey?: string,
): string {
  const storage = createStorage<string>(storageKey ?? LOCALE_STORAGE_KEY);

  // 1. localStorage
  const stored = storage.get();
  if (stored) return stored;

  // 2. navigator.language
  if (typeof navigator !== 'undefined' && navigator.language) {
    const browserLocale = navigator.language.split('-')[0];
    if (!languages || languages.some((l) => l.cultureName === browserLocale)) {
      return browserLocale;
    }
  }

  // 3. isDefault from backend languages
  if (languages) {
    const defaultLang = languages.find((l) => l.isDefault);
    if (defaultLang) return defaultLang.cultureName;
  }

  // 4. Fallback
  return 'fr';
}
