// ---------------------------------------------------------------------------
// Account deletion types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Request body for `POST /delete`. */
export interface AccountDeleteRequest {
  readonly password: string;
}
