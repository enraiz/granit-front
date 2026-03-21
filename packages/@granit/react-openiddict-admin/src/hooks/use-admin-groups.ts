import {
  addGroupMember,
  createGroup,
  deleteGroup,
  listGroups,
  removeGroupMember,
} from '@granit/openiddict-admin';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { buildAdminQueryKey, useAdminConfig } from '../providers/openiddict-admin-provider.js';

import type {
  AdminGroup,
  AdminGroupCreateRequest,
  AdminGroupMemberRequest,
} from '@granit/openiddict-admin';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';

/** Fetches all groups. */
export function useAdminGroups(): UseQueryResult<readonly AdminGroup[]> {
  const config = useAdminConfig();

  return useQuery({
    queryKey: buildAdminQueryKey(config, 'groups'),
    queryFn: () => listGroups(config.client, config.basePath!),
  });
}

/** Creates a new group. Invalidates groups on success. */
export function useCreateAdminGroup(): UseMutationResult<
  AdminGroup,
  Error,
  AdminGroupCreateRequest
> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: AdminGroupCreateRequest) =>
      createGroup(config.client, config.basePath!, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'groups'),
      });
    },
  });
}

/** Deletes a group. Invalidates groups on success. */
export function useDeleteAdminGroup(): UseMutationResult<void, Error, string> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => deleteGroup(config.client, config.basePath!, groupId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'groups'),
      });
    },
  });
}

/** Add group member variables. */
export interface AddGroupMemberVariables {
  readonly groupId: string;
  readonly request: AdminGroupMemberRequest;
}

/** Adds a user to a group. Invalidates groups on success. */
export function useAddGroupMember(): UseMutationResult<void, Error, AddGroupMemberVariables> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, request }: AddGroupMemberVariables) =>
      addGroupMember(config.client, config.basePath!, groupId, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'groups'),
      });
    },
  });
}

/** Remove group member variables. */
export interface RemoveGroupMemberVariables {
  readonly groupId: string;
  readonly userId: string;
}

/** Removes a user from a group. Invalidates groups on success. */
export function useRemoveGroupMember(): UseMutationResult<
  void,
  Error,
  RemoveGroupMemberVariables
> {
  const config = useAdminConfig();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: RemoveGroupMemberVariables) =>
      removeGroupMember(config.client, config.basePath!, groupId, userId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: buildAdminQueryKey(config, 'groups'),
      });
    },
  });
}
