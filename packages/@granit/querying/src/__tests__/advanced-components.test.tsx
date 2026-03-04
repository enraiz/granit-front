import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Command } from 'cmdk';
import { describe, expect, it, vi } from 'vitest';


import { ColumnVisibility } from '../components/column-visibility.js';
import { QueryView } from '../components/query-view.js';
import { SavedViewSelector } from '../components/saved-view-selector.js';
import { FacetBadge } from '../components/smart-filter-bar/facet-badge.js';
import { SmartFilterBar } from '../components/smart-filter-bar/smart-filter-bar.js';
import { SuggestionList } from '../components/smart-filter-bar/suggestion-list.js';
import { QueryProvider } from '../providers/query-provider.js';

import type { UseQueryEndpointReturn } from '../hooks/use-query-endpoint.js';
import type { UseSavedViewsReturn } from '../hooks/use-saved-views.js';
import type { UseSmartFilterReturn } from '../hooks/use-smart-filter.js';
import type { QueryConfig } from '../providers/query-provider.js';
import type { ColumnDefinition, GroupByField } from '../types/query-metadata.js';
import type { FilterSuggestion, FilterToken, SmartFilterPhase } from '../types/smart-filter.js';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// SmartFilterBar
// ---------------------------------------------------------------------------

function createSmartFilterMock(overrides: Partial<UseSmartFilterReturn> = {}): UseSmartFilterReturn {
  return {
    phase: 'idle' as SmartFilterPhase,
    inputValue: '',
    tokens: [],
    suggestions: [],
    filters: [],
    search: undefined,
    presets: {},
    quickFilters: [],
    setInput: vi.fn(),
    selectField: vi.fn(),
    selectOperator: vi.fn(),
    confirmValue: vi.fn(),
    addPresetToken: vi.fn(),
    addQuickFilterToken: vi.fn(),
    addSearchToken: vi.fn(),
    removeToken: vi.fn(),
    clearAll: vi.fn(),
    cancel: vi.fn(),
    ...overrides,
  };
}

