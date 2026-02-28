/** Matches backend Granit.Localization.LanguageInfo. */
export interface LanguageInfo {
  cultureName: string;
  displayName: string;
  flagIcon?: string;
  isDefault: boolean;
}

/** Matches backend ApplicationLocalizationDto. */
export interface ApplicationLocalizationDto {
  cultureName: string;
  resources: Record<string, Record<string, string>>;
  languages: LanguageInfo[];
}

export interface LocalizationConfig {
  /** localStorage key for locale persistence (default: 'locale' → dd:locale). */
  storageKey?: string;
  /** i18next default namespace (default: 'translation'). */
  defaultNS?: string;
}
