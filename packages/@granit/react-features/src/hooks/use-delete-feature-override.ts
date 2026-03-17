import { deleteFeatureOverride } from '@granit/features';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { buildFeaturesQueryKey, useFeaturesConfig } from '../providers/features-provider.js';

export interface UseDeleteFeatureOverrideReturn {
  readonly remove: (name: string) => void;
  readonly removeAsync: (name: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

/**
 * Mutation to delete a tenant-level feature override.
 *
 * After deletion, the feature value reverts to the plan/default cascade.
 * Automatically invalidates the `values` query key on success.
 *
 * @example
 * ```tsx
 * const { remove } = useDeleteFeatureOverride();
 * remove('Acme.MaxUsers'); // reverts to plan/default
 * ```
 */
export function useDeleteFeatureOverride(): UseDeleteFeatureOverrideReturn {
  const config = useFeaturesConfig();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (name: string) => deleteFeatureOverride(config.client, config.basePath ?? '', name),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: buildFeaturesQueryKey(config, 'values') })
        .catch(() => undefined);
    },
  });

  const remove = useCallback(
    (name: string) => {
      mutation.mutate(name);
    },
    [mutation]
  );

  const removeAsync = useCallback(
    async (name: string) => {
      await mutation.mutateAsync(name);
    },
    [mutation]
  );

  return {
    remove,
    removeAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
