import type { ActivityFeedEntryDto } from '../types/index.js';

export interface EntityActivityFeedProps {
  entries: ActivityFeedEntryDto[];
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  renderEntry?: (entry: ActivityFeedEntryDto) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

/**
 * Headless Odoo-style activity feed bound to a single entity.
 */
export function EntityActivityFeed({
  entries,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
  renderEntry,
  emptyMessage = 'Aucune activité',
  className,
}: Readonly<EntityActivityFeedProps>) {
  return (
    <section
      data-testid="entity-activity-feed"
      className={className}
      aria-label="Fil d'activité"
    >
      {loading && entries.length === 0 && (
        <div data-testid="activity-feed-loading" aria-busy="true">
          Chargement…
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div data-testid="activity-feed-empty">{emptyMessage}</div>
      )}

      {entries.length > 0 && (
        <ol data-testid="activity-feed-list" role="list">
          {entries.map((entry) => (
            <li key={entry.id} data-testid="activity-feed-entry" data-severity={entry.severity}>
              {renderEntry ? (
                renderEntry(entry)
              ) : (
                <article>
                  <header>
                    {entry.userDisplayName && (
                      <span data-testid="activity-author">{entry.userDisplayName}</span>
                    )}
                    <time data-testid="activity-time" dateTime={entry.createdAt}>
                      {entry.createdAt}
                    </time>
                  </header>
                  <span data-testid="activity-title">{entry.title}</span>
                  {entry.body && (
                    <p data-testid="activity-body">{entry.body}</p>
                  )}
                </article>
              )}
            </li>
          ))}
        </ol>
      )}

      {hasMore && (
        <button
          data-testid="activity-feed-load-more"
          type="button"
          onClick={onLoadMore}
          disabled={loadingMore}
        >
          {loadingMore ? 'Chargement…' : 'Charger plus'}
        </button>
      )}
    </section>
  );
}
