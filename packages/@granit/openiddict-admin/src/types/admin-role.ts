// ---------------------------------------------------------------------------
// Admin role types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Role descriptor. */
export interface AdminRole {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
}

/** Request body for `POST /roles`. */
export interface AdminRoleCreateRequest {
  readonly name: string;
  readonly description?: string;
}

/** Role member (simplified user). */
export interface AdminRoleMember {
  readonly id: string;
  readonly email: string;
  readonly firstName: string | null;
  readonly lastName: string | null;
}
