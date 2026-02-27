import * as React from 'react';

import Keycloak from 'keycloak-js';

import { setTokenGetter } from '@granit/api-client';

import type { KeycloakUserInfo } from '@granit/types';

import type { BaseAuthContextType, KeycloakCoreConfig } from './types.ts';

export interface KeycloakCoreResult extends BaseAuthContextType {
  /**
   * Direct ref to the Keycloak instance.
   * Expose to consuming apps that need to build custom login/logout URLs (e.g. Capacitor).
   */
  keycloakRef: React.MutableRefObject<Keycloak | null>;
}

/**
 * Shared Keycloak initialization hook (web-only, no Capacitor logic).
 *
 * Handles: instantiation, check-sso init, PKCE S256, token refresh every 60s,
 * loadUserInfo(), and wiring the Bearer token to @granit/api-client.
 *
 * Consuming apps that need native/Capacitor support should:
 * 1. Use `keycloakRef` to build platform-specific login/logout URLs
 * 2. Provide their own `login`/`logout`/`register` overrides
 * 3. Add the Capacitor `appUrlOpen` listener themselves
 */
export function useKeycloakInit(config: KeycloakCoreConfig): KeycloakCoreResult {
  const [authenticated, setAuthenticated] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<KeycloakUserInfo | null>(null);

  const keycloakRef = React.useRef<Keycloak | null>(null);
  const initStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (initStartedRef.current) return;
    initStartedRef.current = true;

    let refreshInterval: ReturnType<typeof setInterval>;

    const initKeycloak = async () => {
      try {
        const keycloak = new Keycloak({
          url: config.url,
          realm: config.realm,
          clientId: config.clientId,
        });

        keycloakRef.current = keycloak;

        const silentCheckSso = config.silentCheckSso !== false;
        const auth = await keycloak.init({
          onLoad: 'check-sso',
          pkceMethod: 'S256',
          checkLoginIframe: false,
          ...(silentCheckSso
            ? { silentCheckSsoRedirectUri: `${globalThis.location.origin}/silent-check-sso.html` }
            : {}),
        });

        setAuthenticated(auth);

        if (auth) {
          refreshInterval = setInterval(() => {
            keycloak
              .updateToken(70)
              .catch(() => {
                // Token refresh failed — app will handle re-login
              });
          }, 60_000);

          try {
            const userInfo = await keycloak.loadUserInfo();
            setUser(userInfo as KeycloakUserInfo);
          } catch {
            // User info load failed — non-fatal
          }

          setTokenGetter(async (): Promise<string | undefined> => {
            if (keycloakRef.current) {
              try {
                await keycloakRef.current.updateToken(5);
                return keycloakRef.current.token;
              } catch {
                return undefined;
              }
            }
            return undefined;
          });
        }
      } catch {
        // Keycloak init failed — stay unauthenticated
      } finally {
        setLoading(false);
      }
    };

    void initKeycloak();

    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [config.url, config.realm, config.clientId, config.silentCheckSso]);

  const login = React.useCallback(async () => {
    await keycloakRef.current?.login();
  }, []);

  const logout = React.useCallback(async () => {
    await keycloakRef.current?.logout();
  }, []);

  return {
    keycloakRef,
    keycloak: keycloakRef.current,
    authenticated,
    loading,
    user,
    login,
    logout,
  };
}
