import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { EntityActivityFeed } from '../components/entity-activity-feed.js';

import type { ActivityFeedEntryDto } from '../types/index.js';

const ENTRIES: ActivityFeedEntryDto[] = [
  {
    id: 'a-1',
    title: 'Consultation ajoutée',
    body: 'Première consultation',
    severity: 'info',
    createdAt: '2026-01-15T10:00:00Z',
    userId: 'u-1',
    userDisplayName: 'Dr. Martin',
  },
  {
    id: 'a-2',
    title: 'Prescription modifiée',
    body: null,
    severity: 'warning',
    createdAt: '2026-01-14T10:00:00Z',
    userId: 'u-2',
    userDisplayName: 'Dr. Dupont',
  },
];

describe('EntityActivityFeed', () => {
  it('renders entries', () => {
    render(
      <EntityActivityFeed
        entries={ENTRIES}
        loading={false}
        loadingMore={false}
        hasMore={false}
      />,
    );

    const items = screen.getAllByTestId('activity-feed-entry');
    expect(items).toHaveLength(2);
    expect(screen.getByText('Consultation ajoutée')).toBeInTheDocument();
    expect(screen.getByText('Dr. Martin')).toBeInTheDocument();
  });

  it('shows empty message when no entries', () => {
    render(
      <EntityActivityFeed
        entries={[]}
        loading={false}
        loadingMore={false}
        hasMore={false}
        emptyMessage="Pas d'activité"
      />,
    );

    expect(screen.getByTestId('activity-feed-empty')).toHaveTextContent("Pas d'activité");
  });

  it('shows loading state', () => {
    render(
      <EntityActivityFeed
        entries={[]}
        loading={true}
        loadingMore={false}
        hasMore={false}
      />,
    );

    expect(screen.getByTestId('activity-feed-loading')).toBeInTheDocument();
  });

  it('renders load more button when hasMore', async () => {
    const onLoadMore = vi.fn();
    const user = userEvent.setup();

    render(
      <EntityActivityFeed
        entries={ENTRIES}
        loading={false}
        loadingMore={false}
        hasMore={true}
        onLoadMore={onLoadMore}
      />,
    );

    await user.click(screen.getByTestId('activity-feed-load-more'));

    expect(onLoadMore).toHaveBeenCalled();
  });

  it('disables load more button when loadingMore', () => {
    render(
      <EntityActivityFeed
        entries={ENTRIES}
        loading={false}
        loadingMore={true}
        hasMore={true}
      />,
    );

    expect(screen.getByTestId('activity-feed-load-more')).toBeDisabled();
  });

  it('sets data-severity on entries', () => {
    render(
      <EntityActivityFeed
        entries={ENTRIES}
        loading={false}
        loadingMore={false}
        hasMore={false}
      />,
    );

    const items = screen.getAllByTestId('activity-feed-entry');
    expect(items[0]).toHaveAttribute('data-severity', 'info');
    expect(items[1]).toHaveAttribute('data-severity', 'warning');
  });
});
