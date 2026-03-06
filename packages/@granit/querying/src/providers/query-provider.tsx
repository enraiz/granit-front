// ---------------------------------------------------------------------------
// QueryProvider — React context for a single query endpoint
// ---------------------------------------------------------------------------

import { createContext, useContext, useMemo } from 'react';

import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

/** Configuration for a single query endpoint. */
export interface QueryConfig {
  /** Axios instance (from @granit/api-client). */
  readonly client: AxiosInstance;
  /** API base path (e.g. "/api/patients"). */
  readonly basePath: string;
  /**
   * TanStack Query key prefix.
   * Defaults to basePath segments (e.g. ["api", "patients"]).
   */
  readonly queryKeyPrefix?: readonly string[];
}

const QueryConfigContext = createContext<QueryConfig | null>(null);

export interface QueryProviderProps {
  readonly config: QueryConfig;
  readonly children: ReactNode;
}

/**
 * Provides query configuration to all querying hooks below in the tree.
 *
 * @example
 * ```tsx
 * <QueryProvider config={{ client: api, basePath: '/api/patients' }}>
 *   <PatientList />
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ config, children }: Readonly<QueryProviderProps>) {
  const value = useMemo(() => config, [config]);
  return <QueryConfigContext value={value}>{children}</QueryConfigContext>;
}

/**
 * Access the QueryConfig from the nearest QueryProvider.
 *
 * @throws Error if used outside a QueryProvider.
 */
export function useQueryConfig(): QueryConfig {
  const ctx = useContext(QueryConfigContext);
  if (!ctx) {
    throw new Error('useQueryConfig must be used within a QueryProvider');
  }
  return ctx;
}

/**
 * Build a TanStack Query key from the provider config + extra segments.
 */
export function buildQueryKey(
  config: QueryConfig,
  ...segments: readonly string[]
): readonly unknown[] {
  const prefix = config.queryKeyPrefix ?? config.basePath.split('/').filter(Boolean);
  return [...prefix, ...segments];
}
