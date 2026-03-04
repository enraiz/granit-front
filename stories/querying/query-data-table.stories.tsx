import { createColumnHelper } from '@tanstack/react-table';

import { QueryDataTable } from '@granit/querying';

import { mockPatients } from './_mocks';

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
  title: 'Querying/QueryDataTable',
  component: QueryDataTable<Patient>,
  tags: ['autodocs'],
} satisfies Meta<typeof QueryDataTable<Patient>>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    columns,
    data: [...mockPatients],
    totalCount: 10,
    page: 1,
    pageSize: 20,
    onPageChange: (page: number) => {
      // eslint-disable-next-line no-console
      console.log('Page changed:', page);
    },
    onPageSizeChange: (pageSize: number) => {
      // eslint-disable-next-line no-console
      console.log('Page size changed:', pageSize);
    },
    onToggleSort: (field: string) => {
      // eslint-disable-next-line no-console
      console.log('Sort toggled:', field);
    },
  },
};

export const Loading: Story = {
  args: {
    columns,
    data: [],
    totalCount: 0,
    isLoading: true,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
    totalCount: 0,
    emptyMessage: 'No patients found.',
  },
};
