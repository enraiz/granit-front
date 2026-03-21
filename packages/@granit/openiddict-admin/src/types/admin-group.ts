// ---------------------------------------------------------------------------
// Admin group types — mirrors Granit.OpenIddict.Endpoints .NET contract
// ---------------------------------------------------------------------------

/** Group descriptor. */
export interface AdminGroup {
  readonly id: string;
  readonly name: string;
  readonly path: string | null;
  readonly subGroups: readonly AdminGroup[];
}

/** Request body for `POST /groups`. */
export interface AdminGroupCreateRequest {
  readonly name: string;
  readonly description?: string;
}

/** Request body for `POST /groups/{groupId}/members`. */
export interface AdminGroupMemberRequest {
  readonly userId: string;
}
