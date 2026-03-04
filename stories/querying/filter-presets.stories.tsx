import { useState } from 'react';

import { FilterPresets } from '@granit/querying';

import { mockPresetGroups } from './_mocks';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/FilterPresets',
  component: FilterPresets,
  tags: ['autodocs'],
} satisfies Meta<typeof FilterPresets>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function FilterPresetsInteractive({
  initialPresets = {},
}: {
  readonly initialPresets?: Readonly<Record<string, readonly string[]>>;
}) {
  const [activePresets, setActivePresets] = useState<Record<string, readonly string[]>>(
    { ...initialPresets },
  );

  const handleToggle = (group: string, names: readonly string[]) => {
    setActivePresets((prev) => ({ ...prev, [group]: names }));
  };

  return (
    <FilterPresets
      groups={mockPresetGroups}
      activePresets={activePresets}
      onToggle={handleToggle}
    />
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => <FilterPresetsInteractive />,
};

export const WithActive: Story = {
  render: () => <FilterPresetsInteractive initialPresets={{ Status: ['Active'] }} />,
};
