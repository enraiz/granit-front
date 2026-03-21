// ---------------------------------------------------------------------------
// Admin OIDC application types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** OIDC application descriptor. */
export interface AdminOidcApplication {
  readonly id: string;
  readonly clientId: string;
  readonly displayName: string | null;
  readonly type: string;
  readonly permissions: readonly string[];
  readonly redirectUris: readonly string[];
  readonly postLogoutRedirectUris: readonly string[];
}

/** Request body for `POST /oidc/applications`. */
export interface AdminOidcApplicationCreateRequest {
  readonly clientId: string;
  readonly clientSecret?: string;
  readonly displayName?: string;
  readonly permissions?: readonly string[];
  readonly redirectUris?: readonly string[];
  readonly postLogoutRedirectUris?: readonly string[];
}

/** Response from `POST /oidc/applications/{clientId}/rotate-secret`. */
export interface AdminOidcApplicationSecretResponse {
  readonly clientId: string;
  readonly newSecret: string;
}
