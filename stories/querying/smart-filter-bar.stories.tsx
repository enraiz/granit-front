import { SmartFilterBar, useSmartFilter } from '@granit/querying';

import { mockMetadata } from './_mocks';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/SmartFilterBar',
  component: SmartFilterBar,
  tags: ['autodocs'],
} satisfies Meta<typeof SmartFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Wrapper with real useSmartFilter hook
// ---------------------------------------------------------------------------

function SmartFilterBarInteractive() {
  const smartFilter = useSmartFilter({ metadata: mockMetadata });

  return (
    <div className="flex flex-col gap-4">
      <SmartFilterBar
        smartFilter={smartFilter}
        placeholder="Search or filter..."
      />
      <div className="text-sm text-muted-foreground">
        <p>Phase: {smartFilter.phase}</p>
        <p>Tokens: {smartFilter.tokens.length > 0 ? smartFilter.tokens.map((t) => t.label).join(', ') : '(none)'}</p>
        <p>Filters: {smartFilter.filters.length > 0 ? JSON.stringify(smartFilter.filters) : '(none)'}</p>
        <p>Search: {smartFilter.search ?? '(none)'}</p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  render: () => <SmartFilterBarInteractive />,
};
