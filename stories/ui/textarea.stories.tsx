import { Textarea } from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Primitives/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Your message\u2026' },
};

export const Disabled: Story = {
  args: { placeholder: 'Your message\u2026', disabled: true },
};
