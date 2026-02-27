import type Keycloak from 'keycloak-js';

import type { KeycloakUserInfo } from '@granit/types';

/**
 * Base auth context shared by all consuming applications.
 *
 * Apps extend this interface with their own fields:
 * - guava-front: adds `register: () => void`
 * - guava-admin: adds `hasAdminRole: boolean`
 */
export interface BaseAuthContextType {
  /** Live Keycloak instance — null before init completes */
  keycloak: Keycloak | null;
  authenticated: boolean;
  loading: boolean;
  user: KeycloakUserInfo | null;
  login: () => void;
  logout: () => void;
}

export interface KeycloakCoreConfig {
  url: string;
  realm: string;
  clientId: string;
  /** Whether the silent SSO check is enabled (web-only, skip on native). Default: true */
  silentCheckSso?: boolean;
}
