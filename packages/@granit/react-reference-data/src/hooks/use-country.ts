import { useQuery } from '@tanstack/react-query';

import type { Country, CountriesListParams } from '@granit/reference-data';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';

/** Options for read hooks. */
export interface ReferenceDataHookOptions {
  /** Axios instance used for HTTP requests. */
  client: AxiosInstance;
  /** Base path for country read endpoints. Defaults to '/api/v1/reference-data/countries'. */
  basePath?: string;
}

const DEFAULT_BASE_PATH = '/api/v1/reference-data/countries';

/** Query key factory for country queries. */
export const countryKeys = {
  all: ['reference-data', 'countries'] as const,
  list: (params?: CountriesListParams) => [...countryKeys.all, 'list', params] as const,
  detail: (code: string) => [...countryKeys.all, 'detail', code] as const,
};

/**
 * Fetch all countries with optional filters.
 *
 * @example
 * ```tsx
 * const { data, isLoading } = useCountries({ client, basePath: '/api/v1/reference-data/countries' });
 * ```
 */
export function useCountries(
  options: ReferenceDataHookOptions & { params?: CountriesListParams; enabled?: boolean }
): UseQueryResult<Country[]> {
  const { client, basePath = DEFAULT_BASE_PATH, params, enabled = true } = options;

  return useQuery({
    queryKey: countryKeys.list(params),
    queryFn: async () => {
      const response = await client.get<Country[]>(basePath, { params });
      return response.data;
    },
    enabled,
  });
}

/**
 * Fetch a single country by its ISO 3166-1 alpha-2 code.
 *
 * @example
 * ```tsx
 * const { data: country } = useCountry('BE', { client });
 * ```
 */
export function useCountry(
  code: string,
  options: ReferenceDataHookOptions & { enabled?: boolean }
): UseQueryResult<Country> {
  const { client, basePath = DEFAULT_BASE_PATH, enabled = true } = options;

  return useQuery({
    queryKey: countryKeys.detail(code),
    queryFn: async () => {
      const response = await client.get<Country>(`${basePath}/${code}`);
      return response.data;
    },
    enabled: enabled && code.length > 0,
  });
}
