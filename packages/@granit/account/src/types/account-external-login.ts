// ---------------------------------------------------------------------------
// Account external login types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** External login info returned by `GET /external-logins`. */
export interface AccountExternalLoginInfo {
  readonly loginProvider: string;
  readonly providerKey: string;
  readonly providerDisplayName: string | null;
}

/** Response from `GET /external-logins/callback`. */
export interface AccountExternalLoginCallbackResponse {
  readonly userId: string;
  readonly isNewUser: boolean;
}
