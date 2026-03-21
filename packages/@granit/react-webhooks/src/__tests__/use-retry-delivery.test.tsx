import { createTestQueryClient } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { webhooksKeys } from '@granit/webhooks';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useRetryDelivery } from '../hooks/use-retry-delivery.js';

function createWrapper() {
  const queryClient = createTestQueryClient();
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
}

describe('useRetryDelivery', () => {
  it('should send POST to /deliveries/{deliveryId}/retry and invalidate deliveries', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValueOnce({ data: undefined });

    const { wrapper, queryClient } = createWrapper();
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');

    const { result } = renderHook(() => useRetryDelivery({ client }), {
      wrapper,
    });

    result.current.mutate({
      deliveryId: 'del-001',
      subscriptionId: 'sub-001',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith('/api/v1/webhooks/deliveries/del-001/retry');
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: webhooksKeys.deliveries('sub-001'),
    });
  });

  it('should use custom basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValueOnce({ data: undefined });

    const { wrapper } = createWrapper();
    const { result } = renderHook(
      () => useRetryDelivery({ client, basePath: '/custom/webhooks' }),
      { wrapper }
    );

    result.current.mutate({
      deliveryId: 'del-002',
      subscriptionId: 'sub-001',
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.post).toHaveBeenCalledWith('/custom/webhooks/deliveries/del-002/retry');
  });

  it('should handle retry error', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockRejectedValueOnce(new Error('Not Found'));

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useRetryDelivery({ client }), {
      wrapper,
    });

    result.current.mutate({
      deliveryId: 'del-999',
      subscriptionId: 'sub-001',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Not Found');
  });
});
