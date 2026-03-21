import { fetchFeatureDefinitions } from '@granit/features';
import { useQuery } from '@tanstack/react-query';

import { buildFeaturesQueryKey, useFeaturesConfig } from '../providers/features-provider.js';

import type { FeatureGroup } from '@granit/features';
import type { UseQueryResult } from '@tanstack/react-query';

/**
 * Fetch all feature definitions grouped by category.
 *
 * @example
 * ```tsx
 * const { data: groups } = useFeatureDefinitions();
 * groups?.forEach(g => console.log(g.name, g.features.length));
 * ```
 */
export function useFeatureDefinitions(options?: {
  enabled?: boolean;
}): UseQueryResult<FeatureGroup[]> {
  const config = useFeaturesConfig();

  return useQuery({
    queryKey: buildFeaturesQueryKey(config, 'definitions'),
    queryFn: () => fetchFeatureDefinitions(config.client, config.basePath ?? ''),
    enabled: options?.enabled ?? true,
  });
}
