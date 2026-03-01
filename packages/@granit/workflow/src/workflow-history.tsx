import type { TransitionHistoryDto } from './types.ts';

export interface WorkflowHistoryProps {
  readonly history: readonly TransitionHistoryDto[];
  readonly loading?: boolean;
  readonly emptyMessage?: string;
  readonly className?: string;
}

/**
 * Displays the workflow transition history (HDS audit trail).
 *
 * Renders each transition as a row showing: previous state -> new state,
 * author, date, and optional comment.
 */
export function WorkflowHistory({
  history,
  loading = false,
  emptyMessage = 'No transitions yet.',
  className,
}: WorkflowHistoryProps) {
  if (loading) {
    return (
      <div className={className} data-testid="workflow-history-loading">
        Loading…
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className={className} data-testid="workflow-history-empty">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className={className} data-testid="workflow-history">
      {history.map((entry, index) => (
        <li
          key={`${entry.transitionedAt}-${index}`}
          data-testid="workflow-history-entry"
        >
          <span data-testid="workflow-history-states">
            {entry.previousState} → {entry.newState}
          </span>
          <span data-testid="workflow-history-author">
            {entry.transitionedBy}
          </span>
          <time
            dateTime={entry.transitionedAt}
            data-testid="workflow-history-date"
          >
            {entry.transitionedAt}
          </time>
          {entry.comment && (
            <span data-testid="workflow-history-comment">
              {entry.comment}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
