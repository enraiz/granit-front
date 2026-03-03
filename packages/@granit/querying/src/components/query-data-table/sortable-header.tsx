// ---------------------------------------------------------------------------
// SortableHeader — column header with sort indicator
// ---------------------------------------------------------------------------

import { Button } from '@granit/ui';
import { ArrowDownIcon, ArrowUpDownIcon, ArrowUpIcon } from 'lucide-react';

import type { SortDirection } from '../../types/query-params.js';

export interface SortableHeaderProps {
  /** Column label. */
  readonly label: string;
  /** Current sort direction (undefined = not sorted). */
  readonly direction?: SortDirection;
  /** Callback when header is clicked. */
  readonly onToggle: () => void;
  /** CSS class. */
  readonly className?: string;
}

/**
 * Table column header with sort toggle button and direction indicator.
 */
export function SortableHeader({
  label,
  direction,
  onToggle,
  className,
}: Readonly<SortableHeaderProps>) {
  const Icon = direction === 'asc'
    ? ArrowUpIcon
    : direction === 'desc'
      ? ArrowDownIcon
      : ArrowUpDownIcon;

  return (
    <Button
      variant="ghost"
      size="sm"
      data-slot="sortable-header"
      data-sort-direction={direction}
      className={className}
      onClick={onToggle}
    >
      {label}
      <Icon className="ml-1 size-3.5" />
    </Button>
  );
}
