import type { ExportPresetResponse, SaveExportPresetRequest } from '../types/export-preset.js';
import type { AxiosInstance } from 'axios';


/**
 * Fetches saved export presets for a given definition.
 *
 * `GET {basePath}/presets/{definitionName}`
 */
export async function fetchExportPresets(
  client: AxiosInstance,
  basePath: string,
  definitionName: string,
): Promise<readonly ExportPresetResponse[]> {
  const response = await client.get<ExportPresetResponse[]>(
    `${basePath}/presets/${encodeURIComponent(definitionName)}`,
  );
  return response.data;
}

/**
 * Saves or updates an export preset.
 *
 * `POST {basePath}/presets`
 */
export async function saveExportPreset(
  client: AxiosInstance,
  basePath: string,
  request: SaveExportPresetRequest,
): Promise<void> {
  await client.post(`${basePath}/presets`, request);
}

/**
 * Deletes a saved export preset.
 *
 * `DELETE {basePath}/presets/{definitionName}/{presetName}`
 */
export async function deleteExportPreset(
  client: AxiosInstance,
  basePath: string,
  definitionName: string,
  presetName: string,
): Promise<void> {
  await client.delete(
    `${basePath}/presets/${encodeURIComponent(definitionName)}/${encodeURIComponent(presetName)}`,
  );
}
