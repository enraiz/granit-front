import { Button, Spinner } from '@granit/ui';
import { useCallback, useState } from 'react';


import { NotificationBadge } from './notification-badge.js';
import { NotificationItem } from './notification-item.js';

import type { NotificationDto } from '../types/index.js';

export interface NotificationCenterProps {
  notifications: NotificationDto[];
  unreadCount: number;
  loading: boolean;
  hasMore: boolean;
  onLoadMore?: () => void;
  onNotificationClick?: (notification: NotificationDto) => void;
  onMarkAllRead?: () => void;
  renderItem?: (notification: NotificationDto) => React.ReactNode;
  emptyMessage?: string;
  className?: string;
}

/**
 * Bell + dropdown inbox component.
 */
export function NotificationCenter({
  notifications,
  unreadCount,
  loading,
  hasMore,
  onLoadMore,
  onNotificationClick,
  onMarkAllRead,
  renderItem,
  emptyMessage = 'Aucune notification',
  className,
}: Readonly<NotificationCenterProps>) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((prev) => !prev), []);

  return (
    <div data-testid="notification-center" className={className}>
      <Button
        variant="ghost"
        size="icon"
        data-testid="notification-bell"
        onClick={toggle}
        aria-expanded={open}
        aria-label="Notifications"
      >
        <NotificationBadge count={unreadCount} />
      </Button>

      {open && (
        <section
          data-testid="notification-inbox"
          aria-label="Centre de notifications"
        >
          <header data-testid="notification-inbox-header">
            {onMarkAllRead && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                data-testid="mark-all-read"
                onClick={onMarkAllRead}
              >
                Tout marquer comme lu
              </Button>
            )}
          </header>

          {loading && notifications.length === 0 && (
            <div data-testid="notification-loading" aria-busy="true">
              <Spinner />
            </div>
          )}

          {!loading && notifications.length === 0 && (
            <div data-testid="notification-empty">
              {emptyMessage}
            </div>
          )}

          {notifications.length > 0 && (
            <ul data-testid="notification-list">
              {notifications.map((n) => (
                <li key={n.id}>
                  {renderItem ? (
                    renderItem(n)
                  ) : (
                    <NotificationItem
                      notification={n}
                      onClick={onNotificationClick}
                    />
                  )}
                </li>
              ))}
            </ul>
          )}

          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              data-testid="notification-load-more"
              onClick={onLoadMore}
            >
              Charger plus
            </Button>
          )}
        </section>
      )}
    </div>
  );
}
