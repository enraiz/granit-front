// ---------------------------------------------------------------------------
// Query param serializer — QueryParams → URL search string
// ---------------------------------------------------------------------------

import type { QueryParams } from '../types/query-params.js';

/**
 * Serialize QueryParams to a URL search string (without leading '?').
 *
 * Format:
 * ```
 * page=1&pageSize=20&search=text
 *   &filter[field.op]=value
 *   &sort=-createdAt,lastName
 *   &presets[group]=name1,name2
 *   &quickFilters=Name1,Name2
 *   &groupBy=field
 * ```
 */
function serializeScalarParams(
  entries: [string, string][],
  params: QueryParams,
): void {
  if (params.page != null) entries.push(['page', String(params.page)]);
  if (params.pageSize != null) entries.push(['pageSize', String(params.pageSize)]);
  if (params.cursor) entries.push(['cursor', params.cursor]);
  if (params.search) entries.push(['search', params.search]);
  if (params.groupBy) entries.push(['groupBy', params.groupBy]);
}

function serializeFilters(entries: [string, string][], params: QueryParams): void {
  if (!params.filters) return;
  for (const filter of params.filters) {
    entries.push([`filter[${filter.field}.${filter.operator}]`, filter.value]);
  }
}

function serializeSortAndPresets(entries: [string, string][], params: QueryParams): void {
  if (params.sort && params.sort.length > 0) {
    const sortStr = params.sort
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
    entries.push(['sort', sortStr]);
  }

  if (params.presets) {
    for (const [group, names] of Object.entries(params.presets)) {
      if (names.length > 0) {
        entries.push([`presets[${group}]`, names.join(',')]);
      }
    }
  }

  if (params.quickFilters && params.quickFilters.length > 0) {
    entries.push(['quickFilters', params.quickFilters.join(',')]);
  }
}

export function serializeQueryParams(params: QueryParams): string {
  const entries: [string, string][] = [];
  serializeScalarParams(entries, params);
  serializeFilters(entries, params);
  serializeSortAndPresets(entries, params);
  return new URLSearchParams(entries).toString();
}

/**
 * Parse a URL search string back into QueryParams.
 *
 * Inverse of {@link serializeQueryParams}.
 */
export function parseQueryParams(search: string): QueryParams {
  const url = new URLSearchParams(search);
  const params: {
    page?: number;
    pageSize?: number;
    cursor?: string;
    search?: string;
    filters?: { field: string; operator: string; value: string }[];
    sort?: { field: string; direction: 'asc' | 'desc' }[];
    presets?: Record<string, string[]>;
    quickFilters?: string[];
    groupBy?: string;
  } = {};

  const pageStr = url.get('page');
  if (pageStr) params.page = Number(pageStr);

  const pageSizeStr = url.get('pageSize');
  if (pageSizeStr) params.pageSize = Number(pageSizeStr);

  const cursor = url.get('cursor');
  if (cursor) params.cursor = cursor;

  const searchStr = url.get('search');
  if (searchStr) params.search = searchStr;

  // Parse filters: filter[field.op]=value
  const filterRegex = /^filter\[(.+)\.(\w+)\]$/;
  for (const [key, value] of url.entries()) {
    const match = filterRegex.exec(key);
    if (match) {
      params.filters ??= [];
      params.filters.push({
        field: match[1],
        operator: match[2],
        value,
      });
    }
  }

  // Parse sort: -field1,field2
  const sortStr = url.get('sort');
  if (sortStr) {
    params.sort = sortStr.split(',').map((part) => {
      if (part.startsWith('-')) {
        return { field: part.slice(1), direction: 'desc' as const };
      }
      return { field: part, direction: 'asc' as const };
    });
  }

  // Parse presets: presets[group]=name1,name2
  const presetRegex = /^presets\[(.+)\]$/;
  for (const [key, value] of url.entries()) {
    const match = presetRegex.exec(key);
    if (match) {
      params.presets ??= {};
      params.presets[match[1]] = value.split(',');
    }
  }

  // Parse quickFilters: quickFilters=Name1,Name2
  const quickFiltersStr = url.get('quickFilters');
  if (quickFiltersStr) {
    params.quickFilters = quickFiltersStr.split(',');
  }

  const groupBy = url.get('groupBy');
  if (groupBy) params.groupBy = groupBy;

  return params as QueryParams;
}
