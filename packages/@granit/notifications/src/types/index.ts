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
  /** Opaque cursor for next page (always null for offset pagination). */
  nextCursor: string | null;
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
  /** Opaque cursor for next page (always null for offset pagination). */
  nextCursor: string | null;
}

// ---------------------------------------------------------------------------
// Channels — extensible string type with well-known constants
// ---------------------------------------------------------------------------

/**
 * Notification channel identifier — extensible string type.
 * Consumer apps and backend may define additional channels.
 */
export type NotificationChannel = string & {};

/**
 * Well-known channel identifiers matching the .NET `NotificationChannels` class.
 */
export const NotificationChannels = {
  InApp: 'inApp',
  Email: 'email',
  Sms: 'sms',
  WhatsApp: 'whatsApp',
  Push: 'push',
  MobilePush: 'mobilePush',
  Sse: 'sse',
  SignalR: 'signalR',
  Zulip: 'zulip',
} as const;

// ---------------------------------------------------------------------------
// Preferences
// ---------------------------------------------------------------------------

export interface NotificationPreferenceDto {
  notificationType: string;
  label: string;
  channels: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// Transport abstraction — adapters (SignalR, SSE) implement this interface
// ---------------------------------------------------------------------------

export type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'reconnecting';

/**
 * Real-time notification transport abstraction.
 * Adapters (`@granit/notifications-signalr`, `@granit/notifications-sse`)
 * implement this interface via factory functions.
 *
 * Mirrors the `CookieConsentProvider` pattern from `@granit/cookies`.
 */
export interface NotificationTransport {
  /** Establishes the real-time connection. */
  connect(): Promise<void>;

  /** Gracefully closes the connection. */
  disconnect(): Promise<void>;

  /** Current connection state. */
  readonly state: ConnectionState;

  /**
   * Subscribes to incoming notifications.
   * Returns an unsubscribe function.
   */
  onNotification(callback: (notification: NotificationDto) => void): () => void;

  /**
   * Subscribes to connection state changes.
   * Returns an unsubscribe function.
   */
  onStateChange(callback: (state: ConnectionState) => void): () => void;
}

// ---------------------------------------------------------------------------
// Provider config — transport-agnostic
// ---------------------------------------------------------------------------

export interface NotificationConfig {
  apiClient: AxiosInstance;
  basePath?: string;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

/**
 * Extracts the list of available channels from a preferences response.
 * Useful for dynamically rendering a preferences matrix without hardcoding channels.
 */
export function getAvailableChannels(preferences: readonly NotificationPreferenceDto[]): string[] {
  if (preferences.length === 0) return [];
  return Object.keys(preferences[0].channels);
}
