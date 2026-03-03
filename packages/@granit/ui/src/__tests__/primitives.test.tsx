import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Badge, Button, Input, Label, Spinner, Textarea } from '../index.js';

describe('Button', () => {
  it('renders with data-slot', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-slot', 'button');
  });

  it('forwards className', () => {
    render(<Button className="custom">Click</Button>);
    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('applies variant', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-variant', 'destructive');
  });

  it('applies size', () => {
    render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('data-size', 'sm');
  });

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});

describe('Badge', () => {
  it('renders with data-slot', () => {
    render(<Badge>Status</Badge>);
    expect(screen.getByText('Status')).toHaveAttribute('data-slot', 'badge');
  });

  it('forwards className', () => {
    render(<Badge className="custom">Status</Badge>);
    expect(screen.getByText('Status')).toHaveClass('custom');
  });

  it('applies variant', () => {
    render(<Badge variant="outline">Outline</Badge>);
    expect(screen.getByText('Outline')).toHaveAttribute('data-variant', 'outline');
  });
});

describe('Input', () => {
  it('renders with data-slot', () => {
    render(<Input aria-label="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'input');
  });

  it('forwards className', () => {
    render(<Input className="custom" aria-label="email" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });

  it('accepts type prop', () => {
    render(<Input type="password" placeholder="password" />);
    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password');
  });
});

describe('Label', () => {
  it('renders with data-slot', () => {
    render(<Label>Name</Label>);
    expect(screen.getByText('Name')).toHaveAttribute('data-slot', 'label');
  });

  it('forwards className', () => {
    render(<Label className="custom">Name</Label>);
    expect(screen.getByText('Name')).toHaveClass('custom');
  });
});

describe('Textarea', () => {
  it('renders with data-slot', () => {
    render(<Textarea aria-label="message" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('data-slot', 'textarea');
  });

  it('forwards className', () => {
    render(<Textarea className="custom" aria-label="message" />);
    expect(screen.getByRole('textbox')).toHaveClass('custom');
  });
});

describe('Spinner', () => {
  it('renders with role status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('forwards className', () => {
    render(<Spinner className="custom" />);
    expect(screen.getByRole('status')).toHaveClass('custom');
  });
});
