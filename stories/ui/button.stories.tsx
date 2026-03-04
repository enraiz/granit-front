import { ChevronRightIcon, MailIcon, PlusIcon } from 'lucide-react';

import { Button } from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Primitives/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: 'Button' },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const IconSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="icon-xs"><PlusIcon /></Button>
      <Button size="icon-sm"><PlusIcon /></Button>
      <Button size="icon"><PlusIcon /></Button>
      <Button size="icon-lg"><PlusIcon /></Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button><MailIcon /> Send email</Button>
      <Button variant="outline">Next <ChevronRightIcon /></Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { children: 'Disabled', disabled: true },
};

export const VariantSizeMatrix: Story = {
  name: 'Variant × Size Matrix',
  render: () => {
    const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const;
    const sizes = ['xs', 'sm', 'default', 'lg'] as const;
    return (
      <div className="grid gap-3">
        {variants.map((variant) => (
          <div key={variant} className="flex items-center gap-3">
            <span className="w-24 text-xs text-muted-foreground">{variant}</span>
            {sizes.map((size) => (
              <Button key={`${variant}-${size}`} variant={variant} size={size}>
                {size}
              </Button>
            ))}
          </div>
        ))}
      </div>
    );
  },
};
