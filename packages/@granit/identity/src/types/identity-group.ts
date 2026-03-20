/** Identity group from the identity provider — mirrors Granit.Identity.IdentityGroup .NET record. */
export type IdentityGroup = {
  readonly id: string;
  readonly name: string;
  readonly path: string | null;
  readonly subGroups: readonly IdentityGroup[];
};
