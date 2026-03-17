import type { BackgroundJobStatus } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch the status of a specific background job by name.
 *
 * `GET {basePath}/{name}`
 */
export async function fetchBackgroundJob(
  client: AxiosInstance,
  basePath: string,
  name: string
): Promise<BackgroundJobStatus> {
  const { data } = await client.get<BackgroundJobStatus>(`${basePath}/${encodeURIComponent(name)}`);
  return data;
}
