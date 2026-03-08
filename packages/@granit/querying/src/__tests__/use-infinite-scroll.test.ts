import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useInfiniteScroll } from '../hooks/use-infinite-scroll.js';

import type { InfiniteScrollPage } from '../hooks/use-infinite-scroll.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makePage<T>(items: T[], totalCount: number): InfiniteScrollPage<T> {
  return { items, totalCount };
}

function createFetcher(totalItems: number) {
  return vi.fn(async (page: number, pageSize: number) => {
    const start = (page - 1) * pageSize;
    const items = Array.from(
      { length: Math.min(pageSize, totalItems - start) },
      (_, i) => `item-${start + i}`
    );
    return makePage(items, totalItems);
  });
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useInfiniteScroll', () => {
  it('should load the first page on mount', async () => {
    const fetcher = createFetcher(50);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10 }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetcher).toHaveBeenCalledWith(1, 10);
    expect(result.current.items).toHaveLength(10);
    expect(result.current.totalCount).toBe(50);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.loadingMore).toBe(false);
  });

  it('should append items on loadMore', async () => {
    const fetcher = createFetcher(25);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toHaveLength(10);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));

    expect(result.current.items).toHaveLength(20);
    expect(result.current.hasMore).toBe(true);
    expect(fetcher).toHaveBeenCalledWith(2, 10);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));

    expect(result.current.items).toHaveLength(25);
    expect(result.current.hasMore).toBe(false);
  });

  it('should reset to first page on refresh', async () => {
    const fetcher = createFetcher(30);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));

    expect(result.current.items).toHaveLength(20);

    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.loading).toBe(false));

    // After refresh, only first page loaded
    expect(result.current.items).toHaveLength(10);
    expect(fetcher).toHaveBeenLastCalledWith(1, 10);
  });

  it('should handle fetch errors', async () => {
    const fetcher = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useInfiniteScroll({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
  });

  it('should wrap non-Error rejects', async () => {
    const fetcher = vi.fn().mockRejectedValue('string error');

    const { result } = renderHook(() => useInfiniteScroll({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('string error');
  });

  it('should call onSuccess for each page', async () => {
    const fetcher = createFetcher(20);
    const onSuccess = vi.fn();

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10, onSuccess }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(onSuccess).toHaveBeenCalledTimes(1);

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));
    expect(onSuccess).toHaveBeenCalledTimes(2);
  });

  it('should not fetch when enabled is false', async () => {
    const fetcher = createFetcher(10);

    const { result } = renderHook(() =>
      useInfiniteScroll({ fetcher, pageSize: 10, enabled: false })
    );

    expect(result.current.loading).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('should default pageSize to 20', async () => {
    const fetcher = createFetcher(100);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetcher).toHaveBeenCalledWith(1, 20);
  });

  it('should report hasMore=false when all items loaded', async () => {
    const fetcher = createFetcher(5);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10 }));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.items).toHaveLength(5);
    expect(result.current.hasMore).toBe(false);
  });

  it('should allow direct item manipulation via setItems', async () => {
    const fetcher = createFetcher(10);

    const { result } = renderHook(() => useInfiniteScroll({ fetcher, pageSize: 10 }));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setItems((prev) => ['prepended', ...prev]);
    });

    expect(result.current.items[0]).toBe('prepended');
    expect(result.current.items).toHaveLength(11);
  });

  it('should clear error on successful refetch', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue(makePage(['ok'], 1));

    const { result } = renderHook(() => useInfiniteScroll({ fetcher }));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeTruthy();

    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.items).toEqual(['ok']);
  });
});
