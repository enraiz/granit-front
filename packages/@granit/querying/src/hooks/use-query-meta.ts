// ---------------------------------------------------------------------------
// useQueryMeta — fetch and cache query metadata (Story #48)
// ---------------------------------------------------------------------------

import { useQuery } from '@tanstack/react-query';


import { fetchQueryMeta } from '../api/query-api.js';
import { buildQueryKey, useQueryConfig } from '../providers/query-provider.js';

import type { QueryMetadata } from '../types/query-metadata.js';
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
