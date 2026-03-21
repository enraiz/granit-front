// ---------------------------------------------------------------------------
// Admin OIDC authorization types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Query parameters for `GET /oidc/authorizations`. */
export interface AdminOidcAuthorizationListParams {
  readonly userId?: string;
  readonly clientId?: string;
}

/** OIDC authorization descriptor. */
export interface AdminOidcAuthorization {
  readonly id: string;
  readonly subject: string;
  readonly status: string;
  readonly type: string;
}
