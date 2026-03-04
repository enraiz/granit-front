import { createColumnHelper } from '@tanstack/react-table';

import { QueryView, useSmartFilter } from '@granit/querying';

import { mockMetadata, mockPatients, mockSavedViews } from './_mocks';

import type { UseQueryEndpointReturn, UseSavedViewsReturn } from '@granit/querying';
import type { SavedViewSummary } from '@granit/querying';
import type { Meta, StoryObj } from '@storybook/react-vite';

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

type Patient = (typeof mockPatients)[number];

const columnHelper = createColumnHelper<Patient>();

const columns = [
  columnHelper.accessor('id', { header: 'ID' }),
  columnHelper.accessor('lastName', { header: 'Last Name' }),
  columnHelper.accessor('firstName', { header: 'First Name' }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info) => info.getValue() || '-',
  }),
  columnHelper.accessor('status', { header: 'Status' }),
];

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: 'Querying/QueryView',
  component: QueryView<Patient>,
  tags: ['autodocs'],
} satisfies Meta<typeof QueryView<Patient>>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Mock UseQueryEndpointReturn
// ---------------------------------------------------------------------------

function createMockQueryEndpoint(): UseQueryEndpointReturn<Patient> {
  return {
    params: { page: 1, pageSize: 20 },
    query: {
      data: { items: [...mockPatients], totalCount: mockPatients.length },
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: 'success' as const,
    } as unknown as UseQueryEndpointReturn<Patient>['query'],
    groupedQuery: {
      data: undefined,
      isLoading: false,
      isError: false,
    } as unknown as UseQueryEndpointReturn<Patient>['groupedQuery'],
    isGrouped: false,
    setPage: (page: number) => {
      // eslint-disable-next-line no-console
      console.log('setPage:', page);
    },
    setPageSize: (pageSize: number) => {
      // eslint-disable-next-line no-console
      console.log('setPageSize:', pageSize);
    },
    setSearch: () => {},
    setFilters: () => {},
    addFilter: () => {},
    removeFilter: () => {},
    setSort: () => {},
    toggleSort: (field: string) => {
      // eslint-disable-next-line no-console
      console.log('toggleSort:', field);
    },
    setPresets: (group: string, names: readonly string[]) => {
      // eslint-disable-next-line no-console
      console.log('setPresets:', group, names);
    },
    setQuickFilters: () => {},
    toggleQuickFilter: () => {},
    setGroupBy: (groupBy: string | undefined) => {
      // eslint-disable-next-line no-console
      console.log('setGroupBy:', groupBy);
    },
    setParams: () => {},
    reset: () => {},
  };
}

// ---------------------------------------------------------------------------
// Mock UseSavedViewsReturn
// ---------------------------------------------------------------------------

function createMockSavedViews(views: SavedViewSummary[]): UseSavedViewsReturn {
  const noopMutation = {
    mutate: () => {},
    mutateAsync: () => Promise.resolve(undefined as never),
    isPending: false,
    isIdle: true,
    isSuccess: false,
    isError: false,
    error: null,
    data: undefined,
    variables: undefined,
    status: 'idle' as const,
    failureCount: 0,
    failureReason: null,
    reset: () => {},
    context: undefined,
    submittedAt: 0,
  };

  return {
    views: {
      data: views,
      isLoading: false,
      isError: false,
      error: null,
      isSuccess: true,
      status: 'success' as const,
      isFetching: false,
      isPending: false,
    } as unknown as UseSavedViewsReturn['views'],
    create: noopMutation as unknown as UseSavedViewsReturn['create'],
    update: noopMutation as unknown as UseSavedViewsReturn['update'],
    remove: noopMutation as unknown as UseSavedViewsReturn['remove'],
    setDefault: noopMutation as unknown as UseSavedViewsReturn['setDefault'],
  };
}

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function QueryViewInteractive() {
  const queryEndpoint = createMockQueryEndpoint();
  const smartFilter = useSmartFilter({ metadata: mockMetadata });
  const savedViews = createMockSavedViews(mockSavedViews);

  return (
    <QueryView
      metadata={mockMetadata}
      queryEndpoint={queryEndpoint}
      smartFilter={smartFilter}
      savedViews={savedViews}
      columns={columns}
      visibleColumns={mockMetadata.columns.map((c) => c.name)}
      onVisibleColumnsChange={(cols) => {
        // eslint-disable-next-line no-console
        console.log('Visible columns changed:', cols);
      }}
      selectedViewId="view-1"
      onSelectView={(view) => {
        // eslint-disable-next-line no-console
        console.log('View selected:', view);
      }}
    />
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => <QueryViewInteractive />,
};
