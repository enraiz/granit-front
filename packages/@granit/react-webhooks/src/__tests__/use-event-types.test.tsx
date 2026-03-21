import { createTestQueryClient } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useEventTypes } from '../hooks/use-event-types.js';

import type { WebhookEventTypeResponse } from '@granit/webhooks';

vi.mock('@granit/webhooks', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    getEventTypes: vi.fn(),
  };
});

const { getEventTypes } = await import('@granit/webhooks');

function createWrapper() {
  const queryClient = createTestQueryClient();
  return {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    ),
    queryClient,
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

const mockEventTypes: WebhookEventTypeResponse[] = [
  {
    eventType: 'document.uploaded',
    displayName: 'Document Uploaded',
    description: 'Fired when a document is uploaded',
    category: 'Documents',
  },
];

describe('useEventTypes', () => {
  it('should fetch event types with default basePath', async () => {
    const client = createMockClient();
    vi.mocked(getEventTypes).mockResolvedValue(mockEventTypes);

    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useEventTypes({ client }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(getEventTypes).toHaveBeenCalledWith(client, '/api/v1/webhooks');
    expect(result.current.data).toEqual(mockEventTypes);
  });

  it('should use custom basePath', async () => {
    const client = createMockClient();
    vi.mocked(getEventTypes).mockResolvedValue([]);

    const { wrapper } = createWrapper();
    renderHook(() => useEventTypes({ client, basePath: '/custom' }), { wrapper });

    await waitFor(() => expect(getEventTypes).toHaveBeenCalledWith(client, '/custom'));
  });
});
