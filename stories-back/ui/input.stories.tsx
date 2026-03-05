import { Input } from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Primitives/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { placeholder: 'Type something\u2026' },
};

export const Disabled: Story = {
  args: { placeholder: 'Type something\u2026', disabled: true },
};

export const WithType: Story = {
  render: () => <Input type="email" placeholder="email@example.com" />,
};
