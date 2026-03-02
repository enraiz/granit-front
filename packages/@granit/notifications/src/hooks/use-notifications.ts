import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchNotifications, markAllAsRead, markAsRead } from '../api/notification-api.js';
import { useNotificationContext } from '../providers/notification-provider.js';

import type { NotificationDto } from '../types/index.js';

export interface UseNotificationsOptions {
  pageSize?: number;
}

export interface UseNotificationsResult {
  notifications: NotificationDto[];
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
export function useNotifications(
  options: UseNotificationsOptions = {},
): UseNotificationsResult {
  const { pageSize = DEFAULT_PAGE_SIZE } = options;
  const { config, setUnreadCount } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (skip: number, append: boolean) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const page = await fetchNotifications(
          config.apiClient,
          basePath,
          { skip, take: pageSize },
        );

        if (controller.signal.aborted) return;

        setNotifications((prev) =>
          append ? [...prev, ...page.items] : page.items,
        );
        setTotalCount(page.totalCount);
        setUnreadCount(page.unreadCount);
        setError(null);
      } catch (err) {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [config.apiClient, basePath, pageSize, setUnreadCount],
  );

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchPage(0, false);
    return () => abortRef.current?.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    fetchPage(notifications.length, true);
  }, [fetchPage, notifications.length]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchPage(0, false);
  }, [fetchPage]);

  const markRead = useCallback(
    async (id: string) => {
      const updated = await markAsRead(config.apiClient, basePath, id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? updated : n)),
      );
      setUnreadCount((prev: number) => Math.max(0, prev - 1));
    },
    [config.apiClient, basePath, setUnreadCount],
  );

  const markAllRead = useCallback(async () => {
    await markAllAsRead(config.apiClient, basePath);
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true, readAt: new Date().toISOString() })),
    );
    setUnreadCount(0);
  }, [config.apiClient, basePath, setUnreadCount]);

  const hasMore = notifications.length < totalCount;

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
