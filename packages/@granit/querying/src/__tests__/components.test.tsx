import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { BulkActions } from '../components/bulk-actions.js';
import { DatePeriodPicker } from '../components/date-period-picker.js';
import { EmptyState } from '../components/query-data-table/empty-state.js';
import { SortableHeader } from '../components/query-data-table/sortable-header.js';
import { TablePagination } from '../components/query-data-table/table-pagination.js';

import type { DateFilterMeta } from '../types/query-metadata.js';

describe('EmptyState', () => {
  it('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No results found.')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<EmptyState message="Nothing here" />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(<EmptyState />);
    expect(container.querySelector('[data-slot="empty-state"]')).toBeInTheDocument();
  });
});

describe('SortableHeader', () => {
  it('renders label', () => {
    render(<SortableHeader label="Name" onToggle={vi.fn()} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    render(<SortableHeader label="Name" onToggle={vi.fn()} />);
    expect(screen.getByText('Name').closest('button')).toHaveAttribute('data-slot', 'sortable-header');
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<SortableHeader label="Name" onToggle={onToggle} />);
    await user.click(screen.getByText('Name'));
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('shows sort direction attribute', () => {
    render(<SortableHeader label="Name" direction="asc" onToggle={vi.fn()} />);
    expect(screen.getByText('Name').closest('button')).toHaveAttribute('data-sort-direction', 'asc');
  });
});

describe('TablePagination', () => {
  it('renders page info', () => {
    render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={100}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={100}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(container.querySelector('[data-slot="table-pagination"]')).toBeInTheDocument();
  });

  it('disables previous/first on first page', () => {
    render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={100}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('First page')).toBeDisabled();
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
    expect(screen.getByLabelText('Next page')).not.toBeDisabled();
    expect(screen.getByLabelText('Last page')).not.toBeDisabled();
  });

  it('disables next/last on last page', () => {
    render(
      <TablePagination
        page={5}
        pageSize={20}
        totalCount={100}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByLabelText('First page')).not.toBeDisabled();
    expect(screen.getByLabelText('Previous page')).not.toBeDisabled();
    expect(screen.getByLabelText('Next page')).toBeDisabled();
    expect(screen.getByLabelText('Last page')).toBeDisabled();
  });

  it('calls onPageChange when clicking next', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );
    await user.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking previous', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination
        page={3}
        pageSize={20}
        totalCount={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );
    await user.click(screen.getByLabelText('Previous page'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking first page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination
        page={3}
        pageSize={20}
        totalCount={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );
    await user.click(screen.getByLabelText('First page'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange when clicking last page', async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={100}
        onPageChange={onPageChange}
        onPageSizeChange={vi.fn()}
      />,
    );
    await user.click(screen.getByLabelText('Last page'));
    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  it('shows totalPages as 1 when totalCount is 0', () => {
    render(
      <TablePagination
        page={1}
        pageSize={20}
        totalCount={0}
        onPageChange={vi.fn()}
        onPageSizeChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
  });
});

describe('DatePeriodPicker', () => {
  const dateFilter: DateFilterMeta = {
    name: 'CreatedAt',
    defaultPeriod: 'ThisMonth',
    availablePeriods: ['Today', 'ThisWeek', 'ThisMonth', 'ThisYear'],
  };

  it('renders with data-slot', () => {
    const { container } = render(
      <DatePeriodPicker dateFilter={dateFilter} onValueChange={vi.fn()} />,
    );
    expect(container.querySelector('[data-slot="date-period-picker"]')).toBeInTheDocument();
  });
});

describe('BulkActions', () => {
  it('renders nothing when no items selected', () => {
    const { container } = render(
      <BulkActions
        totalCount={100}
        selectedIds={[]}
        onSelectionChange={vi.fn()}
        visibleIds={['1', '2']}
        actions={[]}
      />,
    );
    expect(container.querySelector('[data-slot="bulk-actions"]')).not.toBeInTheDocument();
  });

  it('renders when items are selected', () => {
    const { container } = render(
      <BulkActions
        totalCount={100}
        selectedIds={['1']}
        onSelectionChange={vi.fn()}
        visibleIds={['1', '2']}
        actions={[{ id: 'delete', label: 'Delete', onAction: vi.fn() }]}
      />,
    );
    expect(container.querySelector('[data-slot="bulk-actions"]')).toBeInTheDocument();
    expect(screen.getByText('1 of 100 selected')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('calls action handler when action button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <BulkActions
        totalCount={100}
        selectedIds={['1', '2']}
        onSelectionChange={vi.fn()}
        visibleIds={['1', '2', '3']}
        actions={[{ id: 'delete', label: 'Delete', onAction }]}
      />,
    );
    await user.click(screen.getByText('Delete'));
    expect(onAction).toHaveBeenCalledWith(['1', '2']);
  });

  it('selects all visible when checkbox is checked', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <BulkActions
        totalCount={100}
        selectedIds={['1']}
        onSelectionChange={onSelectionChange}
        visibleIds={['1', '2', '3']}
        actions={[]}
      />,
    );
    const checkbox = screen.getByLabelText('Select all visible');
    await user.click(checkbox);
    expect(onSelectionChange).toHaveBeenCalledWith(['1', '2', '3']);
  });

  it('deselects visible items when checkbox is unchecked', async () => {
    const user = userEvent.setup();
    const onSelectionChange = vi.fn();
    render(
      <BulkActions
        totalCount={100}
        selectedIds={['1', '2', '3', '4']}
        onSelectionChange={onSelectionChange}
        visibleIds={['1', '2', '3']}
        actions={[]}
      />,
    );
    const checkbox = screen.getByLabelText('Select all visible');
    await user.click(checkbox);
    expect(onSelectionChange).toHaveBeenCalledWith(['4']);
  });

  it('renders action with custom variant', () => {
    render(
      <BulkActions
        totalCount={100}
        selectedIds={['1']}
        onSelectionChange={vi.fn()}
        visibleIds={['1']}
        actions={[{ id: 'delete', label: 'Delete', variant: 'destructive', onAction: vi.fn() }]}
      />,
    );
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });
});
