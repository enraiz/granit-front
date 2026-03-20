/** Response from `GET /identity/provider/users/{userId}/password/changed-at`. */
export type IdentityPasswordChangedAtResponse = {
  readonly changedAt: string | null;
};
