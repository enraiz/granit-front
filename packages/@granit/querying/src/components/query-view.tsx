// ---------------------------------------------------------------------------
// QueryView — full assembly of all querying components (Story #59)
// ---------------------------------------------------------------------------


import { ColumnVisibility } from './column-visibility.js';
import { FilterPresets } from './filter-presets.js';
import { GroupBySelector } from './group-by-selector.js';
import { QueryDataTable } from './query-data-table/query-data-table.js';
import { SavedViewSelector } from './saved-view-selector.js';
import { SmartFilterBar } from './smart-filter-bar/smart-filter-bar.js';

import type { BulkAction } from './bulk-actions.js';
import type { UseQueryEndpointReturn } from '../hooks/use-query-endpoint.js';
import type { UseSavedViewsReturn } from '../hooks/use-saved-views.js';
import type { UseSmartFilterReturn } from '../hooks/use-smart-filter.js';
import type { QueryMetadata } from '../types/query-metadata.js';
import type { ColumnDef } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface QueryViewProps<T> {
  /** Query metadata. */
  readonly metadata: QueryMetadata;
  /** The useQueryEndpoint return value. */
  readonly queryEndpoint: UseQueryEndpointReturn<T>;
  /** The useSmartFilter return value. */
  readonly smartFilter: UseSmartFilterReturn;
  /** The useSavedViews return value (optional). */
  readonly savedViews?: UseSavedViewsReturn;
  /** TanStack Table column definitions. */
  readonly columns: readonly ColumnDef<T, unknown>[];
  /** Visible column names. */
  readonly visibleColumns?: readonly string[];
  /** Callback when column visibility changes. */
  readonly onVisibleColumnsChange?: (columns: readonly string[]) => void;
  /** Bulk actions (optional). */
  readonly bulkActions?: readonly BulkAction[];
  /** Selected item IDs for bulk actions. */
  readonly selectedIds?: readonly string[];
  /** Callback when selection changes. */
  readonly onSelectionChange?: (ids: readonly string[]) => void;
  /** ID extractor for bulk selection. */
  readonly getItemId?: (item: T) => string;
  /** Currently selected saved view ID. */
  readonly selectedViewId?: string;
  /** Callback when a saved view is selected. */
  readonly onSelectView?: (view: { id: string }) => void;
  /** Extra toolbar content (injected between filter bar and table). */
  readonly toolbarExtra?: ReactNode;
  /** SmartFilterBar placeholder. */
  readonly placeholder?: string;
  /** CSS class for the root container. */
  readonly className?: string;
}

/**
 * Full query view assembly — combines SmartFilterBar, FilterPresets,
 * toolbar controls (GroupBy, ColumnVisibility, SavedViews), and QueryDataTable.
 *
 * This is the main "Odoo-like list view" component.
 *
 * @example
 * ```tsx
 * const meta = useQueryMeta();
 * const queryEndpoint = useQueryEndpoint<Patient>();
 * const smartFilter = useSmartFilter({ metadata: meta.data });
 * const savedViews = useSavedViews();
 *
 * <QueryView
 *   metadata={meta.data!}
 *   queryEndpoint={queryEndpoint}
 *   smartFilter={smartFilter}
 *   savedViews={savedViews}
 *   columns={patientColumns}
 * />
 * ```
 */
export function QueryView<T>({
  metadata,
  queryEndpoint,
  smartFilter,
  savedViews,
  columns,
  visibleColumns,
  onVisibleColumnsChange,
  selectedViewId,
  onSelectView,
  toolbarExtra,
  placeholder,
  className,
}: Readonly<QueryViewProps<T>>) {
  const { query, params, setPage, setPageSize, toggleSort, setPresets, setGroupBy } =
    queryEndpoint;

  return (
    <div data-slot="query-view" className={`flex flex-col gap-4 ${className ?? ''}`}>
      {/* Smart filter bar */}
      <SmartFilterBar smartFilter={smartFilter} placeholder={placeholder} />

      {/* Filter presets */}
      {metadata.presetFilterGroups.length > 0 && (
        <FilterPresets
          groups={metadata.presetFilterGroups}
          activePresets={params.presets ?? {}}
          onToggle={setPresets}
        />
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {metadata.groupByFields.length > 0 && (
            <GroupBySelector
              fields={metadata.groupByFields}
              value={params.groupBy}
              onValueChange={setGroupBy}
            />
          )}
          {toolbarExtra}
        </div>
        <div className="flex items-center gap-2">
          {visibleColumns && onVisibleColumnsChange && (
            <ColumnVisibility
              columns={metadata.columns}
              visibleColumns={visibleColumns}
              onVisibilityChange={onVisibleColumnsChange}
            />
          )}
          {savedViews && onSelectView && (
            <SavedViewSelector
              savedViews={savedViews}
              selectedViewId={selectedViewId}
              onSelect={onSelectView}
            />
          )}
        </div>
      </div>

      {/* Data table */}
      <QueryDataTable
        columns={columns}
        data={(query.data?.items ?? []) as readonly T[]}
        totalCount={query.data?.totalCount ?? 0}
        isLoading={query.isLoading}
        page={params.page}
        pageSize={params.pageSize}
        sort={params.sort}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        onToggleSort={toggleSort}
      />
    </div>
  );
}
