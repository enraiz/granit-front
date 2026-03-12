import type { IdentityProviderCapabilities } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch the active identity provider's capabilities.
 *
 * `GET {basePath}/capabilities`
 */
export async function fetchIdentityCapabilities(
  client: AxiosInstance,
  basePath: string
): Promise<IdentityProviderCapabilities> {
  const response = await client.get<IdentityProviderCapabilities>(`${basePath}/capabilities`);
  return response.data;
}
