import { useNotificationContext } from '../providers/notification-provider.js';

import type { ConnectionState, UserNotification } from '@granit/notifications';

export interface UseRealTimeNotificationsReturn {
  lastNotification: UserNotification | null;
  connectionState: ConnectionState;
}

/**
 * Exposes the most recently received real-time notification and connection
 * state. Useful for triggering toasts or in-app alerts.
 */
export function useRealTimeNotifications(): UseRealTimeNotificationsReturn {
  const { lastNotification, connectionState } = useNotificationContext();
  return { lastNotification, connectionState };
}
