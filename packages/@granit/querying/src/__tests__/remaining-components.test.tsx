import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { GroupBySelector } from '../components/group-by-selector.js';
import { QueryDataTable } from '../components/query-data-table/query-data-table.js';
import { useQueryMeta } from '../hooks/use-query-meta.js';
import { useSavedViews } from '../hooks/use-saved-views.js';
import { QueryProvider } from '../providers/query-provider.js';

import type { QueryConfig } from '../providers/query-provider.js';
import type { GroupByField } from '../types/query-metadata.js';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// GroupBySelector
// ---------------------------------------------------------------------------

describe('GroupBySelector', () => {
  const fields: GroupByField[] = [
    { name: 'Status', type: 'String' },
    { name: 'Department', type: 'String' },
  ];

  it('renders trigger button', () => {
    render(
      <GroupBySelector fields={fields} onValueChange={vi.fn()} />,
    );
    expect(screen.getByText('Group by')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <GroupBySelector fields={fields} onValueChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="group-by-selector"]')).toBeInTheDocument();
  });

  it('returns null when no fields', () => {
    const { container } = render(
      <GroupBySelector fields={[]} onValueChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="group-by-selector"]')).not.toBeInTheDocument();
  });

  it('shows active value in button', () => {
    render(
      <GroupBySelector fields={fields} value="Status" onValueChange={vi.fn()} />,
    );
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('shows dropdown with field names', async () => {
    const user = userEvent.setup();
    render(
      <GroupBySelector fields={fields} onValueChange={vi.fn()} />,
    );
    await user.click(screen.getByText('Group by'));
    expect(await screen.findByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Department')).toBeInTheDocument();
  });

  it('shows "No grouping" option when value is set', async () => {
    const user = userEvent.setup();
    render(
      <GroupBySelector fields={fields} value="Status" onValueChange={vi.fn()} />,
    );
    await user.click(screen.getByText('Status'));
    expect(await screen.findByText('No grouping')).toBeInTheDocument();
  });

  it('calls onValueChange with undefined when "No grouping" is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <GroupBySelector fields={fields} value="Status" onValueChange={onValueChange} />,
    );
    await user.click(screen.getByText('Status'));
    await user.click(await screen.findByText('No grouping'));
    expect(onValueChange).toHaveBeenCalledWith(undefined);
  });

  it('calls onValueChange with field name when a field is clicked', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <GroupBySelector fields={fields} onValueChange={onValueChange} />,
    );
    await user.click(screen.getByText('Group by'));
    await user.click(await screen.findByText('Department'));
    expect(onValueChange).toHaveBeenCalledWith('Department');
  });
});

// ---------------------------------------------------------------------------
// QueryDataTable
// ---------------------------------------------------------------------------

interface TestRow {
  id: string;
  name: string;
}

const testColumns: ColumnDef<TestRow, unknown>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'name', header: 'Name' },
];

const testData: TestRow[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

describe('QueryDataTable', () => {
  it('renders data rows', () => {
    render(
      <QueryDataTable
        columns={testColumns}
        data={testData}
        totalCount={2}
      />,
    );
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <QueryDataTable columns={testColumns} data={testData} totalCount={2} />,
    );
    expect(container.querySelector('[data-slot="query-data-table"]')).toBeInTheDocument();
  });

  it('shows empty state when no data', () => {
    render(
      <QueryDataTable columns={testColumns} data={[]} totalCount={0} />,
    );
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('shows custom empty message', () => {
    render(
      <QueryDataTable
        columns={testColumns}
        data={[]}
        totalCount={0}
        emptyMessage="Nothing to show"
      />,
    );
    expect(screen.getByText('Nothing to show')).toBeInTheDocument();
  });

  it('shows skeleton rows when loading', () => {
    const { container } = render(
      <QueryDataTable
        columns={testColumns}
        data={[]}
        totalCount={0}
        isLoading
        skeletonRows={3}
      />,
    );
    const skeletons = container.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBe(6); // 3 rows × 2 columns
  });

  it('renders sortable headers when onToggleSort provided', () => {
    render(
      <QueryDataTable
        columns={testColumns}
        data={testData}
        totalCount={2}
        onToggleSort={vi.fn()}
      />,
    );
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders pagination when handlers provided', () => {
    render(
      <QueryDataTable
        columns={testColumns}
        data={testData}
        totalCount={100}
        page={1}
        pageSize={20}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('does not render pagination when loading', () => {
    render(
      <QueryDataTable
        columns={testColumns}
        data={[]}
        totalCount={0}
        isLoading
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.queryByText('Page')).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// useQueryMeta & useSavedViews (need QueryProvider + TanStack Query)
// ---------------------------------------------------------------------------

const mockConfig: QueryConfig = {
  client: axios.create(),
  basePath: '/api/test',
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

describe('useQueryMeta', () => {
  it('returns a query result', () => {
    vi.spyOn(mockConfig.client, 'get').mockResolvedValue({
      data: { columns: [], filterableFields: [] },
    });
    const { result } = renderHook(() => useQueryMeta(), {
      wrapper: createWrapper(),
    });
    expect(result.current).toBeDefined();
    expect(result.current.isLoading).toBeDefined();
  });
});

describe('useSavedViews', () => {
  it('returns views query and mutation functions', () => {
    vi.spyOn(mockConfig.client, 'get').mockResolvedValue({ data: [] });
    const { result } = renderHook(() => useSavedViews(), {
      wrapper: createWrapper(),
    });
    expect(result.current.views).toBeDefined();
    expect(result.current.create).toBeDefined();
    expect(result.current.update).toBeDefined();
    expect(result.current.remove).toBeDefined();
    expect(result.current.setDefault).toBeDefined();
  });
});
