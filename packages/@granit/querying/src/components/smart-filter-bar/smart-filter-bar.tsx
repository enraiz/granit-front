// ---------------------------------------------------------------------------
// SmartFilterBar — cmdk-powered omnibox for filters (Story #52)
// ---------------------------------------------------------------------------

import { Popover, PopoverContent, PopoverTrigger } from '@granit/ui';
import { Command } from 'cmdk';
import { SearchIcon, XCircleIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';

import { FacetBadge } from './facet-badge.js';
import { SuggestionList } from './suggestion-list.js';

import type { UseSmartFilterReturn } from '../../hooks/use-smart-filter.js';
import type { FilterSuggestion, SmartFilterPhase } from '../../types/smart-filter.js';
import type { KeyboardEvent } from 'react';



export interface SmartFilterBarProps {
  /** The useSmartFilter return value. */
  readonly smartFilter: UseSmartFilterReturn;
  /** Placeholder text. */
  readonly placeholder?: string;
  /** CSS class for the root container. */
  readonly className?: string;
}

/**
 * Omnibox-style filter bar with cmdk suggestions dropdown.
 *
 * Renders active filter tokens as badges and provides a search input
 * with suggestions for fields, operators, presets, and quick filters.
 *
 * @example
 * ```tsx
 * const smartFilter = useSmartFilter({ metadata });
 * <SmartFilterBar smartFilter={smartFilter} placeholder="Search or filter..." />
 * ```
 */
export function SmartFilterBar({
  smartFilter,
  placeholder = 'Search or filter...',
  className,
}: Readonly<SmartFilterBarProps>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    phase,
    inputValue,
    tokens,
    suggestions,
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
  } = smartFilter;

  const handleSelect = useCallback(
    (suggestion: FilterSuggestion) => {
      switch (suggestion.type) {
        case 'filter':
          if (phase === 'idle' || phase === 'selectField') {
            if (suggestion.field) selectField(suggestion.field);
          } else if (phase === 'selectOperator') {
            // suggestion.label is the operator string
            selectOperator(suggestion.label as Parameters<typeof selectOperator>[0]);
          }
          break;
        case 'preset':
          if (suggestion.group && suggestion.name) {
            addPresetToken(suggestion.group, suggestion.name, suggestion.label);
          }
          break;
        case 'quickFilter':
          if (suggestion.name) {
            addQuickFilterToken(suggestion.name, suggestion.label);
          }
          break;
      }
      inputRef.current?.focus();
    },
    [phase, selectField, selectOperator, addPresetToken, addQuickFilterToken],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && inputValue.trim()) {
        if (phase === 'enterValue') {
          confirmValue(inputValue.trim());
        } else if (phase === 'idle' || phase === 'selectField') {
          addSearchToken(inputValue.trim());
        }
        e.preventDefault();
      } else if (e.key === 'Escape') {
        cancel();
        e.preventDefault();
      } else if (e.key === 'Backspace' && !inputValue && tokens.length > 0) {
        removeToken(tokens.at(-1)!.id);
        e.preventDefault();
      }
    },
    [inputValue, phase, tokens, confirmValue, addSearchToken, cancel, removeToken],
  );

  const showSuggestions = suggestions.length > 0 && phase !== 'enterValue';

  const PHASE_HINTS: Partial<Record<SmartFilterPhase, string>> = {
    selectOperator: 'Select operator',
    enterValue: 'Enter value, press Enter',
  };
  const phaseHint = PHASE_HINTS[phase];

  return (
    <div data-slot="smart-filter-bar" className={className}>
      <Popover open={showSuggestions}>
        <PopoverTrigger asChild>
          <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2">
            <SearchIcon className="size-4 shrink-0 text-muted-foreground" />
            {tokens.map((token) => (
              <FacetBadge key={token.id} token={token} onRemove={removeToken} />
            ))}
            <Command shouldFilter={false} className="flex-1">
              <Command.Input
                ref={inputRef}
                value={inputValue}
                onValueChange={setInput}
                onKeyDown={handleKeyDown}
                placeholder={phaseHint ?? placeholder}
                data-slot="smart-filter-input"
                className="min-w-[120px] flex-1 border-0 bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground focus:ring-0"
              />
            </Command>
            {tokens.length > 0 && (
              <button
                type="button"
                aria-label="Clear all filters"
                className="shrink-0 text-muted-foreground hover:text-foreground"
                onClick={clearAll}
              >
                <XCircleIcon className="size-4" />
              </button>
            )}
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-[var(--radix-popover-trigger-width)] p-0"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command shouldFilter={false}>
            <SuggestionList suggestions={suggestions} onSelect={handleSelect} />
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