describe('SmartFilterBar', () => {
  it('renders with search icon and placeholder', () => {
    const smartFilter = createSmartFilterMock();
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.getByPlaceholderText('Search or filter...')).toBeInTheDocument();
  });

  it('renders custom placeholder', () => {
    const smartFilter = createSmartFilterMock();
    render(<SmartFilterBar smartFilter={smartFilter} placeholder="Find something..." />);
    expect(screen.getByPlaceholderText('Find something...')).toBeInTheDocument();
  });

  it('renders tokens as badges', () => {
    const tokens: FilterToken[] = [
      { id: 't-1', type: 'filter', label: 'Status = Active', field: 'Status', operator: 'Eq', value: 'Active' },
      { id: 't-2', type: 'search', label: 'Search: hello' },
    ];
    const smartFilter = createSmartFilterMock({ tokens });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.getByText('Status = Active')).toBeInTheDocument();
    expect(screen.getByText('Search: hello')).toBeInTheDocument();
  });

  it('shows clear all button when tokens exist', () => {
    const tokens: FilterToken[] = [
      { id: 't-1', type: 'filter', label: 'Status = Active', field: 'Status', operator: 'Eq', value: 'Active' },
    ];
    const smartFilter = createSmartFilterMock({ tokens });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.getByLabelText('Clear all filters')).toBeInTheDocument();
  });

  it('does not show clear all button when no tokens', () => {
    const smartFilter = createSmartFilterMock({ tokens: [] });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.queryByLabelText('Clear all filters')).not.toBeInTheDocument();
  });

  it('calls clearAll when clear button is clicked', async () => {
    const user = userEvent.setup();
    const clearAll = vi.fn();
    const tokens: FilterToken[] = [
      { id: 't-1', type: 'search', label: 'hello' },
    ];
    const smartFilter = createSmartFilterMock({ tokens, clearAll });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    await user.click(screen.getByLabelText('Clear all filters'));
    expect(clearAll).toHaveBeenCalledOnce();
  });

  it('has data-slot attribute', () => {
    const smartFilter = createSmartFilterMock();
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(container.querySelector('[data-slot="smart-filter-bar"]')).toBeInTheDocument();
  });

  it('shows phase hint for enterValue', () => {
    const smartFilter = createSmartFilterMock({ phase: 'enterValue' });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.getByPlaceholderText('Enter value, press Enter')).toBeInTheDocument();
  });

  it('shows phase hint for selectOperator', () => {
    const smartFilter = createSmartFilterMock({ phase: 'selectOperator' });
    render(<SmartFilterBar smartFilter={smartFilter} />);
    expect(screen.getByPlaceholderText('Select operator')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const smartFilter = createSmartFilterMock();
    const { container } = render(
      <SmartFilterBar smartFilter={smartFilter} className="my-class" />,
    );
    expect(container.querySelector('.my-class')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SavedViewSelector
// ---------------------------------------------------------------------------

function createSavedViewsMock(overrides: Partial<UseSavedViewsReturn> = {}): UseSavedViewsReturn {
  return {
    views: { data: [], isLoading: false, isSuccess: true } as unknown as UseSavedViewsReturn['views'],
    create: { mutate: vi.fn(), isPending: false } as unknown as UseSavedViewsReturn['create'],
    update: { mutate: vi.fn(), isPending: false } as unknown as UseSavedViewsReturn['update'],
    remove: { mutate: vi.fn(), isPending: false } as unknown as UseSavedViewsReturn['remove'],
    setDefault: { mutate: vi.fn(), isPending: false } as unknown as UseSavedViewsReturn['setDefault'],
    ...overrides,
  };
}

describe('SavedViewSelector', () => {
  it('renders trigger button with Views label', () => {
    const savedViews = createSavedViewsMock();
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    expect(screen.getByText('Views')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const savedViews = createSavedViewsMock();
    const { container } = render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="saved-view-selector"]')).toBeInTheDocument();
  });

  it('shows dropdown with "No saved views" when empty', async () => {
    const user = userEvent.setup();
    const savedViews = createSavedViewsMock();
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    expect(await screen.findByText('No saved views')).toBeInTheDocument();
    expect(screen.getByText('Save current view')).toBeInTheDocument();
  });

  it('shows saved views in dropdown', async () => {
    const user = userEvent.setup();
    const savedViews = createSavedViewsMock({
      views: {
        data: [
          { id: 'v-1', name: 'My View', isDefault: false, isShared: false },
          { id: 'v-2', name: 'Default View', isDefault: true, isShared: false },
        ],
        isLoading: false,
        isSuccess: true,
      } as unknown as UseSavedViewsReturn['views'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    expect(await screen.findByText('My View')).toBeInTheDocument();
    expect(screen.getByText('Default View')).toBeInTheDocument();
  });

  it('calls onSelect when a view is clicked', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const savedViews = createSavedViewsMock({
      views: {
        data: [{ id: 'v-1', name: 'My View', isDefault: false, isShared: false }],
        isLoading: false,
        isSuccess: true,
      } as unknown as UseSavedViewsReturn['views'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={onSelect} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByText('My View'));
    expect(onSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'v-1', name: 'My View' }),
    );
  });

  it('opens create dialog when "Save current view" is clicked', async () => {
    const user = userEvent.setup();
    const savedViews = createSavedViewsMock();
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByText('Save current view'));
    expect(await screen.findByText('Save view')).toBeInTheDocument();
    expect(screen.getByLabelText('View name')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// QueryView
// ---------------------------------------------------------------------------

const mockQueryConfig: QueryConfig = {
  client: axios.create(),
  basePath: '/api/test',
};

function createQueryWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <QueryProvider config={mockQueryConfig}>{children}</QueryProvider>
      </QueryClientProvider>
    );
  };
}

interface TestRow {
  id: string;
  name: string;
}

const testColumns: ColumnDef<TestRow, unknown>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
];

describe('QueryView', () => {
  it('renders with SmartFilterBar and DataTable', () => {
    const smartFilter = createSmartFilterMock();
    const queryEndpoint = {
      query: {
        data: { items: [{ id: '1', name: 'Alice' }], totalCount: 1 },
        isLoading: false,
      },
      groupedQuery: { data: undefined, isLoading: false },
      isGrouped: false,
      params: { page: 1, pageSize: 20, sort: [], presets: {}, filters: [], search: '', groupBy: undefined },
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      toggleSort: vi.fn(),
      setSearch: vi.fn(),
      setFilters: vi.fn(),
      addFilter: vi.fn(),
      removeFilter: vi.fn(),
      setSort: vi.fn(),
      setPresets: vi.fn(),
      setQuickFilters: vi.fn(),
      toggleQuickFilter: vi.fn(),
      setGroupBy: vi.fn(),
      setParams: vi.fn(),
    } as unknown as UseQueryEndpointReturn<TestRow>;

    const Wrapper = createQueryWrapper();
    const { container } = render(
      <Wrapper>
        <QueryView
          metadata={{
            columns: [],
            filterableFields: [],
            sortableFields: [],
            presetFilterGroups: [],
            quickFilters: [],
            dateFilters: [],
            groupByFields: [],
            pagination: { defaultPageSize: 20, maxPageSize: 100, supportsCursor: false },
          }}
          queryEndpoint={queryEndpoint}
          smartFilter={smartFilter}
          columns={testColumns}
        />
      </Wrapper>,
    );

    expect(container.querySelector('[data-slot="query-view"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="smart-filter-bar"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="query-data-table"]')).toBeInTheDocument();
  });

  it('renders with toolbar controls when metadata has groups', () => {
    const smartFilter = createSmartFilterMock();
    const groupByFields: GroupByField[] = [
      { name: 'Status', type: 'String' },
    ];
    const queryEndpoint = {
      query: {
        data: { items: [], totalCount: 0 },
        isLoading: false,
      },
      groupedQuery: { data: undefined, isLoading: false },
      isGrouped: false,
      params: { page: 1, pageSize: 20, sort: [], presets: {}, filters: [], search: '', groupBy: undefined },
      setPage: vi.fn(),
      setPageSize: vi.fn(),
      toggleSort: vi.fn(),
      setSearch: vi.fn(),
      setFilters: vi.fn(),
      addFilter: vi.fn(),
      removeFilter: vi.fn(),
      setSort: vi.fn(),
      setPresets: vi.fn(),
      setQuickFilters: vi.fn(),
      toggleQuickFilter: vi.fn(),
      setGroupBy: vi.fn(),
      setParams: vi.fn(),
    } as unknown as UseQueryEndpointReturn<TestRow>;

    const Wrapper = createQueryWrapper();
    const { container } = render(
      <Wrapper>
        <QueryView
          metadata={{
            columns: [],
            filterableFields: [],
            sortableFields: [],
            presetFilterGroups: [],
            quickFilters: [],
            dateFilters: [],
            groupByFields,
            pagination: { defaultPageSize: 20, maxPageSize: 100, supportsCursor: false },
          }}
          queryEndpoint={queryEndpoint}
          smartFilter={smartFilter}
          columns={testColumns}
        />
      </Wrapper>,
    );

    expect(container.querySelector('[data-slot="group-by-selector"]')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// ColumnVisibility — checkbox toggle behavior
// ---------------------------------------------------------------------------

describe('ColumnVisibility — toggle', () => {
  const columns: ColumnDefinition[] = [
    { name: 'Name', label: 'Name', type: 'String', order: 0, isSortable: true, isFilterable: true, isVisible: true },
    { name: 'Age', label: 'Age', type: 'Int32', order: 1, isSortable: true, isFilterable: true, isVisible: true },
  ];

  it('calls onVisibilityChange to add a column', async () => {
    const user = userEvent.setup();
    const onVisibilityChange = vi.fn();
    render(
      <ColumnVisibility
        columns={columns}
        visibleColumns={['Name']}
        onVisibilityChange={onVisibilityChange}
      />,
    );
    await user.click(screen.getByText('Columns'));
    const ageCheckbox = await screen.findByText('Age');
    await user.click(ageCheckbox);
    expect(onVisibilityChange).toHaveBeenCalledWith(['Name', 'Age']);
  });

  it('calls onVisibilityChange to remove a column', async () => {
    const user = userEvent.setup();
    const onVisibilityChange = vi.fn();
    render(
      <ColumnVisibility
        columns={columns}
        visibleColumns={['Name', 'Age']}
        onVisibilityChange={onVisibilityChange}
      />,
    );
    await user.click(screen.getByText('Columns'));
    const nameCheckbox = await screen.findByText('Name');
    await user.click(nameCheckbox);
    expect(onVisibilityChange).toHaveBeenCalledWith(['Age']);
  });
});

// ---------------------------------------------------------------------------
// SmartFilterBar — keyboard handling & suggestion selection
// ---------------------------------------------------------------------------

describe('SmartFilterBar — keyboard handling', () => {
  it('calls addSearchToken on Enter in idle phase', () => {
    const addSearchToken = vi.fn();
    const smartFilter = createSmartFilterMock({
      phase: 'idle',
      inputValue: 'hello',
      addSearchToken,
    });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(addSearchToken).toHaveBeenCalledWith('hello');
  });

  it('calls addSearchToken on Enter in selectField phase', () => {
    const addSearchToken = vi.fn();
    const smartFilter = createSmartFilterMock({
      phase: 'selectField',
      inputValue: 'test',
      addSearchToken,
    });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(addSearchToken).toHaveBeenCalledWith('test');
  });

  it('calls confirmValue on Enter in enterValue phase', () => {
    const confirmValue = vi.fn();
    const smartFilter = createSmartFilterMock({
      phase: 'enterValue',
      inputValue: '42',
      confirmValue,
    });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(confirmValue).toHaveBeenCalledWith('42');
  });

  it('does nothing on Enter with empty input', () => {
    const addSearchToken = vi.fn();
    const confirmValue = vi.fn();
    const smartFilter = createSmartFilterMock({
      phase: 'idle',
      inputValue: '',
      addSearchToken,
      confirmValue,
    });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(addSearchToken).not.toHaveBeenCalled();
    expect(confirmValue).not.toHaveBeenCalled();
  });

  it('calls cancel on Escape', () => {
    const cancel = vi.fn();
    const smartFilter = createSmartFilterMock({ cancel });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(cancel).toHaveBeenCalledOnce();
  });

  it('calls removeToken on Backspace when input is empty and tokens exist', () => {
    const removeToken = vi.fn();
    const tokens: FilterToken[] = [
      { id: 't-1', type: 'search', label: 'hello' },
      { id: 't-2', type: 'search', label: 'world' },
    ];
    const smartFilter = createSmartFilterMock({ tokens, inputValue: '', removeToken });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(removeToken).toHaveBeenCalledWith('t-2');
  });

  it('does not call removeToken on Backspace when input has text', () => {
    const removeToken = vi.fn();
    const tokens: FilterToken[] = [{ id: 't-1', type: 'search', label: 'hello' }];
    const smartFilter = createSmartFilterMock({ tokens, inputValue: 'abc', removeToken });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(removeToken).not.toHaveBeenCalled();
  });

  it('does not call removeToken on Backspace when no tokens', () => {
    const removeToken = vi.fn();
    const smartFilter = createSmartFilterMock({ tokens: [], inputValue: '', removeToken });
    const { container } = render(<SmartFilterBar smartFilter={smartFilter} />);
    const input = container.querySelector('[data-slot="smart-filter-input"]')!;
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(removeToken).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// FacetBadge
// ---------------------------------------------------------------------------

describe('FacetBadge', () => {
  it('renders token label', () => {
    const token: FilterToken = { id: 't-1', type: 'filter', label: 'Status = Active', field: 'Status', operator: 'Eq', value: 'Active' };
    render(<FacetBadge token={token} onRemove={vi.fn()} />);
    expect(screen.getByText('Status = Active')).toBeInTheDocument();
  });

  it('calls onRemove when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    const token: FilterToken = { id: 't-1', type: 'filter', label: 'Status = Active', field: 'Status', operator: 'Eq', value: 'Active' };
    render(<FacetBadge token={token} onRemove={onRemove} />);
    await user.click(screen.getByLabelText('Remove Status = Active'));
    expect(onRemove).toHaveBeenCalledWith('t-1');
  });

  it('has data-slot and data-token-type attributes', () => {
    const token: FilterToken = { id: 't-1', type: 'search', label: 'hello' };
    const { container } = render(<FacetBadge token={token} onRemove={vi.fn()} />);
    const badge = container.querySelector('[data-slot="facet-badge"]');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute('data-token-type', 'search');
  });
});

// ---------------------------------------------------------------------------
// SuggestionList
// ---------------------------------------------------------------------------

describe('SuggestionList', () => {
  it('renders empty state when no suggestions', () => {
    const { container } = render(
      <Command>
        <SuggestionList suggestions={[]} onSelect={vi.fn()} />
      </Command>,
    );
    expect(container.querySelector('[data-slot="suggestion-empty"]')).toBeInTheDocument();
  });

  it('renders suggestion items', () => {
    const suggestions: FilterSuggestion[] = [
      { id: 's-1', type: 'filter', label: 'Name', field: 'Name' },
      { id: 's-2', type: 'filter', label: 'Status', field: 'Status', description: 'Filter by status' },
    ];
    const { container } = render(
      <Command>
        <SuggestionList suggestions={suggestions} onSelect={vi.fn()} />
      </Command>,
    );
    expect(container.querySelector('[data-slot="suggestion-list"]')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Filter by status')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// SavedViewSelector — CRUD interactions
// ---------------------------------------------------------------------------

describe('SavedViewSelector — CRUD', () => {
  it('submits create form and calls create.mutate', async () => {
    const user = userEvent.setup();
    const mutateFn = vi.fn((_data: unknown, opts?: { onSuccess?: () => void }) => {
      opts?.onSuccess?.();
    });
    const savedViews = createSavedViewsMock({
      create: { mutate: mutateFn, isPending: false } as unknown as UseSavedViewsReturn['create'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} onSave={() => ({ filterJson: '{}' })} />,
    );

    // Open dropdown and create dialog
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByText('Save current view'));

    // Fill in and submit
    const input = await screen.findByLabelText('View name');
    await user.type(input, 'My Report');
    await user.click(screen.getByText('Save'));

    expect(mutateFn).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'My Report', filterJson: '{}' }),
      expect.anything(),
    );
  });

  it('does not submit when name is empty', async () => {
    const user = userEvent.setup();
    const mutateFn = vi.fn();
    const savedViews = createSavedViewsMock({
      create: { mutate: mutateFn, isPending: false } as unknown as UseSavedViewsReturn['create'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByText('Save current view'));
    // Save button should be disabled when empty
    expect(screen.getByText('Save')).toBeDisabled();
  });

  it('cancels create dialog', async () => {
    const user = userEvent.setup();
    const savedViews = createSavedViewsMock();
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByText('Save current view'));
    expect(await screen.findByText('Save view')).toBeInTheDocument();

    await user.click(screen.getByText('Cancel'));
    // Dialog title should be gone after cancel
    expect(screen.queryByText('Save view')).not.toBeInTheDocument();
  });

  it('calls remove.mutate when delete is clicked', async () => {
    const user = userEvent.setup();
    const removeMutate = vi.fn();
    const savedViews = createSavedViewsMock({
      views: {
        data: [{ id: 'v-1', name: 'My View', isDefault: false, isShared: false }],
        isLoading: false,
        isSuccess: true,
      } as unknown as UseSavedViewsReturn['views'],
      remove: { mutate: removeMutate, isPending: false } as unknown as UseSavedViewsReturn['remove'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByLabelText('Delete My View'));
    expect(removeMutate).toHaveBeenCalledWith('v-1');
  });

  it('calls setDefault.mutate when star is clicked for non-default view', async () => {
    const user = userEvent.setup();
    const setDefaultMutate = vi.fn();
    const savedViews = createSavedViewsMock({
      views: {
        data: [{ id: 'v-1', name: 'My View', isDefault: false, isShared: false }],
        isLoading: false,
        isSuccess: true,
      } as unknown as UseSavedViewsReturn['views'],
      setDefault: { mutate: setDefaultMutate, isPending: false } as unknown as UseSavedViewsReturn['setDefault'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await user.click(await screen.findByLabelText('Set My View as default'));
    expect(setDefaultMutate).toHaveBeenCalledWith('v-1');
  });

  it('does not show set-default button for default views', async () => {
    const user = userEvent.setup();
    const savedViews = createSavedViewsMock({
      views: {
        data: [{ id: 'v-1', name: 'Default View', isDefault: true, isShared: false }],
        isLoading: false,
        isSuccess: true,
      } as unknown as UseSavedViewsReturn['views'],
    });
    render(
      <SavedViewSelector savedViews={savedViews} onSelect={vi.fn()} />,
    );
    await user.click(screen.getByText('Views'));
    await screen.findByText('Default View');
    expect(screen.queryByLabelText('Set Default View as default')).not.toBeInTheDocument();
  });
});
