// ---------------------------------------------------------------------------
// Account session types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Response from `POST /session/back-to-impersonator`. */
export interface AccountImpersonationResult {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresIn: number;
}
