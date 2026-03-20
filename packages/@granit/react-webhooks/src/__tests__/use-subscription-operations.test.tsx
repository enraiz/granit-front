import { createTestQueryClient } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { webhooksKeys } from '@granit/webhooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useRotateSecret, useTestPing } from '../hooks/use-subscription-operations.js';

import type {
  WebhookSubscriptionRotateSecretResponse,
  WebhookSubscriptionTestPingResponse,
} from '@granit/webhooks';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe('useRotateSecret', () => {
  it('should send POST to /{id}/rotate-secret and invalidate subscription on success', async () => {
    const client = createMockClient();
    const response: WebhookSubscriptionRotateSecretResponse = {
      signingSecret: 'whsec_new456',
    };
    vi.mocked(client.post).mockResolvedValueOnce({ data: response });

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRotateSecret({ client }), { wrapper });

    result.current.mutate('sub-001');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith(
      '/api/v1/webhooks/subscriptions/sub-001/rotate-secret'
    );
    expect(result.current.data).toEqual(response);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: webhooksKeys.subscription('sub-001'),
    });
  });

  it('should handle rotation error', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockRejectedValueOnce(new Error('Forbidden'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRotateSecret({ client }), { wrapper });

    result.current.mutate('sub-001');

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Forbidden');
  });
});

describe('useTestPing', () => {
  it('should send POST to /{id}/test-ping', async () => {
    const client = createMockClient();
    const response: WebhookSubscriptionTestPingResponse = {
      success: true,
      httpStatusCode: 200,
      durationMs: 142,
    };
    vi.mocked(client.post).mockResolvedValueOnce({ data: response });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTestPing({ client }), { wrapper });

    result.current.mutate('sub-001');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith('/api/v1/webhooks/subscriptions/sub-001/test-ping');
    expect(result.current.data).toEqual(response);
  });

  it('should report failed ping', async () => {
    const client = createMockClient();
    const response: WebhookSubscriptionTestPingResponse = {
      success: false,
      httpStatusCode: 503,
      durationMs: 5012,
    };
    vi.mocked(client.post).mockResolvedValueOnce({ data: response });

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTestPing({ client }), { wrapper });

    result.current.mutate('sub-001');

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.success).toBe(false);
  });
});
