import {
  createRole,
  deleteRole,
  getRoleMembers,
  listRoles,
} from '@granit/openiddict-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buildAdminQueryKey, useAdminConfig } from '../providers/openiddict-admin-provider.js';

import type {
  AdminRole,
  AdminRoleCreateRequest,
  AdminRoleMember,
} from '@granit/openiddict-admin';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/** Fetches all roles. */
export function useAdminRoles(): UseQueryResult<readonly AdminRole[]> {
  const config = useAdminConfig();

  return useQuery({
    queryKey: buildAdminQueryKey(config, 'roles'),
    queryFn: () => listRoles(config.client, config.basePath!),
  });
}

/** Fetches members of a role. Disabled when roleName is empty. */
export function useAdminRoleMembers(
  roleName: string
): UseQueryResult<readonly AdminRoleMember[]> {
  const config = useAdminConfig();

  return useQuery({
    queryKey: [...buildAdminQueryKey(config, 'roles'), roleName, 'members'],
    queryFn: () => getRoleMembers(config.client, config.basePath!, roleName),
    enabled: roleName.length > 0,
  });
}

/** Creates a new role. Invalidates roles on success. */
export function useCreateAdminRole(): UseMutationResult<
  AdminRole,
  Error,
  AdminRoleCreateRequest
> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdminRoleCreateRequest) =>
      createRole(config.client, config.basePath!, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'roles'),
      });
    },
  });
}

/** Deletes a role. Invalidates roles on success. */
export function useDeleteAdminRole(): UseMutationResult<void, Error, string> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleName: string) => deleteRole(config.client, config.basePath!, roleName),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'roles'),
      });
    },
  });
}
