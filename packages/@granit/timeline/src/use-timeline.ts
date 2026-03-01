import { createLogger } from '@granit/logger';
import { useCallback, useEffect, useRef, useState } from 'react';


import { fetchStream } from './api.ts';
import { useTimelineConfig } from './timeline-provider.tsx';

import type { TimelineStreamEntry } from './types.ts';

const logger = createLogger('timeline');

const DEFAULT_PAGE_SIZE = 20;

export interface UseTimelineOptions {
  entityType: string;
  entityId: string;
  pageSize?: number;
}

export interface UseTimelineResult {
  entries: TimelineStreamEntry[];
  totalCount: number;
  loading: boolean;
  loadingMore: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => Promise<void>;
  addOptimisticEntry: (entry: TimelineStreamEntry) => void;
  removeOptimisticEntry: (entryId: string) => void;
}

export function useTimeline({
  entityType,
  entityId,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseTimelineOptions): UseTimelineResult {
  const { apiClient, basePath } = useTimelineConfig();

  const [entries, setEntries] = useState<TimelineStreamEntry[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const hasMore = entries.length < totalCount;

  const loadInitial = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const page = await fetchStream(apiClient, basePath, entityType, entityId, {
        skip: 0,
        take: pageSize,
      });

      if (!controller.signal.aborted) {
        setEntries(page.items);
        setTotalCount(page.totalCount);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to load timeline stream', wrapped);
        setError(wrapped);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiClient, basePath, entityType, entityId, pageSize]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const page = await fetchStream(apiClient, basePath, entityType, entityId, {
        skip: entries.length,
        take: pageSize,
      });

      setEntries((prev) => [...prev, ...page.items]);
      setTotalCount(page.totalCount);
    } catch (err) {
      const wrapped = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to load more timeline entries', wrapped);
      setError(wrapped);
    } finally {
      setLoadingMore(false);
    }
  }, [apiClient, basePath, entityType, entityId, pageSize, entries.length, loadingMore, hasMore]);

  const refresh = useCallback(async () => {
    await loadInitial();
  }, [loadInitial]);

  const addOptimisticEntry = useCallback((entry: TimelineStreamEntry) => {
    setEntries((prev) => [entry, ...prev]);
    setTotalCount((prev) => prev + 1);
  }, []);

  const removeOptimisticEntry = useCallback((entryId: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== entryId));
    setTotalCount((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    loadInitial().catch(() => {});
    return () => {
      abortRef.current?.abort();
    };
  }, [loadInitial]);

  return {
    entries,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
    addOptimisticEntry,
    removeOptimisticEntry,
  };
}
