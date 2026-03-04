import {
  Button,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Overlays/Popover',
  component: Popover,
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Popover Title</PopoverTitle>
          <PopoverDescription>
            This is a popover with a header, title, and description.
          </PopoverDescription>
        </PopoverHeader>
        <div className="mt-3">
          <p className="text-sm">Additional popover content goes here.</p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
