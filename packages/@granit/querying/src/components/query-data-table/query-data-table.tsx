// ---------------------------------------------------------------------------
// QueryDataTable — TanStack Table + @granit/ui Table (Story #55)
// ---------------------------------------------------------------------------

import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@granit/ui';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';


import { EmptyState } from './empty-state.js';
import { SortableHeader } from './sortable-header.js';
import { TablePagination } from './table-pagination.js';

import type { SortEntry } from '../../types/query-params.js';
import type { ColumnDef } from '@tanstack/react-table';

export interface QueryDataTableProps<T> {
  /** TanStack Table column definitions. */
  readonly columns: readonly ColumnDef<T, unknown>[];
  /** Data items. */
  readonly data: readonly T[];
  /** Total count for pagination. */
  readonly totalCount: number;
  /** Whether data is loading. */
  readonly isLoading?: boolean;
  /** Current page (1-based). */
  readonly page?: number;
  /** Items per page. */
  readonly pageSize?: number;
  /** Current sort entries. */
  readonly sort?: readonly SortEntry[];
  /** Callback when page changes. */
  readonly onPageChange?: (page: number) => void;
  /** Callback when page size changes. */
  readonly onPageSizeChange?: (pageSize: number) => void;
  /** Callback when sort toggles. */
  readonly onToggleSort?: (field: string) => void;
  /** Empty state message. */
  readonly emptyMessage?: string;
  /** Number of skeleton rows shown during loading. */
  readonly skeletonRows?: number;
  /** CSS class. */
  readonly className?: string;
}

/**
 * Data table powered by TanStack Table v8 and @granit/ui Table components.
 *
 * Integrates with useQueryEndpoint dispatchers for pagination and sorting.
 *
 * @example
 * ```tsx
 * const { query, params, setPage, setPageSize, toggleSort } = useQueryEndpoint<Patient>();
 *
 * <QueryDataTable
 *   columns={patientColumns}
 *   data={query.data?.items ?? []}
 *   totalCount={query.data?.totalCount ?? 0}
 *   isLoading={query.isLoading}
 *   page={params.page}
 *   pageSize={params.pageSize}
 *   sort={params.sort}
 *   onPageChange={setPage}
 *   onPageSizeChange={setPageSize}
 *   onToggleSort={toggleSort}
 * />
 * ```
 */
export function QueryDataTable<T>({
  columns,
  data,
  totalCount,
  isLoading = false,
  page = 1,
  pageSize = 20,
  sort,
  onPageChange,
  onPageSizeChange,
  onToggleSort,
  emptyMessage,
  skeletonRows = 5,
  className,
}: Readonly<QueryDataTableProps<T>>) {
  const table = useReactTable({
    data: data as T[],
    columns: columns as ColumnDef<T, unknown>[],
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    rowCount: totalCount,
  });

  return (
    <div data-slot="query-data-table" className={className}>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sortEntry = sort?.find(
                    (s) => s.field === header.column.id,
                  );
                  const isSortable =
                    header.column.getCanSort() && onToggleSort;

                  let headerContent: React.ReactNode = null;
                  if (!header.isPlaceholder) {
                    headerContent = isSortable
                      ? (
                        <SortableHeader
                          label={
                            typeof header.column.columnDef.header === 'string'
                              ? header.column.columnDef.header
                              : header.column.id
                          }
                          direction={sortEntry?.direction}
                          onToggle={() => onToggleSort(header.column.id)}
                        />
                      )
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        );
                  }

                  return (
                    <TableHead key={header.id}>
                      {headerContent}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading &&
              Array.from({ length: skeletonRows }).map((_, i) => (
                <TableRow key={`skeleton-${String(i)}`}>
                  {columns.map((_, j) => (
                    <TableCell key={`skeleton-cell-${String(j)}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {!isLoading && table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <EmptyState message={emptyMessage} />
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {!isLoading && totalCount > 0 && onPageChange && onPageSizeChange && (
        <div className="mt-4">
          <TablePagination
            page={page}
            pageSize={pageSize}
            totalCount={totalCount}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
          />
        </div>
      )}
    </div>
  );
}
