import { Badge } from '@granit/ui';

export interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

/**
 * Badge showing the unread notification count.
 * Renders nothing when count is 0.
 */
export function NotificationBadge({
  count,
  max = 99,
  className,
}: Readonly<NotificationBadgeProps>) {
  if (count <= 0) return null;

  const display = count > max ? `${max}+` : String(count);

  return (
    <Badge
      variant="destructive"
      data-testid="notification-badge"
      data-count={count}
      className={className}
      aria-label={`${count} notifications non lues`}
    >
      {display}
    </Badge>
  );
}
