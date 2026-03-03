import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
  Separator,
  Toaster,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../index.js';

describe('Dialog', () => {
  it('renders trigger', () => {
    render(
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
      </Dialog>,
    );
    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'dialog-trigger');
  });

  it('shows content when open', () => {
    render(
      <Dialog open>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Title</DialogTitle>
            <DialogDescription>Description</DialogDescription>
          </DialogHeader>
          <DialogFooter>Footer</DialogFooter>
        </DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'dialog-title');
    expect(screen.getByText('Description')).toHaveAttribute('data-slot', 'dialog-description');
  });

  it('renders close button by default', () => {
    render(
      <Dialog open>
        <DialogContent>Content</DialogContent>
      </Dialog>,
    );
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('hides close button when showCloseButton=false', () => {
    render(
      <Dialog open>
        <DialogContent showCloseButton={false}>Content</DialogContent>
      </Dialog>,
    );
    expect(screen.queryByText('Close')).not.toBeInTheDocument();
  });
});

describe('Tooltip', () => {
  it('renders trigger', () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByText('Hover me')).toBeInTheDocument();
  });

  it('shows content when open', () => {
    render(
      <TooltipProvider>
        <Tooltip open>
          <TooltipTrigger>Hover me</TooltipTrigger>
          <TooltipContent>Tooltip text</TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );
    expect(screen.getByRole('tooltip')).toHaveTextContent('Tooltip text');
  });
});

describe('Popover', () => {
  it('renders trigger', () => {
    render(
      <Popover>
        <PopoverTrigger>Open</PopoverTrigger>
      </Popover>,
    );
    expect(screen.getByText('Open')).toHaveAttribute('data-slot', 'popover-trigger');
  });

  it('shows content with header when open', () => {
    render(
      <Popover open>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Popover Title</PopoverTitle>
            <PopoverDescription>Some description</PopoverDescription>
          </PopoverHeader>
          <p>Body content</p>
        </PopoverContent>
      </Popover>,
    );
    expect(screen.getByText('Popover Title')).toHaveAttribute('data-slot', 'popover-title');
    expect(screen.getByText('Some description')).toHaveAttribute(
      'data-slot',
      'popover-description',
    );
  });
});

describe('Toaster', () => {
  it('renders without error', () => {
    const { container } = render(<Toaster />);
    expect(container).toBeTruthy();
  });
});

describe('Separator', () => {
  it('renders with data-slot', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toHaveAttribute('data-slot', 'separator');
  });

  it('forwards className', () => {
    render(<Separator decorative={false} className="custom" />);
    expect(screen.getByRole('separator')).toHaveClass('custom');
  });

  it('renders horizontal by default', () => {
    render(<Separator decorative={false} />);
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'horizontal');
  });

  it('renders vertical', () => {
    render(<Separator decorative={false} orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('data-orientation', 'vertical');
  });
});
