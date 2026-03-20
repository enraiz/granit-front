/** Identity role from the identity provider — mirrors Granit.Identity.IdentityRole .NET record. */
export type IdentityRole = {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
};
