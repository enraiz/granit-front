// Types
export type {
  ActivityFeedEntryDto,
  ActivityFeedPageDto,
  ConnectionState,
  NotificationChannel,
  NotificationConfig,
  NotificationDto,
  NotificationPageDto,
  NotificationPreferenceDto,
  NotificationSeverity,
} from './types/index.js';

// Provider
export { NotificationProvider, useNotificationContext } from './providers/notification-provider.js';

// Hooks
export { useRealTimeNotifications } from './hooks/use-real-time-notifications.js';
export type { UseRealTimeNotificationsReturn } from './hooks/use-real-time-notifications.js';

export { useUnreadCount } from './hooks/use-unread-count.js';
export type { UseUnreadCountOptions, UseUnreadCountReturn } from './hooks/use-unread-count.js';

export { useNotifications } from './hooks/use-notifications.js';
export type { UseNotificationsOptions, UseNotificationsReturn } from './hooks/use-notifications.js';

export { useEntityActivityFeed } from './hooks/use-entity-activity-feed.js';
export type {
  UseEntityActivityFeedOptions,
  UseEntityActivityFeedReturn,
} from './hooks/use-entity-activity-feed.js';

export { useNotificationPreferences } from './hooks/use-notification-preferences.js';
export type { UseNotificationPreferencesReturn } from './hooks/use-notification-preferences.js';

// API (for advanced usage)
export {
  fetchNotifications,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
  fetchEntityActivityFeed,
  fetchPreferences,
  updatePreference,
} from './api/notification-api.js';
