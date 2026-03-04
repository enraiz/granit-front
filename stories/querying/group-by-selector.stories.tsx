import { useState } from 'react';

import { GroupBySelector } from '@granit/querying';

import { mockGroupByFields } from './_mocks';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/GroupBySelector',
  component: GroupBySelector,
  tags: ['autodocs'],
} satisfies Meta<typeof GroupBySelector>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function GroupBySelectorInteractive({
  initialValue,
}: {
  readonly initialValue?: string;
}) {
  const [value, setValue] = useState<string | undefined>(initialValue);

  return (
    <div className="flex flex-col gap-4">
      <GroupBySelector
        fields={mockGroupByFields}
        value={value}
        onValueChange={setValue}
      />
      <p className="text-sm text-muted-foreground">
        Group by: {value ?? '(none)'}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const NoSelection: Story = {
  render: () => <GroupBySelectorInteractive />,
};

export const WithSelection: Story = {
  render: () => <GroupBySelectorInteractive initialValue="status" />,
};
