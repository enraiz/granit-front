/** Cached identity user — mirrors Granit.Identity.IdentityUser .NET record. */
export type IdentityUser = {
  readonly id: string;
  readonly username: string | null;
  readonly email: string | null;
  readonly firstName: string | null;
  readonly lastName: string | null;
  readonly enabled: boolean;
  readonly attributes: Readonly<Record<string, string>> | null;
};

export type IdentityUserListParams = {
  readonly search?: string;
  readonly page?: number;
  readonly pageSize?: number;
};

export type IdentityUserCacheStats = {
  readonly totalEntries: number;
  readonly staleEntries: number;
  readonly oldestSyncAt: string | null;
  readonly newestSyncAt: string | null;
};

export type IdentityUserCacheSyncAllResult = {
  readonly syncedCount: number;
};

export type IdentityUserCacheSyncStaleResult = {
  readonly refreshedCount: number;
};

/** Paginated response for identity user listing — mirrors Granit.Querying.PagedResult. */
export type IdentityUserPage = {
  readonly items: readonly IdentityUser[];
  readonly totalCount: number | null;
  readonly hasMore: boolean;
  readonly nextCursor: string | null;
};
