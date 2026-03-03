// ---------------------------------------------------------------------------
// Smart filter — types for the SmartFilterBar (cmdk omnibox)
// ---------------------------------------------------------------------------

import type { FilterOperator } from './query-params.js';

/** Token type within the smart filter bar. */
export type FilterTokenType = 'filter' | 'preset' | 'quickFilter' | 'search';

/** A resolved token displayed as a badge in the SmartFilterBar. */
export interface FilterToken {
  readonly id: string;
  readonly type: FilterTokenType;
  /** Display label (e.g. "Statut = Actif"). */
  readonly label: string;
  /** For filter tokens: field name. */
  readonly field?: string;
  /** For filter tokens: operator. */
  readonly operator?: FilterOperator;
  /** For filter tokens: value(s). */
  readonly value?: string;
  /** For preset tokens: group name. */
  readonly group?: string;
  /** For preset/quickFilter tokens: preset/quick filter name. */
  readonly name?: string;
}

/** A suggestion shown in the cmdk dropdown. */
export interface FilterSuggestion {
  readonly id: string;
  readonly type: FilterTokenType;
  /** Display label. */
  readonly label: string;
  /** Secondary description. */
  readonly description?: string;
  /** For field suggestions: field name. */
  readonly field?: string;
  /** For operator suggestions: available operators. */
  readonly operators?: readonly FilterOperator[];
  /** For value suggestions: suggested values. */
  readonly values?: readonly FilterSuggestionValue[];
  /** For preset suggestions: group name. */
  readonly group?: string;
  /** For preset/quickFilter suggestions: name. */
  readonly name?: string;
}

/** A suggested value (e.g. enum values, recent values). */
export interface FilterSuggestionValue {
  readonly value: string;
  readonly label: string;
}

/** State machine phases for the smart filter input flow. */
export type SmartFilterPhase =
  | 'idle'
  | 'selectField'
  | 'selectOperator'
  | 'enterValue';
