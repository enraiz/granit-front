import { useCallback, useEffect, useRef, useState } from 'react';

import { TimelineEntryType } from './types.ts';

import type {
  CreateTimelineEntryRequest,
  MentionSuggestion,
  TimelineEntryTypeValue,
} from './types.ts';

export interface TimelineComposerProps {
  onSubmit: (request: CreateTimelineEntryRequest) => Promise<void>;
  parentEntryId?: string;
  entryTypes?: TimelineEntryTypeValue[];
  searchMentions?: (query: string) => Promise<MentionSuggestion[]>;
  placeholder?: string;
  submitLabel?: string;
  className?: string;
}

const MENTION_TRIGGER = '@';
const MENTION_REGEX = /@(\w+)$/;

export function TimelineComposer({
  onSubmit,
  parentEntryId,
  entryTypes = [TimelineEntryType.Comment, TimelineEntryType.InternalNote],
  searchMentions,
  placeholder = 'Write a comment…',
  submitLabel = 'Send',
  className,
}: Readonly<TimelineComposerProps>) {
  const [body, setBody] = useState('');
  const [entryType, setEntryType] = useState<TimelineEntryTypeValue>(entryTypes[0]);
  const [submitting, setSubmitting] = useState(false);

  // Mention autocomplete state
  const [mentionQuery, setMentionQuery] = useState<string | null>(null);
  const [mentionSuggestions, setMentionSuggestions] = useState<MentionSuggestion[]>([]);
  const [mentionIndex, setMentionIndex] = useState(0);
  const [showMentions, setShowMentions] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleBodyChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setBody(value);

      if (!searchMentions) return;

      const cursorPos = e.target.selectionStart;
      const textBeforeCursor = value.slice(0, cursorPos);
      const match = MENTION_REGEX.exec(textBeforeCursor);

      if (match) {
        const query = match[1];
        setMentionQuery(query);
        setMentionIndex(0);

        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          void searchMentions(query).then((results) => {
            setMentionSuggestions(results);
            setShowMentions(results.length > 0);
          });
        }, 200);
      } else {
        setShowMentions(false);
        setMentionQuery(null);
      }
    },
    [searchMentions],
  );

  const insertMention = useCallback(
    (suggestion: MentionSuggestion) => {
      if (mentionQuery == null || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = body.slice(0, cursorPos);

      // Find the @ trigger position
      const triggerPos = textBeforeCursor.lastIndexOf(MENTION_TRIGGER);
      if (triggerPos === -1) return;

      const mention = `@[${suggestion.displayName}](user:${suggestion.id})`;
      const before = body.slice(0, triggerPos);
      const after = body.slice(cursorPos);
      const newBody = `${before}${mention} ${after}`;

      setBody(newBody);
      setShowMentions(false);
      setMentionQuery(null);

      // Restore focus after state update
      requestAnimationFrame(() => {
        const newCursorPos = triggerPos + mention.length + 1;
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      });
    },
    [body, mentionQuery],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (!showMentions || mentionSuggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setMentionIndex((prev) => Math.min(prev + 1, mentionSuggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setMentionIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        insertMention(mentionSuggestions[mentionIndex]);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setShowMentions(false);
      }
    },
    [showMentions, mentionSuggestions, mentionIndex, insertMention],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = body.trim();
      if (!trimmed || submitting) return;

      setSubmitting(true);
      try {
        await onSubmit({
          entryType,
          body: trimmed,
          parentEntryId,
        });
        setBody('');
      } finally {
        setSubmitting(false);
      }
    },
    [body, entryType, parentEntryId, submitting, onSubmit],
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <form
      onSubmit={(e) => void handleSubmit(e)}
      className={className}
      data-testid="timeline-composer"
    >
      {entryTypes.length > 1 && (
        <div data-testid="timeline-composer-type-selector">
          {entryTypes.map((type) => (
            <label key={type}>
              <input
                type="radio"
                name="entryType"
                value={type}
                checked={entryType === type}
                onChange={() => setEntryType(type)}
              />
              {type === TimelineEntryType.Comment && 'Comment'}
              {type === TimelineEntryType.InternalNote && 'Internal note'}
              {type === TimelineEntryType.SystemLog && 'System log'}
            </label>
          ))}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          value={body}
          onChange={handleBodyChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={submitting}
          rows={3}
          data-testid="timeline-composer-textarea"
          aria-label={placeholder}
        />

        {showMentions && mentionSuggestions.length > 0 && (
          <ul
            role="listbox"
            aria-label="Mention suggestions"
            data-testid="timeline-mention-list"
            style={{ position: 'absolute', bottom: '100%', left: 0 }}
          >
            {mentionSuggestions.map((suggestion, index) => (
              <li
                key={suggestion.id}
                role="option"
                aria-selected={index === mentionIndex}
                data-testid="timeline-mention-option"
                onClick={() => insertMention(suggestion)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') insertMention(suggestion);
                }}
              >
                {suggestion.displayName}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        disabled={!body.trim() || submitting}
        data-testid="timeline-composer-submit"
      >
        {submitting ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
