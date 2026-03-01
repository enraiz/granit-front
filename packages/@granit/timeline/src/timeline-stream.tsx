import { useCallback, useMemo } from 'react';

import { TimelineEntry } from './timeline-entry.tsx';

import type { TimelineEntryProps } from './timeline-entry.tsx';
import type { TimelineStreamEntry } from './types.ts';

export interface TimelineStreamProps {
  entries: TimelineStreamEntry[];
  loading?: boolean;
  loadingMore?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  onReply?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  renderEntry?: (props: TimelineEntryProps) => React.ReactNode;
  renderBody?: (body: string) => React.ReactNode;
  className?: string;
  emptyMessage?: string;
}

interface ThreadedEntry {
  entry: TimelineStreamEntry;
  depth: number;
}

function buildThreadedList(entries: TimelineStreamEntry[]): ThreadedEntry[] {
  const rootEntries: TimelineStreamEntry[] = [];
  const childrenMap = new Map<string, TimelineStreamEntry[]>();

  for (const entry of entries) {
    if (entry.parentEntryId) {
      const siblings = childrenMap.get(entry.parentEntryId) ?? [];
      siblings.push(entry);
      childrenMap.set(entry.parentEntryId, siblings);
    } else {
      rootEntries.push(entry);
    }
  }

  const result: ThreadedEntry[] = [];

  function addWithChildren(entry: TimelineStreamEntry, depth: number) {
    result.push({ entry, depth });
    const children = childrenMap.get(entry.id);
    if (children) {
      for (const child of children) {
        addWithChildren(child, depth + 1);
      }
    }
  }

  for (const root of rootEntries) {
    addWithChildren(root, 0);
  }

  return result;
}

export function TimelineStream({
  entries,
  loading = false,
  loadingMore = false,
  hasMore = false,
  onLoadMore,
  onReply,
  onDelete,
  renderEntry,
  renderBody,
  className,
  emptyMessage = 'No entries yet.',
}: Readonly<TimelineStreamProps>) {
  const threadedEntries = useMemo(() => buildThreadedList(entries), [entries]);

  const handleLoadMore = useCallback(() => {
    onLoadMore?.();
  }, [onLoadMore]);

  if (loading) {
    return (
      <div className={className} role="status" aria-label="Loading timeline">
        <span data-testid="timeline-loading">Loading…</span>
      </div>
    );
  }

  if (threadedEntries.length === 0) {
    return (
      <div className={className} data-testid="timeline-empty">
        {emptyMessage}
      </div>
    );
  }

  return (
    <section className={className} aria-label="Timeline" data-testid="timeline-stream">
      {threadedEntries.map(({ entry, depth }) => {
        const entryProps: TimelineEntryProps = {
          entry,
          depth,
          onReply,
          onDelete,
          renderBody,
        };

        return renderEntry ? (
          <div key={entry.id}>{renderEntry(entryProps)}</div>
        ) : (
          <TimelineEntry key={entry.id} {...entryProps} />
        );
      })}

      {hasMore && (
        <div data-testid="timeline-load-more">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            data-testid="timeline-load-more-btn"
          >
            {loadingMore ? 'Loading…' : 'Load more'}
          </button>
        </div>
      )}
    </section>
  );
}
