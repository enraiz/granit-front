// ---------------------------------------------------------------------------
// SuggestionList — cmdk command list for filter suggestions
// ---------------------------------------------------------------------------

import { Command } from 'cmdk';

import type { FilterSuggestion } from '../../types/smart-filter.js';

export interface SuggestionListProps {
  readonly suggestions: readonly FilterSuggestion[];
  readonly onSelect: (suggestion: FilterSuggestion) => void;
}

/**
 * Renders filter suggestions inside a cmdk Command.List.
 */
export function SuggestionList({ suggestions, onSelect }: Readonly<SuggestionListProps>) {
  if (suggestions.length === 0) {
    return (
      <Command.Empty data-slot="suggestion-empty">
        No suggestions found.
      </Command.Empty>
    );
  }

  return (
    <Command.List data-slot="suggestion-list">
      {suggestions.map((suggestion) => (
        <Command.Item
          key={suggestion.id}
          value={suggestion.label}
          data-slot="suggestion-item"
          data-suggestion-type={suggestion.type}
          onSelect={() => onSelect(suggestion)}
        >
          <span>{suggestion.label}</span>
          {suggestion.description && (
            <span className="ml-auto text-xs text-muted-foreground">
              {suggestion.description}
            </span>
          )}
        </Command.Item>
      ))}
    </Command.List>
  );
}
