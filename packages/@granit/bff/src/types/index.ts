// ---------------------------------------------------------------------------
// BFF authentication types — mirrors Granit.Bff .NET contract
// ---------------------------------------------------------------------------

/** Authenticated user returned by GET /{prefix}/bff/user. */
export interface BffUser {
  readonly authenticated: true;
  readonly sub: string;
  readonly name: string;
  readonly email: string;
  readonly roles: readonly string[];
  readonly tenantId?: string;
  readonly sessionExpiresAt: string;
}

/** Unauthenticated response from GET /{prefix}/bff/user. */
export interface BffUnauthenticated {
  readonly authenticated: false;
}

/** Union type for the /bff/user endpoint response. */
export type BffUserResponse = BffUser | BffUnauthenticated;

/** Configuration for the BFF authentication provider. */
export interface BffConfig {
  /** Path prefix for this frontend (e.g., "/admin"). */
  readonly pathPrefix: string;
  /** Called when /bff/user returns authenticated: false. Default: redirect to login. */
  readonly onUnauthenticated?: () => void;
  /** Polling interval for session check in ms. Default: 60000 (1 minute). 0 = disabled. */
  readonly sessionCheckInterval?: number;
}
