import { useCallback } from 'react';

import { fetchEntityActivityFeed } from '../api/notification-api.js';
import { useNotificationContext } from '../providers/notification-provider.js';

import { usePaginatedFetch } from './use-paginated-fetch.js';

import type { ActivityFeedEntryDto, ActivityFeedPageDto } from '../types/index.js';

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
  options: UseEntityActivityFeedOptions
): UseEntityActivityFeedResult {
  const { entityType, entityId, pageSize = DEFAULT_PAGE_SIZE } = options;
  const { config } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const fetcher = useCallback(
    (page: number, ps: number) =>
      fetchEntityActivityFeed(config.apiClient, basePath, entityType, entityId, {
        page,
        pageSize: ps,
      }),
    [config.apiClient, basePath, entityType, entityId]
  );

  const {
    items: entries,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  } = usePaginatedFetch<ActivityFeedEntryDto, ActivityFeedPageDto>({
    fetcher,
    pageSize,
  });

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
