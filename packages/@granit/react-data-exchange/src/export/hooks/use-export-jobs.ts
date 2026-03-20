import { fetchExportJobs } from '@granit/data-exchange';
import { useQuery } from '@tanstack/react-query';

import { buildExportQueryKey, useExportConfig } from '../providers/export-provider.js';

import type { PaginatedResponse } from '@granit/api-client';
import type { ExportJobListParams, ExportJobResponse } from '@granit/data-exchange';
import type { UseQueryResult } from '@tanstack/react-query';

/**
 * Query hook that fetches a paginated list of export jobs.
 *
 * @param params - Optional filtering/pagination parameters.
 *
 * @example
 * ```tsx
 * const { data } = useExportJobs({ status: 'Completed', page: 1, pageSize: 20 });
 * ```
 */
export function useExportJobs(
  params?: ExportJobListParams
): UseQueryResult<PaginatedResponse<ExportJobResponse>> {
  const config = useExportConfig();

  return useQuery({
    queryKey: buildExportQueryKey(
      config,
      'jobs',
      params?.status ?? '',
      String(params?.page ?? ''),
      String(params?.pageSize ?? '')
    ),
    queryFn: () => fetchExportJobs(config.client, config.basePath, params),
  });
}
