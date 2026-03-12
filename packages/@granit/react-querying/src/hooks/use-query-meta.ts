// ---------------------------------------------------------------------------
// useQueryMeta — fetch and cache query metadata (Story #48)
// ---------------------------------------------------------------------------

import { fetchQueryMeta } from '@granit/querying';
import { buildQueryKey } from '@granit/querying';
import { useQuery } from '@tanstack/react-query';

import { useQueryConfig } from '../providers/query-provider.js';

import type { QueryMetadata } from '@granit/querying';
import type { UseQueryResult } from '@tanstack/react-query';

/**
 * Fetch query metadata for the current endpoint.
 *
 * Metadata is considered static and cached with `staleTime: Infinity`
 * (refetched only on mount or manual invalidation).
 *
 * @example
 * ```tsx
 * const { data: meta, isLoading } = useQueryMeta();
 * ```
 */
export function useQueryMeta(): UseQueryResult<QueryMetadata> {
  const config = useQueryConfig();

  return useQuery({
    queryKey: buildQueryKey(config, 'meta'),
    queryFn: () => fetchQueryMeta(config.client, config.basePath),
    staleTime: Infinity,
  });
}
