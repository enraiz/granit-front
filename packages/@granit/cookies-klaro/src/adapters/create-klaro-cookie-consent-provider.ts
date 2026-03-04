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
 * Creates a `CookieConsentProvider` backed by Klaro CMP.
 *
 * - `init()` dynamically imports Klaro (no CSS) and creates a consent manager.
 * - `getConsents()` maps Klaro per-service consent to per-category consent.
 * - `onConsentChange()` watches the Klaro manager for updates.
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
  let manager: KlaroConsentManager | null = null;

  return {
    async init() {
      // Dynamic import — Klaro is loaded only when the provider is initialized
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

      // Klaro has no unwatch API — replace update with no-op on cleanup
      return () => {
        watcher.update = () => {};
      };
    },
  };
}
