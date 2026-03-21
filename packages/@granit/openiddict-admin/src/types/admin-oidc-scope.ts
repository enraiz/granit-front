// ---------------------------------------------------------------------------
// Admin OIDC scope types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** OIDC scope descriptor. */
export interface AdminOidcScope {
  readonly id: string;
  readonly name: string;
  readonly displayName: string | null;
  readonly resources: readonly string[];
}

/** Request body for `POST /oidc/scopes`. */
export interface AdminOidcScopeCreateRequest {
  readonly name: string;
  readonly displayName?: string;
  readonly resources?: readonly string[];
}
