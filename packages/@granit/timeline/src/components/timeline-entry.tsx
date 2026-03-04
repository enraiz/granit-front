import { Button } from '@granit/ui';
import { useCallback } from 'react';


import { TimelineEntryType } from '../types/index.js';

import type { TimelineStreamEntry } from '../types/index.js';

export interface TimelineEntryProps {
  entry: TimelineStreamEntry;
  depth?: number;
  onReply?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  renderBody?: (body: string) => React.ReactNode;
  className?: string;
}

const ENTRY_TYPE_LABELS: Record<number, string> = {
  [TimelineEntryType.Comment]: 'comment',
  [TimelineEntryType.InternalNote]: 'internal-note',
  [TimelineEntryType.SystemLog]: 'system-log',
};

export function TimelineEntry({
  entry,
  depth = 0,
  onReply,
  onDelete,
  renderBody,
  className,
}: Readonly<TimelineEntryProps>) {
  const handleReply = useCallback(() => {
    onReply?.(entry.id);
  }, [onReply, entry.id]);

  const handleDelete = useCallback(() => {
    onDelete?.(entry.id);
  }, [onDelete, entry.id]);

  const entryTypeClass = ENTRY_TYPE_LABELS[entry.entryType] ?? 'unknown';
  const isSystemLog = entry.entryType === TimelineEntryType.SystemLog;

  return (
    <article
      className={className}
      data-testid="timeline-entry"
      data-entry-type={entryTypeClass}
      data-depth={depth}
      style={depth > 0 ? { marginLeft: `${depth * 24}px` } : undefined}
      aria-label={`${entryTypeClass} by ${entry.authorDisplayName}`}
    >
      <header data-testid="timeline-entry-header">
        <span data-testid="timeline-entry-author">{entry.authorDisplayName}</span>
        <time dateTime={entry.createdAt} data-testid="timeline-entry-time">
          {new Date(entry.createdAt).toLocaleString()}
        </time>
      </header>

      <div data-testid="timeline-entry-body">
        {renderBody ? renderBody(entry.body) : entry.body}
      </div>

      {!isSystemLog && (
        <footer data-testid="timeline-entry-actions">
          {onReply && (
            <Button variant="ghost" size="sm" onClick={handleReply} data-testid="timeline-reply-btn">
              Reply
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" size="sm" onClick={handleDelete} data-testid="timeline-delete-btn">
              Delete
            </Button>
          )}
        </footer>
      )}
    </article>
  );
}
