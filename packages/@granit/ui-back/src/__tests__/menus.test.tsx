import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import {
  Checkbox,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  Switch,
} from '../index.js';

describe('Checkbox', () => {
  it('renders with data-slot', () => {
    render(<Checkbox aria-label="agree" />);
    expect(screen.getByRole('checkbox')).toHaveAttribute('data-slot', 'checkbox');
  });

  it('forwards className', () => {
    render(<Checkbox className="custom" aria-label="agree" />);
    expect(screen.getByRole('checkbox')).toHaveClass('custom');
  });

  it('can be checked', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label="agree" />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('data-state', 'checked');
  });
});

describe('Switch', () => {
  it('renders with data-slot', () => {
    render(<Switch aria-label="toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-slot', 'switch');
  });

  it('forwards className', () => {
    render(<Switch className="custom" aria-label="toggle" />);
    expect(screen.getByRole('switch')).toHaveClass('custom');
  });

  it('has size attribute', () => {
    render(<Switch size="sm" aria-label="toggle" />);
    expect(screen.getByRole('switch')).toHaveAttribute('data-size', 'sm');
  });

  it('can be toggled', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label="toggle" />);
    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);
    expect(switchEl).toHaveAttribute('data-state', 'checked');
  });
});

describe('DropdownMenu', () => {
  it('renders trigger', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    expect(screen.getByText('Menu')).toHaveAttribute('data-slot', 'dropdown-menu-trigger');
  });

  it('shows items with label, separator and shortcut when open', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              Edit <DropdownMenuShortcut>Ctrl+E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('Menu'));
    expect(await screen.findByText('Actions')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-label',
    );
    expect(screen.getByText('Edit')).toHaveAttribute('data-slot', 'dropdown-menu-item');
    expect(screen.getByText('Ctrl+E')).toHaveAttribute('data-slot', 'dropdown-menu-shortcut');
  });

  it('renders checkbox items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuCheckboxItem checked>Checked</DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('Menu'));
    expect(await screen.findByText('Checked')).toBeInTheDocument();
  });

  it('renders radio items', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup value="a">
            <DropdownMenuRadioItem value="a">Option A</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="b">Option B</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('Menu'));
    expect(await screen.findByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
  });

  it('renders sub menus', async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Menu</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>More</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Sub Item</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>,
    );
    await user.click(screen.getByText('Menu'));
    expect(await screen.findByText('More')).toHaveAttribute(
      'data-slot',
      'dropdown-menu-sub-trigger',
    );
  });
});

describe('Select', () => {
  it('renders trigger', () => {
    render(
      <Select>
        <SelectTrigger aria-label="fruit">
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('data-slot', 'select-trigger');
  });

  it('renders with group, label, and separator when open', () => {
    render(
      <Select open>
        <SelectTrigger aria-label="fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Fruits</SelectLabel>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectSeparator />
            <SelectItem value="banana">Banana</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
  });

  it('applies size prop', () => {
    render(
      <Select>
        <SelectTrigger size="sm" aria-label="fruit">
          <SelectValue placeholder="Pick" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">A</SelectItem>
        </SelectContent>
      </Select>,
    );
    expect(screen.getByRole('combobox')).toHaveAttribute('data-size', 'sm');
  });
});
