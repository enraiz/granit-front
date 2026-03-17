import { fetchFeatureValues } from '@granit/features';
import { useQuery } from '@tanstack/react-query';

import { buildFeaturesQueryKey, useFeaturesConfig } from '../providers/features-provider.js';

import type { FeatureValuesMap } from '@granit/features';
import type { UseQueryResult } from '@tanstack/react-query';

/**
 * Fetch all resolved feature values for the current context.
 *
 * Returns a `Record<string, string>` keyed by feature name.
 * Used internally by `useFeatureFlag` and `useFeatureValue` to avoid N+1 queries.
 *
 * @example
 * ```tsx
 * const { data: values } = useFeatureValues();
 * console.log(values?.['Acme.MaxUsers']); // "50"
 * ```
 */
export function useFeatureValues(options?: {
  enabled?: boolean;
}): UseQueryResult<FeatureValuesMap> {
  const config = useFeaturesConfig();

  return useQuery({
    queryKey: buildFeaturesQueryKey(config, 'values'),
    queryFn: () => fetchFeatureValues(config.client, config.basePath ?? ''),
    enabled: options?.enabled ?? true,
  });
}
