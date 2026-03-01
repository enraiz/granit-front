import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkflowHistory } from '../use-workflow-history.ts';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.tsx';

import type { TransitionHistoryDto } from '../types.ts';

const sampleHistory: TransitionHistoryDto[] = [
  {
    previousState: 'Draft',
    newState: 'PendingReview',
    transitionedAt: '2026-01-10T09:00:00Z',
    transitionedBy: 'Dr. Martin',
    comment: 'Submitted for review',
  },
  {
    previousState: 'PendingReview',
    newState: 'Published',
    transitionedAt: '2026-01-11T14:00:00Z',
    transitionedBy: 'Dr. Marchand',
    comment: null,
  },
];

describe('useWorkflowHistory', () => {
  it('loads history on mount', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(sampleHistory));

    const { result } = renderHook(
      () => useWorkflowHistory({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.history).toHaveLength(2);
    expect(result.current.history[0].newState).toBe('PendingReview');
    expect(result.current.history[1].transitionedBy).toBe('Dr. Marchand');
  });

  it('sets error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(
      () => useWorkflowHistory({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error?.message).toBe('Not found');
    expect(result.current.history).toHaveLength(0);
  });

  it('does not fetch when enabled is false', async () => {
    const client = createMockClient();

    const { result } = renderHook(
      () => useWorkflowHistory({ entityType: 'Document', entityId: 'doc-1', enabled: false }),
      { wrapper: createWrapper(client) },
    );

    // Give time for any async call
    await new Promise((r) => setTimeout(r, 50));

    expect(client.get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.history).toHaveLength(0);
  });

  it('refetches when refetch is called', async () => {
    const client = createMockClient();
    vi.mocked(client.get)
      .mockResolvedValueOnce(axiosResponse([sampleHistory[0]]))
      .mockResolvedValueOnce(axiosResponse(sampleHistory));

    const { result } = renderHook(
      () => useWorkflowHistory({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.history).toHaveLength(1);

    await result.current.refetch();

    await waitFor(() => expect(result.current.history).toHaveLength(2));
  });
});
