/**
 * Information about a tenant.
 * Mirrors .NET Granit.MultiTenancy.ITenantInfo.
 */
export interface TenantInfo {
  /** Unique tenant identifier (GUID string). */
  readonly id: string;
  /** Display name of the tenant. */
  readonly name?: string;
}

/**
 * Current tenant state.
 * Mirrors .NET Granit.Core.MultiTenancy.ICurrentTenant.
 */
export interface CurrentTenant {
  /** Whether a tenant is active in the current context. */
  readonly isAvailable: boolean;
  /** Identifier of the current tenant, or undefined if outside a tenant context. */
  readonly tenantId: string | undefined;
  /** Name of the current tenant, or undefined. */
  readonly tenantName: string | undefined;
}

/**
 * Configuration options for multi-tenancy.
 * Mirrors .NET Granit.MultiTenancy.Options.MultiTenancyOptions.
 */
export interface MultiTenancyOptions {
  /** Enables or disables tenant resolution. Default: true. */
  readonly isEnabled?: boolean;
  /** JWT claim type containing the tenant identifier. Default: "tenant_id". */
  readonly tenantIdClaimType?: string;
  /** HTTP header name for tenant identification. Default: "X-Tenant-Id". */
  readonly tenantIdHeaderName?: string;
}

/** Default multi-tenancy options. */
export const DEFAULT_MULTI_TENANCY_OPTIONS: Required<MultiTenancyOptions> = {
  isEnabled: true,
  tenantIdClaimType: 'tenant_id',
  tenantIdHeaderName: 'X-Tenant-Id',
} as const;
