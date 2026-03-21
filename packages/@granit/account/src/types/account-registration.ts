// ---------------------------------------------------------------------------
// Account registration types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Request body for `POST /register`. */
export interface AccountRegisterRequest {
  readonly email: string;
  readonly password: string;
  readonly firstName?: string;
  readonly lastName?: string;
}

/** Response from `POST /register`. */
export interface AccountRegisterResponse {
  readonly userId: string;
  readonly requiresEmailConfirmation: boolean;
}
