import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useEntityActivityFeed } from '../hooks/use-entity-activity-feed.js';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.js';

import type { ActivityFeedPageDto } from '../types/index.js';


const MOCK_FEED: ActivityFeedPageDto = {
  items: [
    {
      id: 'a-1',
      title: 'Consultation ajoutée',
      body: null,
      severity: 'info',
      createdAt: '2026-01-15T10:00:00Z',
      userId: 'u-1',
      userDisplayName: 'Dr. Martin',
    },
  ],
  totalCount: 1,
};

describe('useEntityActivityFeed', () => {
  it('should fetch activity feed for an entity', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_FEED));

    const { result } = renderHook(
      () =>
        useEntityActivityFeed({
          entityType: 'Patient',
          entityId: 'p-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].title).toBe('Consultation ajoutée');
  });

  it('should handle fetch errors', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Server error'));

    const { result } = renderHook(
      () =>
        useEntityActivityFeed({
          entityType: 'Patient',
          entityId: 'p-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Server error');
  });

  it('should report hasMore correctly', async () => {
    const page: ActivityFeedPageDto = {
      items: [MOCK_FEED.items[0]],
      totalCount: 25,
    };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const { result } = renderHook(
      () =>
        useEntityActivityFeed({
          entityType: 'Patient',
          entityId: 'p-1',
          pageSize: 10,
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(true);
  });

  it('should load more entries when loadMore is called', async () => {
    const page1: ActivityFeedPageDto = {
      items: [MOCK_FEED.items[0]],
      totalCount: 2,
    };
    const entry2 = { ...MOCK_FEED.items[0], id: 'a-2', title: 'Deuxième entrée' };
    const page2: ActivityFeedPageDto = {
      items: [entry2],
      totalCount: 2,
    };

    const client = createMockClient();
    vi.mocked(client.get)
      .mockResolvedValueOnce(axiosResponse(page1))
      .mockResolvedValueOnce(axiosResponse(page2));

    const { result } = renderHook(
      () =>
        useEntityActivityFeed({
          entityType: 'Patient',
          entityId: 'p-1',
          pageSize: 1,
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(result.current.entries).toHaveLength(2);
    expect(result.current.entries[1].title).toBe('Deuxième entrée');
  });

  it('should refresh the feed', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_FEED));

    const { result } = renderHook(
      () =>
        useEntityActivityFeed({
          entityType: 'Patient',
          entityId: 'p-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const updatedFeed: ActivityFeedPageDto = {
      items: [{ ...MOCK_FEED.items[0], title: 'Mis à jour' }],
      totalCount: 1,
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(updatedFeed));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.entries[0].title).toBe('Mis à jour');
  });
});
