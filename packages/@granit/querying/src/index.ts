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
