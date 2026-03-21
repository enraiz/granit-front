import {
  createSubscription,
  deleteSubscription,
  updateSubscription,
  webhooksKeys,
} from '@granit/webhooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_BASE_PATH } from '../constants.js';

import type { WebhooksOptions } from './use-subscription.js';
import type {
  WebhookSubscriptionCreateRequest,
  WebhookSubscriptionCreatedResponse,
  WebhookSubscriptionResponse,
  WebhookSubscriptionUpdateRequest,
} from '@granit/webhooks';
import type { UseMutationResult } from '@tanstack/react-query';

/**
 * Mutation hook to create a new webhook subscription.
 *
 * Returns the created subscription with the signing secret (shown once).
 * Invalidates subscription queries on success.
 */
export function useCreateSubscription(
  options: WebhooksOptions
): UseMutationResult<WebhookSubscriptionCreatedResponse, Error, WebhookSubscriptionCreateRequest> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: WebhookSubscriptionCreateRequest) =>
      createSubscription(client, basePath, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}

/**
 * Mutation hook to update a webhook subscription's target URL.
 *
 * Invalidates subscription queries on success.
 */
export function useUpdateSubscription(
  options: WebhooksOptions
): UseMutationResult<
  WebhookSubscriptionResponse,
  Error,
  { id: string; request: WebhookSubscriptionUpdateRequest }
> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }) => updateSubscription(client, basePath, id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}

/**
 * Mutation hook to delete a webhook subscription.
 *
 * Invalidates subscription queries on success.
 */
export function useDeleteSubscription(
  options: WebhooksOptions
): UseMutationResult<void, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSubscription(client, basePath, id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscriptions() });
    },
  });
}
