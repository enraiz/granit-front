import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { useQueryEndpoint } from '../hooks/use-query-endpoint.js';
import { QueryProvider } from '../providers/query-provider.js';

import type { QueryConfig } from '../providers/query-provider.js';
import type { ReactNode } from 'react';

const mockConfig: QueryConfig = {
  client: axios.create(),
  basePath: '/api/patients',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <QueryProvider config={mockConfig}>{children}</QueryProvider>
      </QueryClientProvider>
    );
  };
}

describe('useQueryEndpoint', () => {
  it('initializes with default params', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    expect(result.current.params.page).toBe(1);
    expect(result.current.params.pageSize).toBe(20);
    expect(result.current.isGrouped).toBe(false);
  });

  it('initializes with custom params', () => {
    const { result } = renderHook(
      () => useQueryEndpoint({ initialParams: { page: 2, pageSize: 50 } }),
      { wrapper: createWrapper() },
    );
    expect(result.current.params.page).toBe(2);
    expect(result.current.params.pageSize).toBe(50);
  });

  it('setPage updates page', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setPage(3));
    expect(result.current.params.page).toBe(3);
  });

  it('setPageSize updates pageSize and resets page to 1', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setPage(3));
    act(() => result.current.setPageSize(50));
    expect(result.current.params.pageSize).toBe(50);
    expect(result.current.params.page).toBe(1);
  });

  it('setSearch updates search and resets page', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setPage(3));
    act(() => result.current.setSearch('test'));
    expect(result.current.params.search).toBe('test');
    expect(result.current.params.page).toBe(1);
  });

  it('setSearch with empty string clears search', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setSearch('test'));
    act(() => result.current.setSearch(''));
    expect(result.current.params.search).toBeUndefined();
  });

  it('setFilters replaces all filters', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    const filters = [{ field: 'status', operator: 'Eq' as const, value: 'active' }];
    act(() => result.current.setFilters(filters));
    expect(result.current.params.filters).toEqual(filters);
  });

  it('addFilter adds a new filter', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.addFilter({ field: 'age', operator: 'Gte', value: '18' }));
    expect(result.current.params.filters).toHaveLength(1);
    expect(result.current.params.filters![0].field).toBe('age');
  });

  it('addFilter replaces filter with same field+operator', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.addFilter({ field: 'age', operator: 'Gte', value: '18' }));
    act(() => result.current.addFilter({ field: 'age', operator: 'Gte', value: '21' }));
    expect(result.current.params.filters).toHaveLength(1);
    expect(result.current.params.filters![0].value).toBe('21');
  });

  it('removeFilter removes by field', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.addFilter({ field: 'age', operator: 'Gte', value: '18' }));
    act(() => result.current.addFilter({ field: 'age', operator: 'Lte', value: '65' }));
    act(() => result.current.removeFilter('age'));
    expect(result.current.params.filters).toHaveLength(0);
  });

  it('removeFilter removes by field+operator', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.addFilter({ field: 'age', operator: 'Gte', value: '18' }));
    act(() => result.current.addFilter({ field: 'age', operator: 'Lte', value: '65' }));
    act(() => result.current.removeFilter('age', 'Gte'));
    expect(result.current.params.filters).toHaveLength(1);
    expect(result.current.params.filters![0].operator).toBe('Lte');
  });

  it('setSort replaces sort', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setSort([{ field: 'name', direction: 'asc' }]));
    expect(result.current.params.sort).toEqual([{ field: 'name', direction: 'asc' }]);
  });

  it('toggleSort cycles asc → desc → remove', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    // First click: asc
    act(() => result.current.toggleSort('name'));
    expect(result.current.params.sort).toEqual([{ field: 'name', direction: 'asc' }]);
    // Second click: desc
    act(() => result.current.toggleSort('name'));
    expect(result.current.params.sort).toEqual([{ field: 'name', direction: 'desc' }]);
    // Third click: remove
    act(() => result.current.toggleSort('name'));
    expect(result.current.params.sort).toEqual([]);
  });

  it('setPresets sets preset group', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setPresets('status', ['Active']));
    expect(result.current.params.presets).toEqual({ status: ['Active'] });
  });

  it('setQuickFilters replaces quick filters', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setQuickFilters(['MyItems', 'Unread']));
    expect(result.current.params.quickFilters).toEqual(['MyItems', 'Unread']);
  });

  it('toggleQuickFilter adds and removes', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.toggleQuickFilter('MyItems'));
    expect(result.current.params.quickFilters).toEqual(['MyItems']);
    act(() => result.current.toggleQuickFilter('MyItems'));
    expect(result.current.params.quickFilters).toEqual([]);
  });

  it('setGroupBy enables grouped mode', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setGroupBy('status'));
    expect(result.current.params.groupBy).toBe('status');
    expect(result.current.isGrouped).toBe(true);
  });

  it('setGroupBy(undefined) disables grouped mode', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setGroupBy('status'));
    act(() => result.current.setGroupBy(undefined));
    expect(result.current.isGrouped).toBe(false);
  });

  it('setParams replaces all params', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setParams({ page: 5, pageSize: 100, search: 'x' }));
    expect(result.current.params.page).toBe(5);
    expect(result.current.params.pageSize).toBe(100);
    expect(result.current.params.search).toBe('x');
  });

  it('reset restores initial params', () => {
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    act(() => result.current.setPage(5));
    act(() => result.current.setSearch('test'));
    act(() => result.current.reset());
    expect(result.current.params.page).toBe(1);
    expect(result.current.params.pageSize).toBe(20);
    expect(result.current.params.search).toBeUndefined();
  });

  it('provides query and groupedQuery results', () => {
    vi.spyOn(mockConfig.client, 'get').mockResolvedValue({
      data: { items: [], totalCount: 0 },
    });
    const { result } = renderHook(() => useQueryEndpoint(), {
      wrapper: createWrapper(),
    });
    expect(result.current.query).toBeDefined();
    expect(result.current.groupedQuery).toBeDefined();
  });
});
