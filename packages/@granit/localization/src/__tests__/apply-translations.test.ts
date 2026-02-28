import { describe, expect, it, vi } from 'vitest';

import { applyTranslations } from '../apply-translations.js';

import type { ApplicationLocalizationDto } from '../types.js';

function createMockI18n(language = 'fr') {
  return {
    language,
    addResourceBundle: vi.fn(),
    changeLanguage: vi.fn().mockResolvedValue(undefined),
  };
}

const localizationData: ApplicationLocalizationDto = {
  cultureName: 'fr',
  resources: {
    Granit: {
      'Common.Save': 'Enregistrer',
      'Common.Cancel': 'Annuler',
    },
    Guava: {
      'Dashboard.Title': 'Tableau de bord',
      'Dashboard.Welcome': 'Bienvenue',
    },
  },
  languages: [
    { cultureName: 'fr', displayName: 'Français', isDefault: true },
    { cultureName: 'en', displayName: 'English', isDefault: false },
  ],
};

describe('applyTranslations', () => {
  it('merges all resource modules into the translation namespace', () => {
    const i18n = createMockI18n();
    applyTranslations(i18n as never, localizationData);

    expect(i18n.addResourceBundle).toHaveBeenCalledWith(
      'fr',
      'translation',
      {
        'Common.Save': 'Enregistrer',
        'Common.Cancel': 'Annuler',
        'Dashboard.Title': 'Tableau de bord',
        'Dashboard.Welcome': 'Bienvenue',
      },
      true,
      true,
    );
  });

  it('does not call changeLanguage when instance language matches', () => {
    const i18n = createMockI18n('fr');
    applyTranslations(i18n as never, localizationData);

    expect(i18n.changeLanguage).not.toHaveBeenCalled();
  });

  it('calls changeLanguage when instance language differs', () => {
    const i18n = createMockI18n('en');
    applyTranslations(i18n as never, localizationData);

    expect(i18n.changeLanguage).toHaveBeenCalledWith('fr');
  });

  it('handles empty resources', () => {
    const i18n = createMockI18n();
    const data: ApplicationLocalizationDto = {
      cultureName: 'en',
      resources: {},
      languages: [],
    };
    applyTranslations(i18n as never, data);

    expect(i18n.addResourceBundle).toHaveBeenCalledWith(
      'en',
      'translation',
      {},
      true,
      true,
    );
  });

  it('later modules override earlier ones on key collision', () => {
    const i18n = createMockI18n();
    const data: ApplicationLocalizationDto = {
      cultureName: 'fr',
      resources: {
        Base: { 'App.Title': 'Base Title' },
        Override: { 'App.Title': 'Override Title' },
      },
      languages: [],
    };
    applyTranslations(i18n as never, data);

    expect(i18n.addResourceBundle).toHaveBeenCalledWith(
      'fr',
      'translation',
      { 'App.Title': 'Override Title' },
      true,
      true,
    );
  });
});
