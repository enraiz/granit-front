import type {
  AdminImpersonationResult,
  AdminUser,
  AdminUserCreateRequest,
  AdminUserListParams,
  AdminUserPage,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

// ── User CRUD ────────────────────────────────────────────────────────────────

/**
 * List admin users with optional search and pagination.
 *
 * `GET {basePath}/users`
 */
export async function listUsers(
  client: AxiosInstance,
  basePath: string,
  params?: AdminUserListParams
): Promise<AdminUserPage> {
  const { data } = await client.get<AdminUserPage>(`${basePath}/users`, { params });
  return data;
}

/**
 * Get a single admin user by ID.
 *
 * `GET {basePath}/users/{id}`
 */
export async function getUser(
  client: AxiosInstance,
  basePath: string,
  id: string
): Promise<AdminUser> {
  const { data } = await client.get<AdminUser>(
    `${basePath}/users/${encodeURIComponent(id)}`
  );
  return data;
}

/**
 * Create a new admin user.
 *
 * `POST {basePath}/users`
 */
export async function createUser(
  client: AxiosInstance,
  basePath: string,
  request: AdminUserCreateRequest
): Promise<AdminUser> {
  const { data } = await client.post<AdminUser>(`${basePath}/users`, request);
  return data;
}

/**
 * Delete an admin user.
 *
 * `DELETE {basePath}/users/{id}`
 */
export async function deleteUser(
  client: AxiosInstance,
  basePath: string,
  id: string
): Promise<void> {
  await client.delete(`${basePath}/users/${encodeURIComponent(id)}`);
}

/**
 * Impersonate a user. Returns short-lived tokens.
 *
 * `POST {basePath}/users/{id}/impersonate`
 */
export async function impersonateUser(
  client: AxiosInstance,
  basePath: string,
  id: string
): Promise<AdminImpersonationResult> {
  const { data } = await client.post<AdminImpersonationResult>(
    `${basePath}/users/${encodeURIComponent(id)}/impersonate`
  );
  return data;
}
