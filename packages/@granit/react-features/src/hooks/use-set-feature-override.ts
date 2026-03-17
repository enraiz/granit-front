import { setFeatureOverride } from '@granit/features';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { buildFeaturesQueryKey, useFeaturesConfig } from '../providers/features-provider.js';

export interface UseSetFeatureOverrideReturn {
  readonly set: (name: string, value: string) => void;
  readonly setAsync: (name: string, value: string) => Promise<void>;
  readonly isPending: boolean;
  readonly error: Error | null;
}

/**
 * Mutation to set a tenant-level feature override.
 *
 * Automatically invalidates the `values` query key on success so that
 * `useFeatureFlag` / `useFeatureValue` pick up the new value.
 *
 * @example
 * ```tsx
 * const { set } = useSetFeatureOverride();
 * set('Acme.MaxUsers', '100');
 * ```
 */
export function useSetFeatureOverride(): UseSetFeatureOverrideReturn {
  const config = useFeaturesConfig();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ name, value }: { name: string; value: string }) =>
      setFeatureOverride(config.client, config.basePath ?? '', name, { value }),
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: buildFeaturesQueryKey(config, 'values') })
        .catch(() => undefined);
    },
  });

  const set = useCallback(
    (name: string, value: string) => {
      mutation.mutate({ name, value });
    },
    [mutation]
  );

  const setAsync = useCallback(
    async (name: string, value: string) => {
      await mutation.mutateAsync({ name, value });
    },
    [mutation]
  );

  return {
    set,
    setAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}
