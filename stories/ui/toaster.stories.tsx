import { toast } from 'sonner';

import { Button, Toaster } from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Overlays/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div>
        <Story />
        <Toaster />
      </div>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="default" onClick={() => toast.success('Operation completed successfully!')}>
        Success Toast
      </Button>
      <Button variant="destructive" onClick={() => toast.error('Something went wrong.')}>
        Error Toast
      </Button>
      <Button variant="outline" onClick={() => toast.info('Here is some useful information.')}>
        Info Toast
      </Button>
      <Button variant="secondary" onClick={() => toast.warning('Please review before continuing.')}>
        Warning Toast
      </Button>
    </div>
  ),
};
