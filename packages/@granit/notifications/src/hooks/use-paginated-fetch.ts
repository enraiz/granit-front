import { useCallback, useEffect, useRef, useState } from 'react';

interface PaginatedPage<T> {
  items: T[];
  totalCount: number;
}

export interface UsePaginatedFetchOptions<T, P extends PaginatedPage<T>> {
  fetcher: (page: number, pageSize: number) => Promise<P>;
  pageSize: number;
  onSuccess?: (page: P) => void;
}

export interface UsePaginatedFetchResult<T> {
  items: T[];
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
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
 * Generic paginated fetch hook with abort-on-refetch, load-more, and refresh.
 */
export function usePaginatedFetch<T, P extends PaginatedPage<T>>(
  options: UsePaginatedFetchOptions<T, P>
): UsePaginatedFetchResult<T> {
  const { fetcher, pageSize = DEFAULT_PAGE_SIZE, onSuccess } = options;

  const [items, setItems] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchPage = useCallback(
    async (pageNumber: number, append: boolean) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const page = await fetcher(pageNumber, pageSize);

        if (controller.signal.aborted) return;

        setItems((prev) => (append ? [...prev, ...page.items] : page.items));
        setTotalCount(page.totalCount);
        onSuccess?.(page);
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
    [fetcher, pageSize, onSuccess]
  );

  useEffect(() => {
    setLoading(true);
    fetchPage(1, false);
    return () => abortRef.current?.abort();
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    const nextPage = Math.floor(items.length / pageSize) + 1;
    setLoadingMore(true);
    fetchPage(nextPage, true);
  }, [fetchPage, items.length, pageSize]);

  const refresh = useCallback(() => {
    setLoading(true);
    fetchPage(1, false);
  }, [fetchPage]);

  const hasMore = items.length < totalCount;

  return {
    items,
    setItems,
    totalCount,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    refresh,
  };
}
