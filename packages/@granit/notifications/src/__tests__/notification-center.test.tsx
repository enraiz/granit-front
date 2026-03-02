import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NotificationCenter } from '../components/notification-center.js';

import type { NotificationDto } from '../types/index.js';

const NOTIFICATIONS: NotificationDto[] = [
  {
    id: 'n-1',
    title: 'Notification 1',
    body: null,
    severity: 'info',
    entityType: null,
    entityId: null,
    isRead: false,
    createdAt: '2026-01-15T10:00:00Z',
    readAt: null,
  },
  {
    id: 'n-2',
    title: 'Notification 2',
    body: 'With body',
    severity: 'warning',
    entityType: null,
    entityId: null,
    isRead: true,
    createdAt: '2026-01-14T10:00:00Z',
    readAt: '2026-01-14T11:00:00Z',
  },
];

describe('NotificationCenter', () => {
  it('should render bell button with badge', () => {
    render(
      <NotificationCenter
        notifications={NOTIFICATIONS}
        unreadCount={1}
        loading={false}
        hasMore={false}
      />,
    );

    expect(screen.getByTestId('notification-bell')).toBeInTheDocument();
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('1');
  });

  it('should open inbox on bell click', async () => {
    const user = userEvent.setup();

    render(
      <NotificationCenter
        notifications={NOTIFICATIONS}
        unreadCount={1}
        loading={false}
        hasMore={false}
      />,
    );

    expect(screen.queryByTestId('notification-inbox')).toBeNull();

    await user.click(screen.getByTestId('notification-bell'));

    expect(screen.getByTestId('notification-inbox')).toBeInTheDocument();
    expect(screen.getByTestId('notification-list')).toBeInTheDocument();
  });

  it('should show empty message when no notifications', async () => {
    const user = userEvent.setup();

    render(
      <NotificationCenter
        notifications={[]}
        unreadCount={0}
        loading={false}
        hasMore={false}
        emptyMessage="Rien à afficher"
      />,
    );

    await user.click(screen.getByTestId('notification-bell'));

    expect(screen.getByTestId('notification-empty')).toHaveTextContent('Rien à afficher');
  });

  it('should show loading state', async () => {
    const user = userEvent.setup();

    render(
      <NotificationCenter
        notifications={[]}
        unreadCount={0}
        loading={true}
        hasMore={false}
      />,
    );

    await user.click(screen.getByTestId('notification-bell'));

    expect(screen.getByTestId('notification-loading')).toBeInTheDocument();
  });

  it('should show load more button when hasMore', async () => {
    const onLoadMore = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationCenter
        notifications={NOTIFICATIONS}
        unreadCount={0}
        loading={false}
        hasMore={true}
        onLoadMore={onLoadMore}
      />,
    );

    await user.click(screen.getByTestId('notification-bell'));
    await user.click(screen.getByTestId('notification-load-more'));

    expect(onLoadMore).toHaveBeenCalled();
  });

  it('should show mark all read button when unread > 0', async () => {
    const onMarkAllRead = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationCenter
        notifications={NOTIFICATIONS}
        unreadCount={1}
        loading={false}
        hasMore={false}
        onMarkAllRead={onMarkAllRead}
      />,
    );

    await user.click(screen.getByTestId('notification-bell'));
    await user.click(screen.getByTestId('mark-all-read'));

    expect(onMarkAllRead).toHaveBeenCalled();
  });
});
