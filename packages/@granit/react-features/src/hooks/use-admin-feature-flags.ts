import { fetchAdminFeatureFlags, toggleAdminFeatureFlag } from '@granit/features';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buildFeaturesQueryKey, useFeaturesConfig } from '../providers/features-provider.js';

import type { AdminFeatureFlag } from '@granit/features';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/**
 * Fetch all feature flags with admin audit metadata.
 */
export function useAdminFeatureFlags(options?: {
  enabled?: boolean;
}): UseQueryResult<AdminFeatureFlag[]> {
  const config = useFeaturesConfig();

  return useQuery({
    queryKey: buildFeaturesQueryKey(config, 'admin', 'flags'),
    queryFn: () => fetchAdminFeatureFlags(config.client, config.basePath ?? ''),
    enabled: options?.enabled ?? true,
    staleTime: 5 * 60 * 1000,
  });
}

export type ToggleFeatureFlagVariables = {
  readonly key: string;
  readonly enabled: boolean;
};

/**
 * Toggle a feature flag on or off.
 * Invalidates feature flag queries on success.
 */
export function useToggleAdminFeatureFlag(): UseMutationResult<
  void,
  Error,
  ToggleFeatureFlagVariables
> {
  const config = useFeaturesConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, enabled }: ToggleFeatureFlagVariables) =>
      toggleAdminFeatureFlag(config.client, config.basePath ?? '', key, enabled),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildFeaturesQueryKey(config, 'admin', 'flags'),
      });
    },
  });
}
