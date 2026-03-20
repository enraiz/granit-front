import { DEFAULT_DIAGNOSTICS_BASE_PATH, fetchMonitoringHealth } from '@granit/diagnostics';
import { useQuery } from '@tanstack/react-query';

import type { MonitoringHealthResponse } from '@granit/diagnostics';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';

/** Query key factory for diagnostics queries. */
export const diagnosticsKeys = {
  all: ['diagnostics'] as const,
  health: () => [...diagnosticsKeys.all, 'health'] as const,
};

/** Options accepted by the useMonitoringHealth hook. */
export interface MonitoringHealthOptions {
  /** Axios instance used for all requests. */
  readonly client: AxiosInstance;
  /** Base URL for the diagnostics API. Defaults to `/api/granit/diagnostics`. */
  readonly basePath?: string;
  /** Polling interval in milliseconds. Defaults to `30_000` (30 seconds). */
  readonly refetchInterval?: number;
}

/**
 * Query hook that fetches the monitoring health status of all registered services.
 *
 * Polls every 30 seconds by default to reflect live health state.
 *
 * @example
 * ```tsx
 * const { data } = useMonitoringHealth({ client: api });
 * // data.services, data.checkedAt
 * ```
 */
export function useMonitoringHealth(
  options: MonitoringHealthOptions
): UseQueryResult<MonitoringHealthResponse> {
  const { client, basePath = DEFAULT_DIAGNOSTICS_BASE_PATH, refetchInterval = 30_000 } = options;

  return useQuery({
    queryKey: diagnosticsKeys.health(),
    queryFn: () => fetchMonitoringHealth(client, basePath),
    staleTime: 30_000,
    refetchInterval,
  });
}
