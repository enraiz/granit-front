import { useState } from 'react';

import { DatePeriodPicker } from '@granit/querying';

import { mockDateFilters } from './_mocks';

import type { DatePeriod } from '@granit/querying';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Querying/DatePeriodPicker',
  component: DatePeriodPicker,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[240px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DatePeriodPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// ---------------------------------------------------------------------------
// Interactive wrapper
// ---------------------------------------------------------------------------

function DatePeriodPickerInteractive({
  initialValue = 'ThisMonth',
}: {
  readonly initialValue?: DatePeriod;
}) {
  const [value, setValue] = useState<DatePeriod>(initialValue);

  return (
    <DatePeriodPicker
      dateFilter={mockDateFilters[0]}
      value={value}
      onValueChange={setValue}
    />
  );
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    dateFilter: mockDateFilters[0],
    value: 'ThisMonth',
    onValueChange: () => {},
  },
};

export const Interactive: Story = {
  render: () => <DatePeriodPickerInteractive />,
};
