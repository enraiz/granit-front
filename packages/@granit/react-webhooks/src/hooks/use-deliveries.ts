import { getDeliveries, webhooksKeys } from '@granit/webhooks';
import { useQuery } from '@tanstack/react-query';

import type { WebhooksOptions } from './use-subscription.js';
import type { WebhookDeliveryAttemptResponse } from '@granit/webhooks';
import type { UseQueryResult } from '@tanstack/react-query';

const DEFAULT_BASE_PATH = '/api/v1/webhooks/subscriptions';

/**
 * Query hook that fetches delivery attempts for a specific subscription.
 *
 * The query is disabled when `subscriptionId` is empty.
 */
export function useDeliveries(
  subscriptionId: string,
  options: WebhooksOptions
): UseQueryResult<WebhookDeliveryAttemptResponse[]> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: webhooksKeys.deliveries(subscriptionId),
    queryFn: () => getDeliveries(client, basePath, subscriptionId),
    enabled: subscriptionId.length > 0,
  });
}
