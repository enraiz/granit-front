import type { NotificationDto } from '../types/index.js';

export interface NotificationItemProps {
  notification: NotificationDto;
  onClick?: (notification: NotificationDto) => void;
  className?: string;
}

/**
 * Headless notification row — title, severity, relative time, read state.
 */
export function NotificationItem({
  notification,
  onClick,
  className,
}: Readonly<NotificationItemProps>) {
  return (
    <article
      data-testid="notification-item"
      data-severity={notification.severity}
      data-read={notification.isRead}
      className={className}
      role="button"
      tabIndex={0}
      onClick={() => onClick?.(notification)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(notification);
        }
      }}
    >
      <header>
        <span data-testid="notification-title">{notification.title}</span>
        <time
          data-testid="notification-time"
          dateTime={notification.createdAt}
        >
          {notification.createdAt}
        </time>
      </header>
      {notification.body && (
        <p data-testid="notification-body">{notification.body}</p>
      )}
    </article>
  );
}
