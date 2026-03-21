import type {
  AdminGroup,
  AdminGroupCreateRequest,
  AdminGroupMemberRequest,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

// ── Group CRUD ───────────────────────────────────────────────────────────────

/**
 * List all groups.
 *
 * `GET {basePath}/groups`
 */
export async function listGroups(
  client: AxiosInstance,
  basePath: string
): Promise<readonly AdminGroup[]> {
  const { data } = await client.get<readonly AdminGroup[]>(`${basePath}/groups`);
  return data;
}

/**
 * Create a new group.
 *
 * `POST {basePath}/groups`
 */
export async function createGroup(
  client: AxiosInstance,
  basePath: string,
  request: AdminGroupCreateRequest
): Promise<AdminGroup> {
  const { data } = await client.post<AdminGroup>(`${basePath}/groups`, request);
  return data;
}

/**
 * Delete a group by ID.
 *
 * `DELETE {basePath}/groups/{groupId}`
 */
export async function deleteGroup(
  client: AxiosInstance,
  basePath: string,
  groupId: string
): Promise<void> {
  await client.delete(`${basePath}/groups/${encodeURIComponent(groupId)}`);
}

/**
 * Add a member to a group.
 *
 * `POST {basePath}/groups/{groupId}/members`
 */
export async function addGroupMember(
  client: AxiosInstance,
  basePath: string,
  groupId: string,
  request: AdminGroupMemberRequest
): Promise<void> {
  await client.post(
    `${basePath}/groups/${encodeURIComponent(groupId)}/members`,
    request
  );
}

/**
 * Remove a member from a group.
 *
 * `DELETE {basePath}/groups/{groupId}/members/{userId}`
 */
export async function removeGroupMember(
  client: AxiosInstance,
  basePath: string,
  groupId: string,
  userId: string
): Promise<void> {
  await client.delete(
    `${basePath}/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}`
  );
}
