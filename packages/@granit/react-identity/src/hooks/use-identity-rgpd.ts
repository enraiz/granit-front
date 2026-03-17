import { eraseUserCache, pseudonymizeUserCache } from '@granit/identity';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { buildIdentityQueryKey, useIdentityConfig } from '../providers/identity-provider.js';

import type { UseMutationResult } from '@tanstack/react-query';

/**
 * Returns mutations for GDPR-related identity cache operations.
 *
 * - `erase` — hard-delete a user's cached data
 * - `pseudonymize` — pseudonymize a user's cached data (right to be forgotten)
 *
 * Both mutations invalidate user queries on success.
 *
 * @example
 * ```tsx
 * const { erase, pseudonymize } = useIdentityRgpd();
 * await erase.mutateAsync('user-id');
 * await pseudonymize.mutateAsync('user-id');
 * ```
 */
export function useIdentityRgpd(): {
  erase: UseMutationResult<void, Error, string>;
  pseudonymize: UseMutationResult<void, Error, string>;
} {
  const config = useIdentityConfig();
  const queryClient = useQueryClient();
  const basePath = config.basePath ?? '/identity/users';

  const erase = useMutation({
    mutationFn: (userId: string) => eraseUserCache(config.client, basePath, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildIdentityQueryKey(config, 'users'),
      });
    },
  });

  const pseudonymize = useMutation({
    mutationFn: (userId: string) => pseudonymizeUserCache(config.client, basePath, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: buildIdentityQueryKey(config, 'users'),
      });
    },
  });

  return { erase, pseudonymize };
}
