import type {
  SettingValueResponse,
  SettingsMap,
  UpdateSettingValueRequest,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch all visible settings for a scope.
 *
 * `GET /settings/{scope}`
 */
export async function fetchSettings(
  client: AxiosInstance,
  basePath: string,
  scope: string
): Promise<SettingsMap> {
  const response = await client.get<SettingsMap>(`${basePath}/settings/${scope}`);
  return response.data;
}

/**
 * Fetch a single setting by name.
 *
 * `GET /settings/{scope}/{name}`
 */
export async function fetchSetting(
  client: AxiosInstance,
  basePath: string,
  scope: string,
  name: string
): Promise<SettingValueResponse> {
  const response = await client.get<SettingValueResponse>(
    `${basePath}/settings/${scope}/${encodeURIComponent(name)}`
  );
  return response.data;
}

/**
 * Create or update a setting value.
 *
 * `PUT /settings/{scope}/{name}`
 */
export async function updateSetting(
  client: AxiosInstance,
  basePath: string,
  scope: string,
  name: string,
  request: UpdateSettingValueRequest
): Promise<void> {
  await client.put(`${basePath}/settings/${scope}/${encodeURIComponent(name)}`, request);
}

/**
 * Delete (reset) a setting value so the cascade takes over.
 *
 * `DELETE /settings/{scope}/{name}`
 */
export async function deleteSetting(
  client: AxiosInstance,
  basePath: string,
  scope: string,
  name: string
): Promise<void> {
  await client.delete(`${basePath}/settings/${scope}/${encodeURIComponent(name)}`);
}
