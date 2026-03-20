// ---------------------------------------------------------------------------
// QueryRequest validation — clamp/truncate to server-enforced limits
// ---------------------------------------------------------------------------

import { QUERY_LIMITS } from './query-limits.js';

import type { QueryRequest, SortEntry } from '../types/query-params.js';

/**
 * Serialize sort entries to the comma-separated format used by the backend.
 * Duplicated from the serializer to avoid circular imports.
 */
function serializeSortString(sort: readonly SortEntry[]): string {
  return sort.map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field)).join(',');
}

/**
 * Validate and clamp a QueryRequest to server-enforced limits.
 *
 * - Clamps page >= 1, pageSize to [1, 500]
 * - Truncates search, cursor, groupBy to max length
 * - Slices filters, quickFilters to max count
 * - Keeps first 20 preset entries
 * - Drops trailing sort entries when serialized length exceeds 500
 * - Enforces page/cursor mutual exclusion: cursor wins when both are set
 */
export function validateQueryRequest(params: QueryRequest): QueryRequest {
  const result: Record<string, unknown> = { ...params };

  // Page / cursor mutual exclusion — cursor wins
  if (params.cursor && params.page != null) {
    delete result.page;
  }

  // Page clamping
  if (result.page != null) {
    result.page = Math.max(QUERY_LIMITS.PAGE_MIN, result.page as number);
  }

  // PageSize clamping
  if (params.pageSize != null) {
    result.pageSize = Math.min(
      QUERY_LIMITS.PAGE_SIZE_MAX,
      Math.max(QUERY_LIMITS.PAGE_SIZE_MIN, params.pageSize)
    );
  }

  // String truncation
  if (params.search) {
    result.search = params.search.slice(0, QUERY_LIMITS.SEARCH_MAX_LENGTH);
  }
  if (params.cursor) {
    result.cursor = params.cursor.slice(0, QUERY_LIMITS.CURSOR_MAX_LENGTH);
  }
  if (params.groupBy) {
    result.groupBy = params.groupBy.slice(0, QUERY_LIMITS.GROUP_BY_MAX_LENGTH);
  }

  // Array slicing
  if (params.filters && params.filters.length > QUERY_LIMITS.FILTERS_MAX_COUNT) {
    result.filters = params.filters.slice(0, QUERY_LIMITS.FILTERS_MAX_COUNT);
  }
  if (params.quickFilters && params.quickFilters.length > QUERY_LIMITS.QUICK_FILTERS_MAX_COUNT) {
    result.quickFilters = params.quickFilters.slice(0, QUERY_LIMITS.QUICK_FILTERS_MAX_COUNT);
  }

  // Presets: keep first N entries
  if (params.presets) {
    const entries = Object.entries(params.presets);
    if (entries.length > QUERY_LIMITS.PRESETS_MAX_ENTRIES) {
      result.presets = Object.fromEntries(entries.slice(0, QUERY_LIMITS.PRESETS_MAX_ENTRIES));
    }
  }

  // Sort: drop trailing entries until serialized length fits
  if (params.sort && params.sort.length > 0) {
    let sort = [...params.sort];
    while (sort.length > 0 && serializeSortString(sort).length > QUERY_LIMITS.SORT_MAX_LENGTH) {
      sort = sort.slice(0, -1);
    }
    result.sort = sort;
  }

  return result as QueryRequest;
}
