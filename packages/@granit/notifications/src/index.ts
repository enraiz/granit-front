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
  NotificationTransport,
} from './types/index.js';

export { getAvailableChannels, NotificationChannels } from './types/index.js';

// API (pure TypeScript functions)
export {
  fetchNotifications,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
  fetchEntityActivityFeed,
  fetchPreferences,
  updatePreference,
} from './api/notification-api.js';
