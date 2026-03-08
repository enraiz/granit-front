import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useNotifications } from '../hooks/use-notifications.js';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.js';

import type { NotificationDto, NotificationPageDto } from '../types/index.js';

const MOCK_NOTIFICATION: NotificationDto = {
  id: 'n-1',
  title: 'Nouveau message',
  body: 'Contenu du message',
  severity: 'info',
  entityType: null,
  entityId: null,
  isRead: false,
  createdAt: '2026-01-15T10:00:00Z',
  readAt: null,
};

const MOCK_PAGE: NotificationPageDto = {
  items: [MOCK_NOTIFICATION],
  totalCount: 1,
  nextCursor: null,
  unreadCount: 1,
};

describe('useNotifications', () => {
  it('should fetch notifications on mount', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PAGE));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Nouveau message');
    expect(result.current.totalCount).toBe(1);
  });

  it('should mark a notification as read', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PAGE));
    vi.mocked(client.patch).mockResolvedValue(
      axiosResponse({ ...MOCK_NOTIFICATION, isRead: true, readAt: '2026-01-15T10:05:00Z' })
    );

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.markRead('n-1');
    });

    expect(result.current.notifications[0].isRead).toBe(true);
  });

  it('should mark all as read', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PAGE));
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.markAllRead();
    });

    expect(result.current.notifications.every((n) => n.isRead)).toBe(true);
  });

  it('should report hasMore when totalCount > loaded items', async () => {
    const page: NotificationPageDto = {
      items: [MOCK_NOTIFICATION],
      totalCount: 50,
      nextCursor: null,
      unreadCount: 10,
    };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const { result } = renderHook(() => useNotifications({ pageSize: 20 }), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasMore).toBe(true);
  });

  it('should handle fetch errors', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should load more notifications when loadMore is called', async () => {
    const page1: NotificationPageDto = {
      items: [MOCK_NOTIFICATION],
      totalCount: 2,
      nextCursor: null,
      unreadCount: 2,
    };
    const n2: NotificationDto = {
      ...MOCK_NOTIFICATION,
      id: 'n-2',
      title: 'Deuxième notification',
    };
    const page2: NotificationPageDto = {
      items: [n2],
      totalCount: 2,
      nextCursor: null,
      unreadCount: 2,
    };

    const client = createMockClient();
    vi.mocked(client.get)
      .mockResolvedValueOnce(axiosResponse(page1))
      .mockResolvedValueOnce(axiosResponse(page2));

    const { result } = renderHook(() => useNotifications({ pageSize: 1 }), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.hasMore).toBe(true);

    await act(async () => {
      result.current.loadMore();
    });

    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(result.current.notifications).toHaveLength(2);
    expect(result.current.notifications[1].title).toBe('Deuxième notification');
  });

  it('should use custom pageSize option', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PAGE));

    const { result } = renderHook(() => useNotifications({ pageSize: 5 }), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.notifications).toHaveLength(1);
    expect(client.get).toHaveBeenCalledWith(
      expect.stringContaining('notifications'),
      expect.objectContaining({ params: expect.objectContaining({ pageSize: 5 }) })
    );
  });

  it('should refresh the notification list', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PAGE));

    const { result } = renderHook(() => useNotifications(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const updatedPage: NotificationPageDto = {
      items: [{ ...MOCK_NOTIFICATION, title: 'Mis à jour' }],
      totalCount: 1,
      nextCursor: null,
      unreadCount: 0,
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(updatedPage));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notifications[0].title).toBe('Mis à jour');
  });
});
