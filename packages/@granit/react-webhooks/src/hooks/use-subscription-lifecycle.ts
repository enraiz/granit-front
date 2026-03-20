import {
  activateSubscription,
  deactivateSubscription,
  suspendSubscription,
  webhooksKeys,
} from '@granit/webhooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { WebhooksOptions } from './use-subscription.js';
import type {
  WebhookSubscriptionDeactivateRequest,
  WebhookSubscriptionResponse,
} from '@granit/webhooks';
import type { UseMutationResult } from '@tanstack/react-query';

const DEFAULT_BASE_PATH = '/api/v1/webhooks/subscriptions';

/**
 * Mutation hook to activate a suspended webhook subscription.
 *
 * Invalidates subscription queries on success.
 */
export function useActivateSubscription(
  options: WebhooksOptions
): UseMutationResult<WebhookSubscriptionResponse, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateSubscription(client, basePath, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}

/**
 * Mutation hook to suspend a webhook subscription.
 *
 * Invalidates subscription queries on success.
 */
export function useSuspendSubscription(
  options: WebhooksOptions
): UseMutationResult<WebhookSubscriptionResponse, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => suspendSubscription(client, basePath, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}

/**
 * Mutation hook to deactivate a webhook subscription permanently.
 *
 * Invalidates subscription queries on success.
 */
export function useDeactivateSubscription(
  options: WebhooksOptions
): UseMutationResult<
  WebhookSubscriptionResponse,
  Error,
  { id: string; request: WebhookSubscriptionDeactivateRequest }
> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => deactivateSubscription(client, basePath, id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}
