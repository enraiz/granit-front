import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { I18nextProvider } from 'react-i18next';
import { afterEach, describe, expect, it } from 'vitest';

import { createLocalization } from '../create-localization.js';
import { useLocale } from '../use-locale.js';

afterEach(() => {
  localStorage.clear();
});

function createWrapper(i18n: ReturnType<typeof createLocalization>) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(I18nextProvider, { i18n }, children);
  };
}

describe('useLocale', () => {
  it('returns the current locale from i18next', async () => {
    const i18n = createLocalization();
    await i18n.changeLanguage('en');

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(i18n),
    });

    expect(result.current.locale).toBe('en');
  });

  it('returns "fr" as fallback when no language is set', () => {
    const i18n = createLocalization();

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(i18n),
    });

    expect(result.current.locale).toBe('fr');
  });

  it('setLocale persists to localStorage and changes i18next language', async () => {
    const i18n = createLocalization();
    await i18n.changeLanguage('fr');

    const { result } = renderHook(() => useLocale(), {
      wrapper: createWrapper(i18n),
    });

    act(() => {
      result.current.setLocale('en');
    });

    expect(localStorage.getItem('dd:locale')).toBe('"en"');
    expect(i18n.language).toBe('en');
  });

  it('setLocale returns a stable function reference', () => {
    const i18n = createLocalization();

    const { result, rerender } = renderHook(() => useLocale(), {
      wrapper: createWrapper(i18n),
    });

    const first = result.current.setLocale;
    rerender();
    expect(result.current.setLocale).toBe(first);
  });
});
