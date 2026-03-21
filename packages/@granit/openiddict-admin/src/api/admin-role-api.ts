import type {
  AdminRole,
  AdminRoleCreateRequest,
  AdminRoleMember,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

// ── Role CRUD ────────────────────────────────────────────────────────────────

/**
 * List all roles.
 *
 * `GET {basePath}/roles`
 */
export async function listRoles(
  client: AxiosInstance,
  basePath: string
): Promise<readonly AdminRole[]> {
  const { data } = await client.get<readonly AdminRole[]>(`${basePath}/roles`);
  return data;
}

/**
 * Create a new role.
 *
 * `POST {basePath}/roles`
 */
export async function createRole(
  client: AxiosInstance,
  basePath: string,
  request: AdminRoleCreateRequest
): Promise<AdminRole> {
  const { data } = await client.post<AdminRole>(`${basePath}/roles`, request);
  return data;
}

/**
 * Delete a role by name.
 *
 * `DELETE {basePath}/roles/{roleName}`
 */
export async function deleteRole(
  client: AxiosInstance,
  basePath: string,
  roleName: string
): Promise<void> {
  await client.delete(`${basePath}/roles/${encodeURIComponent(roleName)}`);
}

/**
 * Get members of a role.
 *
 * `GET {basePath}/roles/{roleName}/members`
 */
export async function getRoleMembers(
  client: AxiosInstance,
  basePath: string,
  roleName: string
): Promise<readonly AdminRoleMember[]> {
  const { data } = await client.get<readonly AdminRoleMember[]>(
    `${basePath}/roles/${encodeURIComponent(roleName)}/members`
  );
  return data;
}
