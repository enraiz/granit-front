import { rotateSecret, testPing, webhooksKeys } from '@granit/webhooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DEFAULT_BASE_PATH } from '../constants.js';

import type { WebhooksOptions } from './use-subscription.js';
import type {
  WebhookSubscriptionRotateSecretResponse,
  WebhookSubscriptionTestPingResponse,
} from '@granit/webhooks';
import type { UseMutationResult } from '@tanstack/react-query';

/**
 * Mutation hook to rotate the signing secret of a subscription.
 *
 * The new secret is returned once — store it securely.
 * Invalidates the specific subscription query on success.
 */
export function useRotateSecret(
  options: WebhooksOptions
): UseMutationResult<WebhookSubscriptionRotateSecretResponse, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rotateSecret(client, basePath, id),
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: webhooksKeys.subscription(id) });
    },
  });
}

/**
 * Mutation hook to send a test ping to a subscription's target URL.
 */
export function useTestPing(
  options: WebhooksOptions
): UseMutationResult<WebhookSubscriptionTestPingResponse, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useMutation({
    mutationFn: (id: string) => testPing(client, basePath, id),
  });
}
