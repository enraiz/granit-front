/** Active session from the identity provider — mirrors Granit.Identity.IdentitySession .NET record. */
export type IdentitySession = {
  readonly sessionId: string;
  readonly ipAddress: string | null;
  readonly startedAt: string;
  readonly lastAccess: string;
  readonly rememberMe: boolean;
  readonly clients: readonly string[];
};

/** Device activity from the identity provider — mirrors Granit.Identity.IdentityDeviceActivity .NET record. */
export type IdentityDeviceActivity = {
  readonly ipAddress: string | null;
  readonly lastAccess: string;
  readonly device: string | null;
  readonly os: string | null;
  readonly osVersion: string | null;
  readonly browser: string | null;
  readonly mobile: boolean;
  readonly current: boolean;
  readonly sessions: readonly IdentitySession[];
};
