import type { MonitoringHealthResponse } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/** Default base path for the diagnostics API. */
export const DEFAULT_DIAGNOSTICS_BASE_PATH = '/api/granit/diagnostics';

/**
 * Fetch the monitoring health status of all registered services.
 *
 * `GET {basePath}/health`
 */
export async function fetchMonitoringHealth(
  client: AxiosInstance,
  basePath: string
): Promise<MonitoringHealthResponse> {
  const { data } = await client.get<MonitoringHealthResponse>(`${basePath}/health`);
  return data;
}
