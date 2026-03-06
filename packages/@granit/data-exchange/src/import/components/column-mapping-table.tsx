import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@granit/ui';

import { MappingConfidenceBadge } from './mapping-confidence-badge.js';

import type { ImportColumnMapping, ImportFieldMetadata } from '../types/import-preview.js';

export interface ColumnMappingTableProps {
  /** Current column mappings. */
  readonly mappings: readonly ImportColumnMapping[];
  /** Available target fields. */
  readonly fieldMetadata: readonly ImportFieldMetadata[];
  /** Preview rows (first few rows from the file). */
  readonly previewRows: readonly (readonly string[])[];
  /** Headers from the file. */
  readonly headers: readonly string[];
  /** Callback when a mapping changes. */
  readonly onMappingChange: (sourceColumn: string, targetProperty: string | null) => void;
  /** Whether the table is disabled. */
  readonly disabled?: boolean;
}

const UNMAPPED_VALUE = '__unmapped__';

/**
 * Interactive table for mapping source columns to target properties.
 */
export function ColumnMappingTable({
  mappings,
  fieldMetadata,
  previewRows,
  headers,
  onMappingChange,
  disabled = false,
}: ColumnMappingTableProps) {
  const assignedTargets = new Set(
    mappings.filter((m) => m.targetProperty).map((m) => m.targetProperty),
  );

  return (
    <div data-slot="column-mapping-table" className="overflow-x-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source column</TableHead>
            <TableHead>Preview</TableHead>
            <TableHead>Target property</TableHead>
            <TableHead>Confidence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mappings.map((mapping) => {
            const colIndex = headers.indexOf(mapping.sourceColumn);
            const sampleValue = previewRows[0]?.[colIndex] ?? '';

            return (
              <TableRow key={mapping.sourceColumn}>
                <TableCell className="font-medium">
                  {mapping.sourceColumn}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {sampleValue || '\u2014'}
                </TableCell>
                <TableCell>
                  <Select
                    value={mapping.targetProperty ?? UNMAPPED_VALUE}
                    onValueChange={(value) =>
                      onMappingChange(
                        mapping.sourceColumn,
                        value === UNMAPPED_VALUE ? null : value,
                      )
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger className="w-56">
                      <SelectValue placeholder="Not mapped" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={UNMAPPED_VALUE}>
                        <span className="text-muted-foreground">Not mapped</span>
                      </SelectItem>
                      {fieldMetadata.map((field) => {
                        const isAssigned =
                          assignedTargets.has(field.propertyPath) &&
                          mapping.targetProperty !== field.propertyPath;
                        return (
                          <SelectItem
                            key={field.propertyPath}
                            value={field.propertyPath}
                            disabled={isAssigned}
                          >
                            {field.displayName}
                            {field.isRequired && (
                              <span className="ml-1 text-red-500">*</span>
                            )}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <MappingConfidenceBadge confidence={mapping.confidence} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
