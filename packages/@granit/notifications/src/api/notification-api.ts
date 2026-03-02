import type {
  ActivityFeedPageDto,
  NotificationDto,
  NotificationPageDto,
  NotificationPreferenceDto,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';


function buildUrl(basePath: string, ...segments: string[]): string {
  return [basePath, ...segments].join('/');
}

// ---------------------------------------------------------------------------
// Notifications (inbox)
// ---------------------------------------------------------------------------

export async function fetchNotifications(
  client: AxiosInstance,
  basePath: string,
  params: { skip?: number; take?: number } = {},
): Promise<NotificationPageDto> {
  const { data } = await client.get<NotificationPageDto>(
    buildUrl(basePath, 'notifications'),
    { params },
  );
  return data;
}

export async function markAsRead(
  client: AxiosInstance,
  basePath: string,
  notificationId: string,
): Promise<NotificationDto> {
  const { data } = await client.patch<NotificationDto>(
    buildUrl(basePath, 'notifications', notificationId, 'read'),
  );
  return data;
}

export async function markAllAsRead(
  client: AxiosInstance,
  basePath: string,
): Promise<void> {
  await client.post(buildUrl(basePath, 'notifications', 'read-all'));
}

// ---------------------------------------------------------------------------
// Unread count
// ---------------------------------------------------------------------------

export async function fetchUnreadCount(
  client: AxiosInstance,
  basePath: string,
): Promise<number> {
  const { data } = await client.get<{ count: number }>(
    buildUrl(basePath, 'notifications', 'unread-count'),
  );
  return data.count;
}

// ---------------------------------------------------------------------------
// Activity feed (entity-scoped)
// ---------------------------------------------------------------------------

export async function fetchEntityActivityFeed(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  params: { skip?: number; take?: number } = {},
): Promise<ActivityFeedPageDto> {
  const { data } = await client.get<ActivityFeedPageDto>(
    buildUrl(basePath, 'activity-feed', entityType, entityId),
    { params },
  );
  return data;
}

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export async function fetchPreferences(
  client: AxiosInstance,
  basePath: string,
): Promise<NotificationPreferenceDto[]> {
  const { data } = await client.get<NotificationPreferenceDto[]>(
    buildUrl(basePath, 'notification-preferences'),
  );
  return data;
}

export async function updatePreference(
  client: AxiosInstance,
  basePath: string,
  preference: NotificationPreferenceDto,
): Promise<NotificationPreferenceDto> {
  const { data } = await client.put<NotificationPreferenceDto>(
    buildUrl(basePath, 'notification-preferences', preference.notificationType),
    preference,
  );
  return data;
}
