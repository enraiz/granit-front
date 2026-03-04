import type { AxiosInstance } from 'axios';
import type Keycloak from 'keycloak-js';

// ---------------------------------------------------------------------------
// Keycloak / OIDC standard user claims
// ---------------------------------------------------------------------------

export interface KeycloakUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

// ---------------------------------------------------------------------------
// Event types
// ---------------------------------------------------------------------------

/** Keycloak lifecycle event names forwarded by useKeycloakInit. */
export type KeycloakEvent =
  | 'onReady'
  | 'onAuthSuccess'
  | 'onAuthError'
  | 'onAuthRefreshSuccess'
  | 'onAuthRefreshError'
  | 'onAuthLogout'
  | 'onTokenExpired';

// ---------------------------------------------------------------------------
// Login / Logout option types (mirrors keycloak-js but decoupled)
// ---------------------------------------------------------------------------

/** Options forwarded to `keycloak.login()`. All fields are optional. */
export interface LoginOptions {
  redirectUri?: string;
  /** Bypass the Keycloak login page and redirect to a specific identity provider. */
  idpHint?: string;
  /** Pre-fill the username/email field on the login page. */
  loginHint?: string;
  /** Force the Keycloak UI locale (e.g. `"fr"`). */
  locale?: string;
  /** Trigger a specific action: `"register"` for signup, or a required action name. */
  action?: string;
  prompt?: 'login' | 'consent' | 'none';
  /** Request additional OAuth scopes (space-delimited). */
  scope?: string;
  /** Maximum time since last authentication (seconds). */
  maxAge?: number;
}

/** Options forwarded to `keycloak.logout()`. */
export interface LogoutOptions {
  /** URL to redirect to after logout completes. */
  redirectUri?: string;
}

// ---------------------------------------------------------------------------
// Base auth context (shared by all consuming apps — kept minimal)
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Hook configuration
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Permissions (usePermissions hook)
// ---------------------------------------------------------------------------

/** Response from the `GET /auth/me` backend endpoint. */
export type PermissionsResponse = {
  permissions: readonly string[];
};

/** Configuration options for the {@link usePermissions} hook. */
export type UsePermissionsOptions = {
  /** Axios instance to use for the API call. */
  client: AxiosInstance;
  /** Base path for the authorization API. Default: `'/auth'`. */
  basePath?: string;
  /** Override the enabled state. Default: `true` when authenticated. */
  enabled?: boolean;
};

/** Return type of the {@link usePermissions} hook. */
export type UsePermissionsReturn = {
  /** Set of permission names granted to the current user. Empty while loading or on error. */
  readonly permissions: ReadonlySet<string>;
  /** Returns `true` if the current user has been granted the specified permission. O(1) lookup. */
  hasPermission: (permission: string) => boolean;
  /** Returns `true` if the current user has **any** of the specified permissions. */
  hasAnyPermission: (permissions: readonly string[]) => boolean;
  /** Returns `true` if the current user has **all** of the specified permissions. */
  hasAllPermissions: (permissions: readonly string[]) => boolean;
  /** Whether the permissions query is in-flight. */
  readonly isLoading: boolean;
  /** Query error (network, 401, parsing, etc.). `null` if loading or successful. */
  readonly error: Error | null;
  /** Manual refetch trigger (e.g. after an admin grants a new permission). */
  readonly refetch: () => void;
};

// ---------------------------------------------------------------------------
// Admin permission management (mirrors .NET Authorization DTOs)
// ---------------------------------------------------------------------------

/** A single permission definition with optional display name. */
export type PermissionDefinitionDto = {
  name: string;
  displayName: string | null;
};

/** A group of related permission definitions. */
export type PermissionGroupDto = {
  name: string;
  displayName: string | null;
  permissions: readonly PermissionDefinitionDto[];
};

/** Permissions granted to a specific role. */
export type PermissionGrantDto = {
  roleName: string;
  permissions: readonly string[];
};

/** Options for the {@link usePermissionDefinitions} hook. */
export type UsePermissionDefinitionsOptions = {
  client: AxiosInstance;
  basePath?: string;
  enabled?: boolean;
};

/** Options for the {@link useRolePermissions} hook. */
export type UseRolePermissionsOptions = {
  client: AxiosInstance;
  roleName: string;
  basePath?: string;
  enabled?: boolean;
};

/** Options for the {@link usePermissionGrant} hook. */
export type UsePermissionGrantOptions = {
  client: AxiosInstance;
  basePath?: string;
};

// ---------------------------------------------------------------------------
// Hook configuration
// ---------------------------------------------------------------------------

export interface KeycloakCoreConfig {
  url: string;
  realm: string;
  clientId: string;

  /** Whether the silent SSO check is enabled (web-only, skip on native). Default: true */
  silentCheckSso?: boolean;

  /**
   * Fall back to a regular `check-sso` redirect when the silent iframe check
   * fails (e.g. Safari with third-party cookie blocking). Default: true
   */
  silentCheckSsoFallback?: boolean;

  /**
   * When true, extract user info from the decoded JWT (`tokenParsed`) instead
   * of calling the `/userinfo` endpoint. Avoids an extra HTTP round-trip but
   * requires the Keycloak client mappers to include the needed claims in the
   * access token. Default: false (calls `loadUserInfo()`).
   */
  useTokenClaims?: boolean;

  // -- Lifecycle callbacks (all optional) ----------------------------------

  /** Called when the access token expires. */
  onTokenExpired?: () => void;
  /** Called when a token refresh attempt fails. */
  onAuthRefreshError?: () => void;
  /** Called when the Keycloak session is terminated (admin logout, SSO logout). */
  onAuthLogout?: () => void;
  /** Generic handler called for every Keycloak lifecycle event. */
  onEvent?: (event: KeycloakEvent, error?: unknown) => void;
}
