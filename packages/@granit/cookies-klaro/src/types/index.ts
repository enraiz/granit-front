import type { CookieCategory } from "@granit/cookies";

/**
 * Maps a Klaro service name to a RGPD cookie category.
 */
export interface KlaroServiceMapping {
  /** Service name as declared in the Klaro configuration. */
  readonly name: string;
  /** RGPD cookie category this service belongs to. */
  readonly category: CookieCategory;
}

/**
 * Klaro configuration object (minimal subset used by the adapter).
 * Full type is provided by Klaro itself.
 */
export interface KlaroConfig {
  /** Klaro element ID. */
  readonly elementID?: string;
  /** Cookie name used by Klaro. */
  readonly cookieName?: string;
  /** Klaro services configuration. */
  readonly services: ReadonlyArray<{
    readonly name: string;
    readonly purposes: readonly string[];
    [key: string]: unknown;
  }>;
  [key: string]: unknown;
}

/**
 * Options for creating the Klaro cookie consent provider.
 */
export interface CreateKlaroCookieConsentProviderOptions {
  /** Full Klaro configuration to pass to `klaro.getManager()`. */
  readonly klaroConfig: KlaroConfig;
  /** Mapping of Klaro service names to RGPD categories. */
  readonly serviceMappings: readonly KlaroServiceMapping[];
}

/**
 * Klaro consent manager interface (minimal subset used by the adapter).
 */
export interface KlaroConsentManager {
  getConsent(name: string): boolean;
  watch(watcher: KlaroWatcher): void;
}

/**
 * Klaro watcher interface for consent changes.
 */
export interface KlaroWatcher {
  update(
    obj: unknown,
    name: string,
    data: unknown,
  ): void;
}
