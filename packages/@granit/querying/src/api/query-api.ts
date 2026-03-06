// ---------------------------------------------------------------------------
// Query API — data fetching functions
// ---------------------------------------------------------------------------

import { serializeQueryParams } from './query-param-serializer.js';

import type { QueryMetadata } from '../types/query-metadata.js';
import type { QueryParams } from '../types/query-params.js';
import type { GroupedResult, PagedResult } from '../types/query-results.js';
import type { AxiosInstance } from 'axios';

/**
 * Fetch a paginated page of results.
 *
 * @param client - Axios instance (from @granit/api-client)
 * @param basePath - API base path (e.g. "/api/v1/patients")
 * @param params - Query parameters
 */
export async function fetchPage<T>(
  client: AxiosInstance,
  basePath: string,
  params: QueryParams
): Promise<PagedResult<T>> {
  const qs = serializeQueryParams(params);
  const url = qs ? `${basePath}?${qs}` : basePath;
  const response = await client.get<PagedResult<T>>(url);
  return response.data;
}

/**
 * Fetch grouped results (when groupBy is specified).
 *
 * @param client - Axios instance (from @granit/api-client)
 * @param basePath - API base path (e.g. "/api/v1/patients")
 * @param params - Query parameters (must include groupBy)
 */
export async function fetchGrouped<T>(
  client: AxiosInstance,
  basePath: string,
  params: QueryParams
): Promise<GroupedResult<T>> {
  const qs = serializeQueryParams(params);
  const url = qs ? `${basePath}?${qs}` : basePath;
  const response = await client.get<GroupedResult<T>>(url);
  return response.data;
}

/**
 * Fetch query metadata (columns, filterable fields, presets, etc.).
 *
 * @param client - Axios instance (from @granit/api-client)
 * @param basePath - API base path (e.g. "/api/v1/patients")
 */
export async function fetchQueryMeta(
  client: AxiosInstance,
  basePath: string
): Promise<QueryMetadata> {
  const response = await client.get<QueryMetadata>(`${basePath}/meta`);
  return response.data;
}
