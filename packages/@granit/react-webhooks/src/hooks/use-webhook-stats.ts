import { getStats, webhooksKeys } from '@granit/webhooks';
import { useQuery } from '@tanstack/react-query';

import type { WebhooksOptions } from './use-subscription.js';
import type { WebhookSubscriptionStatsResponse } from '@granit/webhooks';
import type { UseQueryResult } from '@tanstack/react-query';

const DEFAULT_BASE_PATH = '/api/v1/webhooks/subscriptions';

/**
 * Query hook that fetches aggregated webhook statistics.
 */
export function useWebhookStats(
  options: WebhooksOptions
): UseQueryResult<WebhookSubscriptionStatsResponse> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: webhooksKeys.stats(),
    queryFn: () => getStats(client, basePath),
  });
}
