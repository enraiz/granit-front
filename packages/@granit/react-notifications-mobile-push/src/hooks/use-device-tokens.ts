import { fetchDeviceTokens } from '@granit/notifications-mobile-push';
import { useQuery } from '@tanstack/react-query';

import type { MobilePushTokenResponse } from '@granit/notifications-mobile-push';
import type { UseQueryResult } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';

const DEFAULT_BASE_PATH = '/api/v1';

/** Options accepted by useDeviceTokens. */
export interface DeviceTokensOptions {
  /** Axios instance used for API calls. */
  readonly client: AxiosInstance;
  /** Base path for the notifications API. Defaults to `/api/v1`. */
  readonly basePath?: string;
}

/** Query key factory for device token queries. */
export const deviceTokenKeys = {
  all: ['device-tokens'] as const,
  list: () => [...deviceTokenKeys.all, 'list'] as const,
};

/**
 * Query hook that fetches all registered device tokens for the current user.
 *
 * @example
 * ```tsx
 * const { data: tokens } = useDeviceTokens({ client: api });
 * ```
 */
export function useDeviceTokens(
  options: DeviceTokensOptions
): UseQueryResult<readonly MobilePushTokenResponse[]> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: deviceTokenKeys.list(),
    queryFn: () => fetchDeviceTokens(client, basePath),
  });
}
