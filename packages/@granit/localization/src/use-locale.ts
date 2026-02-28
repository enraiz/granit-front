import { createStorage } from '@granit/storage';
import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LOCALE_STORAGE_KEY } from './constants.js';

/**
 * Simplified hook for locale management (language switchers).
 *
 * Returns the current locale and a setter that persists to localStorage
 * and updates the i18next language.
 *
 * @example
 * ```tsx
 * function LanguageSwitcher() {
 *   const { locale, setLocale } = useLocale();
 *   return <button onClick={() => setLocale('en')}>{locale}</button>;
 * }
 * ```
 */
export function useLocale(): {
  locale: string;
  setLocale: (locale: string) => void;
} {
  const { i18n } = useTranslation();
  const storage = useMemo(() => createStorage<string>(LOCALE_STORAGE_KEY), []);

  const setLocale = useCallback(
    (nextLocale: string) => {
      storage.set(nextLocale);
      i18n.changeLanguage(nextLocale).catch(() => undefined);
    },
    [i18n, storage],
  );

  return {
    locale: i18n.language ?? 'fr',
    setLocale,
  };
}
