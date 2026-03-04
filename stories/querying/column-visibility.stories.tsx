import { useState } from 'react';

import { ColumnVisibility } from '@granit/querying';

import { mockColumns } from './_mocks';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/ColumnVisibility',
  component: ColumnVisibility,
  tags: ['autodocs'],
} satisfies Meta<typeof ColumnVisibility>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function ColumnVisibilityInteractive({
  initialVisible,
}: {
  readonly initialVisible: readonly string[];
}) {
  const [visibleColumns, setVisibleColumns] = useState<readonly string[]>(initialVisible);

  return (
    <div className="flex flex-col gap-4">
      <ColumnVisibility
        columns={mockColumns}
        visibleColumns={visibleColumns}
        onVisibilityChange={setVisibleColumns}
      />
      <p className="text-sm text-muted-foreground">
        Visible: {visibleColumns.join(', ')}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

const allColumnNames = mockColumns.map((c) => c.name);

export const Default: Story = {
  render: () => <ColumnVisibilityInteractive initialVisible={allColumnNames} />,
};

export const SomeHidden: Story = {
  render: () => (
    <ColumnVisibilityInteractive
      initialVisible={allColumnNames.filter((n) => n !== 'email')}
    />
  ),
};
