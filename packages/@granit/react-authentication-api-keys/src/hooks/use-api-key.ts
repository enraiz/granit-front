import { useQuery } from '@tanstack/react-query';

import { apiKeyKeys } from './use-api-keys.js';

import type { ApiKeyHookOptions } from './use-api-keys.js';
import type { ApiKeyResponse } from '@granit/authentication-api-keys';
import type { UseQueryResult } from '@tanstack/react-query';

const DEFAULT_BASE_PATH = '/api/v1/api-keys';

/**
 * Fetches a single API key by ID.
 *
 * Calls `GET {basePath}/{id}`.
 *
 * @param id - The API key ID to fetch.
 * @param options - Axios client and optional base path.
 *
 * @example
 * ```tsx
 * const { data: apiKey, isLoading } = useApiKey('key-123', { client: api });
 * ```
 */
export function useApiKey(id: string, options: ApiKeyHookOptions): UseQueryResult<ApiKeyResponse> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: apiKeyKeys.detail(id),
    queryFn: async () => {
      const response = await client.get<ApiKeyResponse>(`${basePath}/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}
