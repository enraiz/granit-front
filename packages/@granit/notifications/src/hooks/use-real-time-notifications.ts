import { useNotificationContext } from '../providers/notification-provider.js';

import type { ConnectionState, NotificationDto } from '../types/index.js';

export interface UseRealTimeNotificationsResult {
  lastNotification: NotificationDto | null;
  connectionState: ConnectionState;
}

/**
 * Exposes the most recently received real-time notification and connection
 * state. Useful for triggering toasts or in-app alerts.
 */
export function useRealTimeNotifications(): UseRealTimeNotificationsResult {
  const { lastNotification, connectionState } = useNotificationContext();
  return { lastNotification, connectionState };
}
