import { afterEach, describe, expect, it, vi } from 'vitest';

import { resolveInitialLocale } from '../resolve-initial-locale.js';

import type { LanguageInfo } from '../types.js';

const languages: LanguageInfo[] = [
  { cultureName: 'fr', displayName: 'Français', isDefault: true },
  { cultureName: 'en', displayName: 'English', isDefault: false },
  { cultureName: 'de', displayName: 'Deutsch', isDefault: false },
];

afterEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('resolveInitialLocale', () => {
  it('should return stored locale from localStorage when available', () => {
    localStorage.setItem('dd:locale', '"en"');
    expect(resolveInitialLocale(languages)).toBe('en');
  });

  it('should return browser locale when no stored value and language is in available list', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('de-DE');
    expect(resolveInitialLocale(languages)).toBe('de');
  });

  it('should return browser locale when no languages list is provided', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('es-ES');
    expect(resolveInitialLocale()).toBe('es');
  });

  it('should skip browser locale when not in available languages list', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('ja-JP');
    expect(resolveInitialLocale(languages)).toBe('fr');
  });

  it('should return isDefault language when browser locale is not available', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('ja-JP');
    const langs: LanguageInfo[] = [
      { cultureName: 'en', displayName: 'English', isDefault: true },
      { cultureName: 'fr', displayName: 'Français', isDefault: false },
    ];
    expect(resolveInitialLocale(langs)).toBe('en');
  });

  it('should fall back to "fr" when nothing else matches', () => {
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('ja-JP');
    const langs: LanguageInfo[] = [
      { cultureName: 'en', displayName: 'English', isDefault: false },
      { cultureName: 'de', displayName: 'Deutsch', isDefault: false },
    ];
    expect(resolveInitialLocale(langs)).toBe('fr');
  });

  it('should use custom storageKey', () => {
    localStorage.setItem('dd:app-locale', '"de"');
    expect(resolveInitialLocale(languages, 'app-locale')).toBe('de');
  });

  it('should prioritize localStorage over navigator', () => {
    localStorage.setItem('dd:locale', '"de"');
    vi.spyOn(navigator, 'language', 'get').mockReturnValue('en-US');
    expect(resolveInitialLocale(languages)).toBe('de');
  });
});
