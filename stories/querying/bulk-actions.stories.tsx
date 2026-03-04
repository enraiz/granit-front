import { useState } from 'react';

import { BulkActions } from '@granit/querying';
import { Trash2Icon, DownloadIcon } from 'lucide-react';

import type { BulkAction } from '@granit/querying';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/BulkActions',
  component: BulkActions,
  tags: ['autodocs'],
} satisfies Meta<typeof BulkActions>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Shared data
// ---------------------------------------------------------------------------

const visibleIds = Array.from({ length: 10 }, (_, i) => String(i + 1));

const bulkActions: BulkAction[] = [
  {
    id: 'delete',
    label: 'Delete',
    icon: <Trash2Icon className="mr-1.5 size-4" />,
    variant: 'destructive',
    onAction: (ids) => {
      // eslint-disable-next-line no-console
      console.log('Delete action triggered for IDs:', ids);
    },
  },
  {
    id: 'export',
    label: 'Export',
    icon: <DownloadIcon className="mr-1.5 size-4" />,
    variant: 'outline',
    onAction: (ids) => {
      // eslint-disable-next-line no-console
      console.log('Export action triggered for IDs:', ids);
    },
  },
];

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function BulkActionsInteractive() {
  const [selectedIds, setSelectedIds] = useState<readonly string[]>(['1', '2']);

  return (
    <div className="flex flex-col gap-4">
      <BulkActions
        totalCount={100}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        visibleIds={visibleIds}
        actions={bulkActions}
      />
      <p className="text-sm text-muted-foreground">
        Selected: {selectedIds.length > 0 ? selectedIds.join(', ') : '(none)'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => <BulkActionsInteractive />,
};
