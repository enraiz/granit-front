import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchEntityActivityFeed } from '../api/notification-api.js';
import { useNotificationContext } from '../providers/notification-provider.js';

import type { ActivityFeedEntryDto } from '../types/index.js';

export interface UseEntityActivityFeedOptions {
  entityType: string;
  entityId: string;
  pageSize?: number;
}

export interface UseEntityActivityFeedResult {
  entries: ActivityFeedEntryDto[];
  totalCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

const DEFAULT_PAGE_SIZE = 20;

/**
 * Odoo-style activity feed scoped to a single entity.
 */
export function useEntityActivityFeed(
  options: UseEntityActivityFeedOptions,
): UseEntityActivityFeedResult {
  const { entityType, entityId, pageSize = DEFAULT_PAGE_SIZE } = options;
  const { config } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const [entries, setEntries] = useState<ActivityFeedEntryDto[]>([]);
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
        const page = await fetchEntityActivityFeed(
          config.apiClient,
          basePath,
          entityType,
          entityId,
          { skip, take: pageSize },
        );

        if (controller.signal.aborted) return;

        setEntries((prev) =>
          append ? [...prev, ...page.items] : page.items,
        );
        setTotalCount(page.totalCount);
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
    [config.apiClient, basePath, entityType, entityId, pageSize],
  );

  useEffect(() => {
    setLoading(true);
    void fetchPage(0, false);
    return () => abortRef.current?.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    void fetchPage(entries.length, true);
  }, [fetchPage, entries.length]);

  const refresh = useCallback(() => {
    setLoading(true);
    void fetchPage(0, false);
  }, [fetchPage]);

  const hasMore = entries.length < totalCount;

  return {
    entries,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
