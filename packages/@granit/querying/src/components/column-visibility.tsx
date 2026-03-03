// ---------------------------------------------------------------------------
// ColumnVisibility — toggle column visibility (Story #57)
// ---------------------------------------------------------------------------

import {
  Button,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@granit/ui';
import { ColumnsIcon } from 'lucide-react';

import type { ColumnDefinition } from '../types/query-metadata.js';

export interface ColumnVisibilityProps {
  /** Column definitions from metadata. */
  readonly columns: readonly ColumnDefinition[];
  /** Currently visible column names. */
  readonly visibleColumns: readonly string[];
  /** Callback when visibility changes. */
  readonly onVisibilityChange: (visibleColumns: readonly string[]) => void;
  /** CSS class. */
  readonly className?: string;
}

/**
 * Dropdown menu with checkboxes to toggle column visibility.
 *
 * @example
 * ```tsx
 * <ColumnVisibility
 *   columns={meta.columns}
 *   visibleColumns={visibleCols}
 *   onVisibilityChange={setVisibleCols}
 * />
 * ```
 */
export function ColumnVisibility({
  columns,
  visibleColumns,
  onVisibilityChange,
  className,
}: Readonly<ColumnVisibilityProps>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          data-slot="column-visibility"
          className={className}
        >
          <ColumnsIcon className="mr-1.5 size-4" />
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {columns.map((col) => {
          const isVisible = visibleColumns.includes(col.name);
          return (
            <DropdownMenuCheckboxItem
              key={col.name}
              checked={isVisible}
              onCheckedChange={(checked) => {
                if (checked) {
                  onVisibilityChange([...visibleColumns, col.name]);
                } else {
                  onVisibilityChange(visibleColumns.filter((c) => c !== col.name));
                }
              }}
            >
              {col.label}
            </DropdownMenuCheckboxItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
