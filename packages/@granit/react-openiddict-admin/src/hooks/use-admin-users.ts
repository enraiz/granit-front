import {
  createUser,
  deleteUser,
  getUser,
  impersonateUser,
  listUsers,
} from '@granit/openiddict-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buildAdminQueryKey, useAdminConfig } from '../providers/openiddict-admin-provider.js';

import type {
  AdminImpersonationResult,
  AdminUser,
  AdminUserCreateRequest,
  AdminUserListParams,
  AdminUserPage,
} from '@granit/openiddict-admin';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/** Fetches paginated admin users. */
export function useAdminUsers(
  params?: AdminUserListParams
): UseQueryResult<AdminUserPage> {
  const config = useAdminConfig();

  return useQuery({
    queryKey: [...buildAdminQueryKey(config, 'users'), params],
    queryFn: () => listUsers(config.client, config.basePath!, params),
  });
}

/** Fetches a single user by ID. Disabled when id is empty. */
export function useAdminUser(id: string): UseQueryResult<AdminUser> {
  const config = useAdminConfig();

  return useQuery({
    queryKey: [...buildAdminQueryKey(config, 'users'), id],
    queryFn: () => getUser(config.client, config.basePath!, id),
    enabled: id.length > 0,
  });
}

/** Creates a new admin user. Invalidates users on success. */
export function useCreateAdminUser(): UseMutationResult<
  AdminUser,
  Error,
  AdminUserCreateRequest
> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdminUserCreateRequest) =>
      createUser(config.client, config.basePath!, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'users'),
      });
    },
  });
}

/** Deletes a user (soft-delete). Invalidates users on success. */
export function useDeleteAdminUser(): UseMutationResult<void, Error, string> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(config.client, config.basePath!, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'users'),
      });
    },
  });
}

/** Impersonates a user. Returns new tokens. */
export function useImpersonateUser(): UseMutationResult<
  AdminImpersonationResult,
  Error,
  string
> {
  const config = useAdminConfig();

  return useMutation({
    mutationFn: (userId: string) => impersonateUser(config.client, config.basePath!, userId),
  });
}
