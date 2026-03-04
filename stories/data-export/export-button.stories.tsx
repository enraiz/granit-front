import { fn } from 'storybook/test';

import { ExportButton } from '@granit/data-export';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'DataExport/ExportButton',
  component: ExportButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
    disabled: { control: 'boolean' },
    label: { control: 'text' },
  },
  args: {
    onExport: fn(),
  },
} satisfies Meta<typeof ExportButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CustomLabel: Story = {
  args: { label: 'Download CSV' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <ExportButton variant="default" onExport={() => {}} />
      <ExportButton variant="outline" onExport={() => {}} />
      <ExportButton variant="secondary" onExport={() => {}} />
      <ExportButton variant="ghost" onExport={() => {}} />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <ExportButton size="sm" onExport={() => {}} label="Small" />
      <ExportButton size="default" onExport={() => {}} label="Default" />
      <ExportButton size="lg" onExport={() => {}} label="Large" />
    </div>
  ),
};
