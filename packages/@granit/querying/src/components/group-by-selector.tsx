// ---------------------------------------------------------------------------
// GroupBySelector — dropdown for selecting group-by field (Story #54)
// ---------------------------------------------------------------------------

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Button,
} from '@granit/ui';
import { GroupIcon } from 'lucide-react';

import type { GroupByField } from '../types/query-metadata.js';

export interface GroupBySelectorProps {
  /** Available group-by fields from metadata. */
  readonly fields: readonly GroupByField[];
  /** Currently selected group-by field. */
  readonly value?: string;
  /** Callback when group-by changes. */
  readonly onValueChange: (field: string | undefined) => void;
  /** Label for the trigger button. */
  readonly label?: string;
  /** CSS class for the root container. */
  readonly className?: string;
}

/**
 * Dropdown menu for selecting a group-by field.
 *
 * @example
 * ```tsx
 * <GroupBySelector
 *   fields={meta.groupByFields}
 *   value={params.groupBy}
 *   onValueChange={setGroupBy}
 * />
 * ```
 */
export function GroupBySelector({
  fields,
  value,
  onValueChange,
  label = 'Group by',
  className,
}: Readonly<GroupBySelectorProps>) {
  if (fields.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={value ? 'default' : 'outline'}
          size="sm"
          data-slot="group-by-selector"
          className={className}
        >
          <GroupIcon className="mr-1.5 size-4" />
          {value ?? label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {value && (
          <>
            <DropdownMenuItem onClick={() => onValueChange(undefined)}>
              No grouping
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}
        {fields.map((field) => (
          <DropdownMenuItem
            key={field.name}
            data-active={field.name === value}
            onClick={() => onValueChange(field.name)}
          >
            {field.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
