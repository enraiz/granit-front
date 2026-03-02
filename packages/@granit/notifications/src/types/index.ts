import type { AxiosInstance } from 'axios';

// ---------------------------------------------------------------------------
// Notification DTOs — aligned with Granit .NET backend contracts
// ---------------------------------------------------------------------------

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'error';

export interface NotificationDto {
  id: string;
  title: string;
  body: string | null;
  severity: NotificationSeverity;
  entityType: string | null;
  entityId: string | null;
  isRead: boolean;
  createdAt: string;
  readAt: string | null;
}

export interface NotificationPageDto {
  items: NotificationDto[];
  totalCount: number;
  unreadCount: number;
}

// ---------------------------------------------------------------------------
// Activity feed
// ---------------------------------------------------------------------------

export interface ActivityFeedEntryDto {
  id: string;
  title: string;
  body: string | null;
  severity: NotificationSeverity;
  createdAt: string;
  userId: string | null;
  userDisplayName: string | null;
}

export interface ActivityFeedPageDto {
  items: ActivityFeedEntryDto[];
  totalCount: number;
}

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export type NotificationChannel = 'inApp' | 'email' | 'push';

export interface NotificationPreferenceDto {
  notificationType: string;
  label: string;
  channels: Record<NotificationChannel, boolean>;
}

// ---------------------------------------------------------------------------
// Provider config
// ---------------------------------------------------------------------------

export interface NotificationConfig {
  apiClient: AxiosInstance;
  basePath?: string;
  hubUrl?: string;
  tokenGetter?: () => Promise<string | null>;
}

// ---------------------------------------------------------------------------
// SignalR connection state
// ---------------------------------------------------------------------------

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
