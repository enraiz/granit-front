// ---------------------------------------------------------------------------
// Shared mock data for @granit/querying Storybook stories
// ---------------------------------------------------------------------------

import type {
  ColumnDefinition,
  DateFilterMeta,
  FilterGroupMeta,
  FilterableField,
  GroupByField,
  QueryMetadata,
  QuickFilterMeta,
  SavedViewSummary,
  SortableField,
} from '@granit/querying';

// ---------------------------------------------------------------------------
// Columns
// ---------------------------------------------------------------------------

export const mockColumns: ColumnDefinition[] = [
  { name: 'id', label: 'ID', type: 'Int32', order: 0, isSortable: true, isFilterable: false, isVisible: true },
  { name: 'lastName', label: 'Last Name', type: 'String', order: 1, isSortable: true, isFilterable: true, isVisible: true },
  { name: 'firstName', label: 'First Name', type: 'String', order: 2, isSortable: true, isFilterable: true, isVisible: true },
  { name: 'email', label: 'Email', type: 'String', order: 3, isSortable: false, isFilterable: true, isVisible: true },
  { name: 'status', label: 'Status', type: 'Enum', order: 4, isSortable: true, isFilterable: true, isVisible: true },
];

// ---------------------------------------------------------------------------
// Filterable fields
// ---------------------------------------------------------------------------

export const mockFilterableFields: FilterableField[] = [
  { name: 'lastName', type: 'String', operators: ['Eq', 'Contains', 'StartsWith', 'EndsWith'] },
  { name: 'email', type: 'String', operators: ['Eq', 'Contains', 'StartsWith', 'EndsWith'] },
  { name: 'status', type: 'Enum', operators: ['Eq', 'In'] },
];

// ---------------------------------------------------------------------------
// Sortable fields
// ---------------------------------------------------------------------------

export const mockSortableFields: SortableField[] = [
  { name: 'lastName' },
  { name: 'firstName' },
  { name: 'status' },
];

// ---------------------------------------------------------------------------
// Preset filter groups
// ---------------------------------------------------------------------------

export const mockPresetGroups: FilterGroupMeta[] = [
  {
    name: 'Status',
    label: 'Status',
    presets: [
      { name: 'All', label: 'All', isDefault: true },
      { name: 'Active', label: 'Active', isDefault: false },
      { name: 'Inactive', label: 'Inactive', isDefault: false },
    ],
  },
];

// ---------------------------------------------------------------------------
// Quick filters
// ---------------------------------------------------------------------------

export const mockQuickFilters: QuickFilterMeta[] = [
  { name: 'HasEmail', label: 'Has Email', isDefault: false },
  { name: 'IsVerified', label: 'Is Verified', isDefault: false },
];

// ---------------------------------------------------------------------------
// Group-by fields
// ---------------------------------------------------------------------------

export const mockGroupByFields: GroupByField[] = [
  { name: 'status', type: 'Enum' },
  { name: 'city', type: 'String' },
];

// ---------------------------------------------------------------------------
// Date filters
// ---------------------------------------------------------------------------

export const mockDateFilters: DateFilterMeta[] = [
  {
    name: 'createdAt',
    defaultPeriod: 'ThisMonth',
    availablePeriods: ['Today', 'ThisWeek', 'ThisMonth', 'ThisYear'],
  },
];

// ---------------------------------------------------------------------------
// Full metadata
// ---------------------------------------------------------------------------

export const mockMetadata: QueryMetadata = {
  columns: mockColumns,
  filterableFields: mockFilterableFields,
  sortableFields: mockSortableFields,
  presetFilterGroups: mockPresetGroups,
  quickFilters: mockQuickFilters,
  dateFilters: mockDateFilters,
  groupByFields: mockGroupByFields,
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
    supportsCursor: false,
  },
};

// ---------------------------------------------------------------------------
// Sample patient rows
// ---------------------------------------------------------------------------

export const mockPatients = [
  { id: '1', lastName: 'Dupont', firstName: 'Marie', email: 'marie.dupont@example.com', status: 'Active' },
  { id: '2', lastName: 'Martin', firstName: 'Jean', email: 'jean.martin@example.com', status: 'Active' },
  { id: '3', lastName: 'Bernard', firstName: 'Sophie', email: 'sophie.bernard@example.com', status: 'Inactive' },
  { id: '4', lastName: 'Petit', firstName: 'Pierre', email: 'pierre.petit@example.com', status: 'Active' },
  { id: '5', lastName: 'Robert', firstName: 'Claire', email: 'claire.robert@example.com', status: 'Active' },
  { id: '6', lastName: 'Richard', firstName: 'Luc', email: '', status: 'Inactive' },
  { id: '7', lastName: 'Moreau', firstName: 'Anne', email: 'anne.moreau@example.com', status: 'Active' },
  { id: '8', lastName: 'Simon', firstName: 'Paul', email: 'paul.simon@example.com', status: 'Active' },
  { id: '9', lastName: 'Laurent', firstName: 'Julie', email: '', status: 'Inactive' },
  { id: '10', lastName: 'Lefevre', firstName: 'Marc', email: 'marc.lefevre@example.com', status: 'Active' },
] as const;

// ---------------------------------------------------------------------------
// Saved views
// ---------------------------------------------------------------------------

export const mockSavedViews: SavedViewSummary[] = [
  { id: 'view-1', name: 'All Patients', isShared: true, isDefault: true },
  { id: 'view-2', name: 'Active Only', isShared: false, isDefault: false },
  { id: 'view-3', name: 'Recent', isShared: false, isDefault: false },
];
