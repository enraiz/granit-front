// ---------------------------------------------------------------------------
// useSmartFilter — state machine for the SmartFilterBar (Story #51)
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useReducer } from 'react';

import type { QueryMetadata } from '../types/query-metadata.js';
import type { FilterEntry, FilterOperator } from '../types/query-params.js';
import type {
  FilterSuggestion,
  FilterToken,
  SmartFilterPhase,
} from '../types/smart-filter.js';

// ---------------------------------------------------------------------------
// State
// ---------------------------------------------------------------------------

interface SmartFilterState {
  readonly phase: SmartFilterPhase;
  readonly inputValue: string;
  readonly tokens: readonly FilterToken[];
  /** Selected field (during selectOperator / enterValue phases). */
  readonly selectedField?: string;
  /** Selected operator (during enterValue phase). */
  readonly selectedOperator?: FilterOperator;
  /** Counter for generating unique token IDs. */
  readonly nextId: number;
}

type SmartFilterAction =
  | { type: 'SET_INPUT'; value: string }
  | { type: 'SELECT_FIELD'; field: string }
  | { type: 'SELECT_OPERATOR'; operator: FilterOperator }
  | { type: 'CONFIRM_VALUE'; value: string }
  | { type: 'ADD_PRESET_TOKEN'; group: string; name: string; label: string }
  | { type: 'ADD_QUICK_FILTER_TOKEN'; name: string; label: string }
  | { type: 'ADD_SEARCH_TOKEN'; value: string }
  | { type: 'REMOVE_TOKEN'; id: string }
  | { type: 'CLEAR_ALL' }
  | { type: 'CANCEL' }
  | { type: 'SYNC_TOKENS'; tokens: readonly FilterToken[] };

function smartFilterReducer(
  state: SmartFilterState,
  action: SmartFilterAction,
): SmartFilterState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputValue: action.value };

    case 'SELECT_FIELD':
      return {
        ...state,
        phase: 'selectOperator',
        selectedField: action.field,
        inputValue: '',
      };

    case 'SELECT_OPERATOR':
      return {
        ...state,
        phase: 'enterValue',
        selectedOperator: action.operator,
        inputValue: '',
      };

    case 'CONFIRM_VALUE': {
      const token: FilterToken = {
        id: `filter-${state.nextId}`,
        type: 'filter',
        label: `${state.selectedField} ${state.selectedOperator} ${action.value}`,
        field: state.selectedField,
        operator: state.selectedOperator,
        value: action.value,
      };
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        selectedField: undefined,
        selectedOperator: undefined,
        tokens: [...state.tokens, token],
        nextId: state.nextId + 1,
      };
    }

    case 'ADD_PRESET_TOKEN': {
      // Remove existing token for same group, then add
      const filtered = state.tokens.filter(
        (t) => !(t.type === 'preset' && t.group === action.group),
      );
      const token: FilterToken = {
        id: `preset-${state.nextId}`,
        type: 'preset',
        label: action.label,
        group: action.group,
        name: action.name,
      };
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        tokens: [...filtered, token],
        nextId: state.nextId + 1,
      };
    }

    case 'ADD_QUICK_FILTER_TOKEN': {
      // Toggle: remove if exists, add if not
      const existing = state.tokens.find(
        (t) => t.type === 'quickFilter' && t.name === action.name,
      );
      if (existing) {
        return {
          ...state,
          tokens: state.tokens.filter((t) => t.id !== existing.id),
        };
      }
      const token: FilterToken = {
        id: `qf-${state.nextId}`,
        type: 'quickFilter',
        label: action.label,
        name: action.name,
      };
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        tokens: [...state.tokens, token],
        nextId: state.nextId + 1,
      };
    }

    case 'ADD_SEARCH_TOKEN': {
      // Replace existing search token
      const filtered = state.tokens.filter((t) => t.type !== 'search');
      const token: FilterToken = {
        id: `search-${state.nextId}`,
        type: 'search',
        label: action.value,
      };
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        tokens: [...filtered, token],
        nextId: state.nextId + 1,
      };
    }

    case 'REMOVE_TOKEN':
      return {
        ...state,
        tokens: state.tokens.filter((t) => t.id !== action.id),
      };

    case 'CLEAR_ALL':
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        selectedField: undefined,
        selectedOperator: undefined,
        tokens: [],
      };

    case 'CANCEL':
      return {
        ...state,
        phase: 'idle',
        inputValue: '',
        selectedField: undefined,
        selectedOperator: undefined,
      };

    case 'SYNC_TOKENS':
      return { ...state, tokens: action.tokens };
  }
}

// ---------------------------------------------------------------------------
// Suggestion builder
// ---------------------------------------------------------------------------

function buildSuggestions(
  state: SmartFilterState,
  metadata: QueryMetadata | undefined,
): readonly FilterSuggestion[] {
  if (!metadata) return [];
  const input = state.inputValue.toLowerCase();

  switch (state.phase) {
    case 'idle':
    case 'selectField': {
      const suggestions: FilterSuggestion[] = [];

      // Filterable fields
      for (const field of metadata.filterableFields) {
        const col = metadata.columns.find((c) => c.name === field.name);
        const label = col?.label ?? field.name;
        if (input && !label.toLowerCase().includes(input) && !field.name.toLowerCase().includes(input)) {
          continue;
        }
        suggestions.push({
          id: `field-${field.name}`,
          type: 'filter',
          label,
          description: `Filter by ${label}`,
          field: field.name,
          operators: field.operators,
        });
      }

      // Presets
      for (const group of metadata.presetFilterGroups) {
        for (const preset of group.presets) {
          if (input && !preset.label.toLowerCase().includes(input)) continue;
          suggestions.push({
            id: `preset-${group.name}-${preset.name}`,
            type: 'preset',
            label: preset.label,
            description: group.label,
            group: group.name,
            name: preset.name,
          });
        }
      }

      // Quick filters
      for (const qf of metadata.quickFilters) {
        if (input && !qf.label.toLowerCase().includes(input)) continue;
        suggestions.push({
          id: `qf-${qf.name}`,
          type: 'quickFilter',
          label: qf.label,
          name: qf.name,
        });
      }

      return suggestions;
    }

    case 'selectOperator': {
      const field = metadata.filterableFields.find((f) => f.name === state.selectedField);
      if (!field) return [];
      return field.operators.map((op) => ({
        id: `op-${op}`,
        type: 'filter' as const,
        label: op,
        field: field.name,
      }));
    }

    case 'enterValue':
      // Value entry — no suggestions by default (could be extended with enum values)
      return [];
  }
}

