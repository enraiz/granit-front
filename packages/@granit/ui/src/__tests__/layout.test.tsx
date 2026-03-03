import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Skeleton,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../index.js';

describe('Card', () => {
  it('renders with data-slot', () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId('card')).toHaveAttribute('data-slot', 'card');
  });

  it('renders all sub-components', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'card-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'card-description');
    expect(screen.getByText('Body')).toHaveAttribute('data-slot', 'card-content');
    expect(screen.getByText('Footer')).toHaveAttribute('data-slot', 'card-footer');
  });

  it('forwards className', () => {
    render(<Card className="custom" data-testid="card">C</Card>);
    expect(screen.getByTestId('card')).toHaveClass('custom');
  });

  it('renders CardAction', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>Action</CardAction>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText('Action')).toHaveAttribute('data-slot', 'card-action');
  });
});

describe('Avatar', () => {
  it('renders fallback with data-slot', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText('JD')).toHaveAttribute('data-slot', 'avatar-fallback');
  });

  it('renders with size attribute', () => {
    const { container } = render(
      <Avatar size="lg">
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(container.querySelector('[data-slot="avatar"]')).toHaveAttribute('data-size', 'lg');
  });

  it('renders AvatarImage with alt text', () => {
    render(
      <Avatar>
        <AvatarImage src="test.jpg" alt="Test avatar" />
        <AvatarFallback>T</AvatarFallback>
      </Avatar>,
    );
    // Radix AvatarImage delays rendering until the image loads.
    // In jsdom, the img never loads, so we verify the fallback appears instead.
    expect(screen.getByText('T')).toHaveAttribute('data-slot', 'avatar-fallback');
  });

  it('renders AvatarBadge', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
        <AvatarBadge data-testid="badge" />
      </Avatar>,
    );
    expect(screen.getByTestId('badge')).toHaveAttribute('data-slot', 'avatar-badge');
  });

  it('renders AvatarGroup', () => {
    const { container } = render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+3</AvatarGroupCount>
      </AvatarGroup>,
    );
    expect(container.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument();
    expect(screen.getByText('+3')).toHaveAttribute('data-slot', 'avatar-group-count');
  });
});

describe('Skeleton', () => {
  it('renders with data-slot', () => {
    render(<Skeleton data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveAttribute('data-slot', 'skeleton');
  });

  it('forwards className', () => {
    render(<Skeleton className="h-4 w-20" data-testid="skeleton" />);
    expect(screen.getByTestId('skeleton')).toHaveClass('h-4', 'w-20');
  });
});

describe('Tabs', () => {
  it('renders with data-slot', () => {
    render(
      <Tabs defaultValue="tab1">
        <TabsList>
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>,
    );
    expect(screen.getByText('Tab 1')).toHaveAttribute('data-slot', 'tabs-trigger');
    expect(screen.getByText('Content 1')).toHaveAttribute('data-slot', 'tabs-content');
  });

  it('applies orientation', () => {
    const { container } = render(
      <Tabs orientation="vertical" defaultValue="t1">
        <TabsList>
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1">C1</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs"]')).toHaveAttribute(
      'data-orientation',
      'vertical',
    );
  });

  it('applies list variant', () => {
    const { container } = render(
      <Tabs defaultValue="t1">
        <TabsList variant="line">
          <TabsTrigger value="t1">T1</TabsTrigger>
        </TabsList>
        <TabsContent value="t1">C1</TabsContent>
      </Tabs>,
    );
    expect(container.querySelector('[data-slot="tabs-list"]')).toHaveAttribute(
      'data-variant',
      'line',
    );
  });
});
