import { Table, TableBody } from '@granit/ui';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GroupByRows } from '../components/group-by-rows.js';

import type { GroupEntry } from '../types/query-results.js';

const groups: GroupEntry<{ id: string }>[] = [
  { field: 'Status', value: 'Active', label: 'Active', count: 10 },
  { field: 'Status', value: 'Inactive', label: 'Inactive', count: 5, items: [{ id: '1' }] },
];

function renderGroupByRows(props?: Partial<React.ComponentProps<typeof GroupByRows<{ id: string }>>>) {
  return render(
    <Table>
      <TableBody>
        <GroupByRows groups={groups} colSpan={3} {...props} />
      </TableBody>
    </Table>,
  );
}

describe('GroupByRows', () => {
  it('renders group labels', () => {
    renderGroupByRows();
    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });

  it('renders group counts as badges', () => {
    renderGroupByRows();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('has data-slot attribute', () => {
    const { container } = renderGroupByRows();
    const rows = container.querySelectorAll('[data-slot="group-by-row"]');
    expect(rows).toHaveLength(2);
  });

  it('toggles expand on click', async () => {
    const user = userEvent.setup();
    const onExpand = vi.fn();
    renderGroupByRows({ onExpand });
    await user.click(screen.getByText('Active'));
    expect(onExpand).toHaveBeenCalledWith(groups[0]);
  });

  it('collapses on second click', async () => {
    const user = userEvent.setup();
    const onExpand = vi.fn();
    renderGroupByRows({ onExpand });
    await user.click(screen.getByText('Active'));
    expect(onExpand).toHaveBeenCalledOnce();
    // Second click should not call onExpand again
    await user.click(screen.getByText('Active'));
    expect(onExpand).toHaveBeenCalledOnce();
  });

  it('renders items when expanded with renderItem', async () => {
    const user = userEvent.setup();
    renderGroupByRows({
      groups: [{ field: 'Status', value: 'Active', label: 'Active', count: 1, items: [{ id: 'item-1' }] }],
      renderItem: (item) => (
        <tr key={item.id}>
          <td>{item.id}</td>
        </tr>
      ),
    });
    await user.click(screen.getByText('Active'));
    expect(screen.getByText('item-1')).toBeInTheDocument();
  });
});
