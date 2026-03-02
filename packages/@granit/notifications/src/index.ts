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
export type { UseRealTimeNotificationsResult } from './hooks/use-real-time-notifications.js';

export { useUnreadCount } from './hooks/use-unread-count.js';
export type { UseUnreadCountOptions, UseUnreadCountResult } from './hooks/use-unread-count.js';

export { useNotifications } from './hooks/use-notifications.js';
export type { UseNotificationsOptions, UseNotificationsResult } from './hooks/use-notifications.js';

export { useEntityActivityFeed } from './hooks/use-entity-activity-feed.js';
export type { UseEntityActivityFeedOptions, UseEntityActivityFeedResult } from './hooks/use-entity-activity-feed.js';

export { useNotificationPreferences } from './hooks/use-notification-preferences.js';
export type { UseNotificationPreferencesResult } from './hooks/use-notification-preferences.js';

// Components
export { NotificationBadge } from './components/notification-badge.js';
export type { NotificationBadgeProps } from './components/notification-badge.js';

export { NotificationItem } from './components/notification-item.js';
export type { NotificationItemProps } from './components/notification-item.js';

export { NotificationCenter } from './components/notification-center.js';
export type { NotificationCenterProps } from './components/notification-center.js';

export { EntityActivityFeed } from './components/entity-activity-feed.js';
export type { EntityActivityFeedProps } from './components/entity-activity-feed.js';

export { NotificationPreferences } from './components/notification-preferences.js';
export type { NotificationPreferencesProps } from './components/notification-preferences.js';

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
