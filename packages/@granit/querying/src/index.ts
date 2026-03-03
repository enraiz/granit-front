// ---------------------------------------------------------------------------
// @granit/querying — public API
// ---------------------------------------------------------------------------

// Types
export type {
  ColumnDefinition,
  CreateSavedViewRequest,
  DateFilterMeta,
  DatePeriod,
  FilterEntry,
  FilterGroupMeta,
  FilterOperator,
  FilterSuggestion,
  FilterSuggestionValue,
  FilterToken,
  FilterTokenType,
  FilterableField,
  GroupByField,
  GroupEntry,
  GroupedResult,
  PagedResult,
  PaginationMeta,
  PresetMeta,
  QueryMetadata,
  QueryParams,
  QuickFilterMeta,
  SavedViewSummary,
  SmartFilterPhase,
  SortDirection,
  SortEntry,
  SortableField,
  UpdateSavedViewRequest,
} from './types/index.js';

// Utils
export {
  BOOLEAN_OPERATORS,
  DATE_OPERATORS,
  ENUM_OPERATORS,
  NUMBER_OPERATORS,
  OPERATOR_LABELS,
  STRING_OPERATORS,
  inferOperators,
} from './utils/filter-operators.js';

// API
export { fetchGrouped, fetchPage, fetchQueryMeta } from './api/query-api.js';
export { parseQueryParams, serializeQueryParams } from './api/query-param-serializer.js';
export {
  createSavedView,
  deleteSavedView,
  fetchSavedViews,
  setDefaultSavedView,
  updateSavedView,
} from './api/saved-views-api.js';

// Provider
export { QueryProvider, buildQueryKey, useQueryConfig } from './providers/query-provider.js';
export type { QueryConfig, QueryProviderProps } from './providers/query-provider.js';

// Hooks
export { useQueryEndpoint } from './hooks/use-query-endpoint.js';
export type { UseQueryEndpointOptions, UseQueryEndpointReturn } from './hooks/use-query-endpoint.js';
export { useQueryMeta } from './hooks/use-query-meta.js';
export { useSavedViews } from './hooks/use-saved-views.js';
export type { UseSavedViewsReturn } from './hooks/use-saved-views.js';
export { useSmartFilter } from './hooks/use-smart-filter.js';
export type { UseSmartFilterOptions, UseSmartFilterReturn } from './hooks/use-smart-filter.js';

// Components
export { BulkActions } from './components/bulk-actions.js';
export type { BulkAction, BulkActionsProps } from './components/bulk-actions.js';
export { ColumnVisibility } from './components/column-visibility.js';
export type { ColumnVisibilityProps } from './components/column-visibility.js';
export { DatePeriodPicker } from './components/date-period-picker.js';
export type { DatePeriodPickerProps } from './components/date-period-picker.js';
export { FilterPresets } from './components/filter-presets.js';
export type { FilterPresetsProps } from './components/filter-presets.js';
export { GroupByRows } from './components/group-by-rows.js';
export type { GroupByRowsProps } from './components/group-by-rows.js';
export { GroupBySelector } from './components/group-by-selector.js';
export type { GroupBySelectorProps } from './components/group-by-selector.js';
export { QueryDataTable } from './components/query-data-table/query-data-table.js';
export type { QueryDataTableProps } from './components/query-data-table/query-data-table.js';
export { QueryView } from './components/query-view.js';
export type { QueryViewProps } from './components/query-view.js';
export { SavedViewSelector } from './components/saved-view-selector.js';
export type { SavedViewSelectorProps } from './components/saved-view-selector.js';
export { SmartFilterBar } from './components/smart-filter-bar/smart-filter-bar.js';
export type { SmartFilterBarProps } from './components/smart-filter-bar/smart-filter-bar.js';
