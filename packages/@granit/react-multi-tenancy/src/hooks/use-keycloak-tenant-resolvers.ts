import { createJwtClaimTenantResolver } from '@granit/multi-tenancy';
import { useMemo } from 'react';

import type { TenantResolver } from '@granit/multi-tenancy';

export interface UseKeycloakTenantResolversOptions {
  /** The decoded JWT payload from Keycloak (keycloak.tokenParsed). */
  readonly tokenParsed: Record<string, unknown> | undefined;
  /** JWT claim type for tenant ID. Default: "tenant_id". */
  readonly claimType?: string;
}

/**
 * Creates tenant resolvers wired to a Keycloak token.
 *
 * @example
 * ```tsx
 * const { tokenParsed } = useAuth();
 * const resolvers = useKeycloakTenantResolvers({ tokenParsed });
 * <TenantProvider resolvers={resolvers}>...</TenantProvider>
 * ```
 */
export function useKeycloakTenantResolvers(
  options: UseKeycloakTenantResolversOptions
): readonly TenantResolver[] {
  const { tokenParsed, claimType } = options;

  return useMemo(() => {
    const jwtResolver = createJwtClaimTenantResolver({
      tokenParsedGetter: () => tokenParsed,
      claimType,
    });
    return [jwtResolver];
  }, [tokenParsed, claimType]);
}
