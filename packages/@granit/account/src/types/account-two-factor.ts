// ---------------------------------------------------------------------------
// Account two-factor types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Response from `GET /two-factor`. */
export interface AccountTwoFactorStatusResponse {
  readonly isEnabled: boolean;
  readonly hasAuthenticatorApp: boolean;
  readonly recoveryCodesLeft: number;
}

/** Response from `GET /two-factor/authenticator-key`. */
export interface AccountAuthenticatorKeyResponse {
  readonly sharedKey: string;
  readonly qrCodeUri: string;
}

/** Request body for `POST /two-factor/enable`. */
export interface AccountTwoFactorEnableRequest {
  readonly code: string;
}

/** Response from `POST /two-factor/enable`. */
export interface AccountTwoFactorEnableResponse {
  readonly recoveryCodes: readonly string[];
}

/** Response from `POST /two-factor/recovery-codes`. */
export interface AccountRecoveryCodesResponse {
  readonly recoveryCodes: readonly string[];
}