// ---------------------------------------------------------------------------
// Hook options & return
// ---------------------------------------------------------------------------

export interface UseSmartFilterOptions {
  /** Query metadata for building suggestions. */
  readonly metadata?: QueryMetadata;
}

export interface UseSmartFilterReturn {
  readonly phase: SmartFilterPhase;
  readonly inputValue: string;
  readonly tokens: readonly FilterToken[];
  readonly suggestions: readonly FilterSuggestion[];
  /** Extracted FilterEntry array from current tokens (for useQueryEndpoint). */
  readonly filters: readonly FilterEntry[];
  /** Extracted search string from tokens. */
  readonly search: string | undefined;
  /** Extracted presets from tokens. */
  readonly presets: Readonly<Record<string, readonly string[]>>;
  /** Extracted quick filter names from tokens. */
  readonly quickFilters: readonly string[];
  // Actions
  readonly setInput: (value: string) => void;
  readonly selectField: (field: string) => void;
  readonly selectOperator: (operator: FilterOperator) => void;
  readonly confirmValue: (value: string) => void;
  readonly addPresetToken: (group: string, name: string, label: string) => void;
  readonly addQuickFilterToken: (name: string, label: string) => void;
  readonly addSearchToken: (value: string) => void;
  readonly removeToken: (id: string) => void;
  readonly clearAll: () => void;
  readonly cancel: () => void;
}

/**
 * State machine hook for the SmartFilterBar.
 *
 * Manages the input flow (field → operator → value), token lifecycle,
 * and suggestion generation based on query metadata.
 *
 * @example
 * ```tsx
 * const { tokens, suggestions, phase, selectField, confirmValue } = useSmartFilter({
 *   metadata: queryMeta.data,
 * });
 * ```
 */
export function useSmartFilter(options?: UseSmartFilterOptions): UseSmartFilterReturn {
  const [state, dispatch] = useReducer(smartFilterReducer, {
    phase: 'idle',
    inputValue: '',
    tokens: [],
    nextId: 1,
  });

  const suggestions = useMemo(
    () => buildSuggestions(state, options?.metadata),
    [state, options?.metadata],
  );

  // Extract structured data from tokens
  const filters = useMemo<readonly FilterEntry[]>(
    () =>
      state.tokens
        .filter((t) => t.type === 'filter' && t.field && t.operator && t.value)
        .map((t) => ({
          field: t.field!,
          operator: t.operator!,
          value: t.value!,
        })),
    [state.tokens],
  );

  const search = useMemo(() => {
    const searchToken = state.tokens.find((t) => t.type === 'search');
    return searchToken?.label;
  }, [state.tokens]);

  const presets = useMemo(() => {
    const result: Record<string, string[]> = {};
    for (const t of state.tokens) {
      if (t.type === 'preset' && t.group && t.name) {
        result[t.group] ??= [];
        result[t.group].push(t.name);
      }
    }
    return result;
  }, [state.tokens]);

  const quickFilters = useMemo(
    () =>
      state.tokens
        .filter((t) => t.type === 'quickFilter' && t.name)
        .map((t) => t.name!),
    [state.tokens],
  );

  // Memoized dispatchers
  const setInput = useCallback((value: string) => dispatch({ type: 'SET_INPUT', value }), []);
  const selectField = useCallback((field: string) => dispatch({ type: 'SELECT_FIELD', field }), []);
  const selectOperator = useCallback((operator: FilterOperator) => dispatch({ type: 'SELECT_OPERATOR', operator }), []);
  const confirmValue = useCallback((value: string) => dispatch({ type: 'CONFIRM_VALUE', value }), []);
  const addPresetToken = useCallback(
    (group: string, name: string, label: string) =>
      dispatch({ type: 'ADD_PRESET_TOKEN', group, name, label }),
    [],
  );
  const addQuickFilterToken = useCallback(
    (name: string, label: string) =>
      dispatch({ type: 'ADD_QUICK_FILTER_TOKEN', name, label }),
    [],
  );
  const addSearchToken = useCallback((value: string) => dispatch({ type: 'ADD_SEARCH_TOKEN', value }), []);
  const removeToken = useCallback((id: string) => dispatch({ type: 'REMOVE_TOKEN', id }), []);
  const clearAll = useCallback(() => dispatch({ type: 'CLEAR_ALL' }), []);
  const cancel = useCallback(() => dispatch({ type: 'CANCEL' }), []);

  return {
    phase: state.phase,
    inputValue: state.inputValue,
    tokens: state.tokens,
    suggestions,
    filters,
    search,
    presets,
    quickFilters,
    setInput,
    selectField,
    selectOperator,
    confirmValue,
    addPresetToken,
    addQuickFilterToken,
    addSearchToken,
    removeToken,
    clearAll,
    cancel,
  };
}
