import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';


import { TimelineStream } from '../components/timeline-stream.js';

import type { TimelineStreamEntry } from '../types/index.js';

function makeEntry(overrides: Partial<TimelineStreamEntry> = {}): TimelineStreamEntry {
  return {
    id: 'e-1',
    entityType: 'Patient',
    entityId: 'p-1',
    entryType: 0,
    body: 'Test comment',
    authorId: 'u-1',
    authorDisplayName: 'Dr. Martin',
    parentEntryId: null,
    createdAt: '2026-01-01T00:00:00Z',
    attachmentBlobIds: [],
    ...overrides,
  };
}

describe('TimelineStream', () => {
  it('should show loading state', () => {
    render(<TimelineStream entries={[]} loading={true} />);
    expect(screen.getByTestId('timeline-loading')).toBeTruthy();
  });

  it('should show empty message when no entries', () => {
    render(<TimelineStream entries={[]} />);
    expect(screen.getByTestId('timeline-empty')).toBeTruthy();
    expect(screen.getByText('No entries yet.')).toBeTruthy();
  });

  it('should show custom empty message', () => {
    render(<TimelineStream entries={[]} emptyMessage="Nothing here." />);
    expect(screen.getByText('Nothing here.')).toBeTruthy();
  });

  it('should render entries', () => {
    const entries = [
      makeEntry({ id: 'e-1', body: 'First' }),
      makeEntry({ id: 'e-2', body: 'Second' }),
    ];

    render(<TimelineStream entries={entries} />);

    expect(screen.getByTestId('timeline-stream')).toBeTruthy();
    expect(screen.getAllByTestId('timeline-entry')).toHaveLength(2);
    expect(screen.getByText('First')).toBeTruthy();
    expect(screen.getByText('Second')).toBeTruthy();
  });

  it('should render threaded entries with indentation', () => {
    const entries = [
      makeEntry({ id: 'e-1', body: 'Root comment' }),
      makeEntry({ id: 'e-2', body: 'Reply', parentEntryId: 'e-1' }),
    ];

    render(<TimelineStream entries={entries} />);

    const entryElements = screen.getAllByTestId('timeline-entry');
    expect(entryElements).toHaveLength(2);
    expect(entryElements[0].getAttribute('data-depth')).toBe('0');
    expect(entryElements[1].getAttribute('data-depth')).toBe('1');
  });

  it('should render nested threading (depth > 1)', () => {
    const entries = [
      makeEntry({ id: 'e-1', body: 'Root' }),
      makeEntry({ id: 'e-2', body: 'Reply L1', parentEntryId: 'e-1' }),
      makeEntry({ id: 'e-3', body: 'Reply L2', parentEntryId: 'e-2' }),
    ];

    render(<TimelineStream entries={entries} />);

    const entryElements = screen.getAllByTestId('timeline-entry');
    expect(entryElements).toHaveLength(3);
    expect(entryElements[2].getAttribute('data-depth')).toBe('2');
  });

  it('should show load more button when hasMore is true', () => {
    const entries = [makeEntry()];
    const onLoadMore = vi.fn();

    render(<TimelineStream entries={entries} hasMore={true} onLoadMore={onLoadMore} />);

    const btn = screen.getByTestId('timeline-load-more-btn');
    expect(btn).toBeTruthy();

    fireEvent.click(btn);
    expect(onLoadMore).toHaveBeenCalledTimes(1);
  });

  it('should disable load more button when loadingMore', () => {
    const entries = [makeEntry()];

    render(<TimelineStream entries={entries} hasMore={true} loadingMore={true} />);

    const btn = screen.getByTestId('timeline-load-more-btn');
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(btn.textContent).toBe('Loading…');
  });

  it('should not show load more when hasMore is false', () => {
    const entries = [makeEntry()];

    render(<TimelineStream entries={entries} hasMore={false} />);

    expect(screen.queryByTestId('timeline-load-more')).toBeNull();
  });

  it('should call onReply when reply button is clicked', () => {
    const onReply = vi.fn();
    const entries = [makeEntry({ id: 'e-1' })];

    render(<TimelineStream entries={entries} onReply={onReply} />);

    fireEvent.click(screen.getByTestId('timeline-reply-btn'));
    expect(onReply).toHaveBeenCalledWith('e-1');
  });

  it('should call onDelete when delete button is clicked', () => {
    const onDelete = vi.fn();
    const entries = [makeEntry({ id: 'e-1' })];

    render(<TimelineStream entries={entries} onDelete={onDelete} />);

    fireEvent.click(screen.getByTestId('timeline-delete-btn'));
    expect(onDelete).toHaveBeenCalledWith('e-1');
  });

  it('should use custom renderEntry when provided', () => {
    const entries = [makeEntry({ id: 'e-1', body: 'Custom' })];

    render(
      <TimelineStream
        entries={entries}
        renderEntry={(props) => (
          <div data-testid="custom-entry">{props.entry.body}</div>
        )}
      />,
    );

    expect(screen.getByTestId('custom-entry')).toBeTruthy();
    expect(screen.getByText('Custom')).toBeTruthy();
  });
});
