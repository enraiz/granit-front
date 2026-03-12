// ---------------------------------------------------------------------------
// Re-export from @granit/react-querying for backward compatibility.
// New code should import directly from @granit/react-querying.
// ---------------------------------------------------------------------------

export {
  useInfiniteScroll as usePaginatedFetch,
  type InfiniteScrollPage as PaginatedPage,
  type UseInfiniteScrollOptions as UsePaginatedFetchOptions,
  type UseInfiniteScrollReturn as UsePaginatedFetchReturn,
} from '@granit/react-querying';
