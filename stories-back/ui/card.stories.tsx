import { Button, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@granit/ui';

import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'UI/Layout/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description with additional context.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content goes here. This is a basic card layout demonstrating all sub-components.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Card with Action</CardTitle>
        <CardDescription>The header includes an action slot.</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">Edit</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>Use CardAction inside CardHeader to place a button or icon in the top-right corner.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
      </CardFooter>
    </Card>
  ),
};
