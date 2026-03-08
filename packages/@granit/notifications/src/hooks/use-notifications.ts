import { useCallback } from 'react';

import { fetchNotifications, markAllAsRead, markAsRead } from '../api/notification-api.js';
import { useNotificationContext } from '../providers/notification-provider.js';

import { usePaginatedFetch } from './use-paginated-fetch.js';

import type { NotificationDto, NotificationPageDto } from '../types/index.js';

export interface UseNotificationsOptions {
  pageSize?: number;
}

export interface UseNotificationsReturn {
  notifications: readonly NotificationDto[];
  totalCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const DEFAULT_PAGE_SIZE = 20;

/**
 * Paginated inbox hook — fetches notifications with load-more support.
 */
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { pageSize = DEFAULT_PAGE_SIZE } = options;
  const { config, setUnreadCount } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const fetcher = useCallback(
    (p: number, ps: number) =>
      fetchNotifications(config.apiClient, basePath, { page: p, pageSize: ps }),
    [config.apiClient, basePath]
  );

  const onSuccess = useCallback(
    (page: NotificationPageDto) => setUnreadCount(page.unreadCount),
    [setUnreadCount]
  );

  const {
    items: notifications,
    setItems: setNotifications,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedFetch<NotificationDto, NotificationPageDto>({
    fetcher,
    pageSize,
    onSuccess,
  });

  const markRead = useCallback(
    async (id: string) => {
      const updated = await markAsRead(config.apiClient, basePath, id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? updated : n)));
      setUnreadCount((prev: number) => Math.max(0, prev - 1));
    },
    [config.apiClient, basePath, setUnreadCount, setNotifications]
  );

  const markAllRead = useCallback(async () => {
    await markAllAsRead(config.apiClient, basePath);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
    );
    setUnreadCount(0);
  }, [config.apiClient, basePath, setUnreadCount, setNotifications]);

  return {
    notifications,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    markRead,
    markAllRead,
  };
}
