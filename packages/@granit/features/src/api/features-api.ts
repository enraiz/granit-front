import type {
  AdminFeatureFlag,
  FeatureGroup,
  FeatureValueResponse,
  FeatureValuesMap,
  SetFeatureOverrideRequest,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch all feature definitions grouped by category.
 *
 * `GET /features/definitions`
 */
export async function fetchFeatureDefinitions(
  client: AxiosInstance,
  basePath: string
): Promise<FeatureGroup[]> {
  const response = await client.get<FeatureGroup[]>(`${basePath}/features/definitions`);
  return response.data;
}

/**
 * Fetch all resolved feature values for the current context (tenant/plan/default).
 *
 * `GET /features/values`
 */
export async function fetchFeatureValues(
  client: AxiosInstance,
  basePath: string
): Promise<FeatureValuesMap> {
  const response = await client.get<FeatureValuesMap>(`${basePath}/features/values`);
  return response.data;
}

/**
 * Fetch a single resolved feature value by name.
 *
 * `GET /features/values/{name}`
 */
export async function fetchFeatureValue(
  client: AxiosInstance,
  basePath: string,
  name: string
): Promise<FeatureValueResponse> {
  const response = await client.get<FeatureValueResponse>(
    `${basePath}/features/values/${encodeURIComponent(name)}`
  );
  return response.data;
}

/**
 * Set a tenant-level feature override.
 *
 * `PUT /features/overrides/{name}`
 */
export async function setFeatureOverride(
  client: AxiosInstance,
  basePath: string,
  name: string,
  request: SetFeatureOverrideRequest
): Promise<void> {
  await client.put(`${basePath}/features/overrides/${encodeURIComponent(name)}`, request);
}

/**
 * Delete a tenant-level feature override (reverts to plan/default cascade).
 *
 * `DELETE /features/overrides/{name}`
 */
export async function deleteFeatureOverride(
  client: AxiosInstance,
  basePath: string,
  name: string
): Promise<void> {
  await client.delete(`${basePath}/features/overrides/${encodeURIComponent(name)}`);
}

// ── Admin endpoints ─────────────────────────────────────────────────────────

/**
 * Fetch all feature flags with admin metadata.
 *
 * `GET {basePath}/admin/config/flags`
 */
export async function fetchAdminFeatureFlags(
  client: AxiosInstance,
  basePath: string
): Promise<AdminFeatureFlag[]> {
  const response = await client.get<AdminFeatureFlag[]>(`${basePath}/admin/config/flags`);
  return response.data;
}

/**
 * Toggle a feature flag on or off.
 *
 * `PATCH {basePath}/admin/config/flags/{key}`
 */
export async function toggleAdminFeatureFlag(
  client: AxiosInstance,
  basePath: string,
  key: string,
  enabled: boolean
): Promise<void> {
  await client.patch(`${basePath}/admin/config/flags/${encodeURIComponent(key)}`, { enabled });
}
