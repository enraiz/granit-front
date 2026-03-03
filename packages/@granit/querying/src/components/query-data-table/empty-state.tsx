// ---------------------------------------------------------------------------
// EmptyState — displayed when the data table has no results
// ---------------------------------------------------------------------------

import { InboxIcon } from 'lucide-react';

export interface EmptyStateProps {
  /** Message to display. */
  readonly message?: string;
  /** CSS class. */
  readonly className?: string;
}

/**
 * Empty state placeholder for QueryDataTable.
 */
export function EmptyState({
  message = 'No results found.',
  className,
}: Readonly<EmptyStateProps>) {
  return (
    <div
      data-slot="empty-state"
      className={`flex flex-col items-center justify-center py-12 text-muted-foreground ${className ?? ''}`}
    >
      <InboxIcon className="mb-3 size-10" />
      <p className="text-sm">{message}</p>
    </div>
  );
}
