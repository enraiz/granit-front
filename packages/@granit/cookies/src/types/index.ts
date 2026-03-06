/**
 * RGPD cookie consent categories — mirrors the C# CookieCategory enum.
 */
export type CookieCategory =
  | "strictly_necessary"
  | "preferences"
  | "analytics"
  | "marketing";

/**
 * Current consent state for each category.
 */
export type ConsentState = Record<CookieCategory, boolean>;

/**
 * Abstraction for a Consent Management Platform (Klaro, Cookiebot, etc.).
 * Applications provide their own implementation.
 */
export interface CookieConsentProvider {
  /** Initializes the CMP (loads SDK, reads existing consent). */
  init(): Promise<void>;

  /** Returns the current consent state for all categories. */
  getConsents(): ConsentState;

  /**
   * Subscribes to consent changes. Returns an unsubscribe function.
   * Called when the user updates their consent preferences.
   */
  onConsentChange(callback: (consents: ConsentState) => void): () => void;

  /** Sets consent for a single category and persists it in the CMP. */
  setConsent(category: CookieCategory, granted: boolean): void;

  /** Sets consent for all non-essential categories and persists it in the CMP. */
  setAllConsents(granted: boolean): void;

  /** Returns true if the user has already made a consent choice. */
  hasConsented(): boolean;
}

/**
 * Value exposed by the CookieConsentContext to React components.
 */
export interface CookieConsentContextValue {
  /** Current consent state per category. */
  consents: ConsentState;

  /** Whether the CMP has been initialized and consent state is loaded. */
  isLoaded: boolean;

  /** Whether the user has already made a consent choice. */
  hasConsented: boolean;

  /** Grants consent for a specific category. */
  acceptCategory: (category: CookieCategory) => void;

  /** Revokes consent for a specific category. */
  revokeCategory: (category: CookieCategory) => void;

  /** Grants consent for all categories. */
  acceptAll: () => void;

  /** Revokes consent for all non-essential categories. */
  revokeAll: () => void;
}
