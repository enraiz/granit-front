import type {
  CreateKlaroCookieConsentProviderOptions,
  KlaroConsentManager,
  KlaroServiceMapping,
  KlaroWatcher,
} from "../types/index.js";
import type {
  CookieCategory,
  CookieConsentProviderInterface,
  ConsentState,
} from "@granit/cookies";

const ALL_CATEGORIES: readonly CookieCategory[] = [
  "strictly_necessary",
  "preferences",
  "analytics",
  "marketing",
];

/**
 * Builds a `ConsentState` from the Klaro consent manager and service mappings.
 * Uses all-or-nothing logic per category (same as the backend).
 */
function buildConsentState(
  manager: KlaroConsentManager,
  serviceMappings: readonly KlaroServiceMapping[],
): ConsentState {
  const state: ConsentState = {
    strictly_necessary: true,
    preferences: false,
    analytics: false,
    marketing: false,
  };

  for (const category of ALL_CATEGORIES) {
    if (category === "strictly_necessary") continue;

    const services = serviceMappings.filter((m) => m.category === category);
    if (services.length === 0) continue;

    state[category] = services.every((s) => manager.getConsent(s.name));
  }

  return state;
}

/**
 * Checks whether the consent cookie exists in document.cookie.
 */
function hasCookie(cookieName: string): boolean {
  return document.cookie.split(";").some(
    (c) => c.trim().startsWith(`${cookieName}=`),
  );
}

/**
 * Ensures the consent cookie is written.
 * Klaro's `saveAndApplyConsents()` may not persist the cookie when using
 * `getManager()` without the full UI setup. This function writes the cookie
 * directly as a fallback.
 */
function ensureCookiePersisted(
  manager: KlaroConsentManager,
  cookieName: string,
  serviceMappings: readonly KlaroServiceMapping[],
): void {
  manager.saveAndApplyConsents();
  if (!hasCookie(cookieName)) {
    const state: Record<string, boolean> = {};
    for (const mapping of serviceMappings) {
      state[mapping.name] = manager.getConsent(mapping.name);
    }
    document.cookie =
      `${cookieName}=${encodeURIComponent(JSON.stringify(state))};path=/;max-age=31536000;SameSite=Lax`;
  }
}

/**
 * Creates a `CookieConsentProvider` backed by Klaro CMP.
 *
 * - `init()` dynamically imports Klaro (no CSS) and creates a consent manager.
 * - `getConsents()` maps Klaro per-service consent to per-category consent.
 * - `onConsentChange()` watches the Klaro manager for updates.
 * - `setConsent()` / `setAllConsents()` persist consent changes through Klaro.
 * - `hasConsented()` checks whether the user has already made a consent choice.
 *
 * @example
 * ```ts
 * const provider = createKlaroCookieConsentProvider({
 *   klaroConfig: { services: [...] },
 *   serviceMappings: [
 *     { name: "google-analytics", category: "analytics" },
 *     { name: "matomo", category: "analytics" },
 *   ],
 * });
 * ```
 */
export function createKlaroCookieConsentProvider(
  options: CreateKlaroCookieConsentProviderOptions,
): CookieConsentProviderInterface {
  const { klaroConfig, serviceMappings } = options;
  const cookieName = klaroConfig.cookieName ?? "klaro";
  let manager: KlaroConsentManager | null = null;

  return {
    async init() {
      const klaro = await import("klaro/dist/klaro-no-css");
      manager = klaro.getManager(klaroConfig) as KlaroConsentManager;
    },

    getConsents() {
      if (!manager) {
        return {
          strictly_necessary: true,
          preferences: false,
          analytics: false,
          marketing: false,
        };
      }
      return buildConsentState(manager, serviceMappings);
    },

    onConsentChange(callback) {
      if (!manager) return () => {};

      const watcher: KlaroWatcher = {
        update() {
          if (manager) {
            callback(buildConsentState(manager, serviceMappings));
          }
        },
      };

      manager.watch(watcher);

      return () => {
        watcher.update = () => {};
      };
    },

    setConsent(category, granted) {
      if (!manager || category === "strictly_necessary") return;

      const services = serviceMappings.filter((m) => m.category === category);
      for (const service of services) {
        manager.setConsent(service.name, granted);
      }
      ensureCookiePersisted(manager, cookieName, serviceMappings);
    },

    setAllConsents(granted) {
      if (!manager) return;

      for (const category of ALL_CATEGORIES) {
        if (category === "strictly_necessary") continue;

        const services = serviceMappings.filter((m) => m.category === category);
        for (const service of services) {
          manager.setConsent(service.name, granted);
        }
      }
      ensureCookiePersisted(manager, cookieName, serviceMappings);
    },

    hasConsented() {
      return hasCookie(cookieName);
    },
  };
}
