import { setTenantGetter } from '@granit/api-client';
import { resolveTenant } from '@granit/multi-tenancy';
import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

import type { CurrentTenant, MultiTenancyOptions, TenantResolver } from '@granit/multi-tenancy';
import type { ReactNode } from 'react';

const NO_TENANT: CurrentTenant = {
  isAvailable: false,
  tenantId: undefined,
  tenantName: undefined,
};

export interface TenantProviderProps {
  /** Ordered list of tenant resolvers. */
  readonly resolvers: readonly TenantResolver[];
  /** Multi-tenancy options. */
  readonly options?: MultiTenancyOptions;
  readonly children: ReactNode;
}

const TenantContext = createContext<CurrentTenant | null>(null);

export function TenantProvider({
  resolvers,
  options,
  children,
}: Readonly<TenantProviderProps>): React.JSX.Element {
  const isEnabled = options?.isEnabled !== false;

  const tenant: CurrentTenant = useMemo(() => {
    if (!isEnabled) return NO_TENANT;

    const resolved = resolveTenant(resolvers);
    if (resolved) {
      return { isAvailable: true, tenantId: resolved.id, tenantName: resolved.name };
    }
    return NO_TENANT;
  }, [resolvers, isEnabled]);

  const tenantRef = useRef(tenant);
  tenantRef.current = tenant;

  useEffect(() => {
    if (!isEnabled) return;
    setTenantGetter(() => tenantRef.current.tenantId);
  }, [isEnabled]);

  return <TenantContext value={tenant}>{children}</TenantContext>;
}

/**
 * Returns the current tenant from the nearest TenantProvider.
 *
 * @throws Error if called outside a TenantProvider.
 */
export function useTenant(): CurrentTenant {
  const ctx = useContext(TenantContext);
  if (!ctx) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return ctx;
}
