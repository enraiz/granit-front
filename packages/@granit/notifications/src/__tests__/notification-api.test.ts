import { describe, expect, it, vi } from 'vitest';

import {
  fetchEntityActivityFeed,
  fetchNotifications,
  fetchPreferences,
  fetchUnreadCount,
  markAllAsRead,
  markAsRead,
  updatePreference,
} from '../api/notification-api.js';

import { axiosResponse, createMockClient } from './test-utils.js';

import type {
  ActivityFeedPageDto,
  NotificationDto,
  NotificationPageDto,
  NotificationPreferenceDto,
} from '../types/index.js';

describe('notification-api', () => {
  // -----------------------------------------------------------------------
  // fetchNotifications
  // -----------------------------------------------------------------------
  it('should send GET with pagination params (fetchNotifications)', async () => {
    const page: NotificationPageDto = {
      items: [],
      totalCount: 0,
      unreadCount: 0,
    };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const result = await fetchNotifications(client, '/api/v1', { skip: 0, take: 10 });

    expect(client.get).toHaveBeenCalledWith('/api/v1/notifications', {
      params: { skip: 0, take: 10 },
    });
    expect(result).toEqual(page);
  });

  // -----------------------------------------------------------------------
  // markAsRead
  // -----------------------------------------------------------------------
  it('should send PATCH to the correct URL (markAsRead)', async () => {
    const notification: NotificationDto = {
      id: 'n-1',
      title: 'Test',
      body: null,
      severity: 'info',
      entityType: null,
      entityId: null,
      isRead: true,
      createdAt: '2026-01-01T00:00:00Z',
      readAt: '2026-01-01T00:01:00Z',
    };
    const client = createMockClient();
    vi.mocked(client.patch).mockResolvedValue(axiosResponse(notification));

    const result = await markAsRead(client, '/api/v1', 'n-1');

    expect(client.patch).toHaveBeenCalledWith('/api/v1/notifications/n-1/read');
    expect(result.isRead).toBe(true);
  });

  // -----------------------------------------------------------------------
  // markAllAsRead
  // -----------------------------------------------------------------------
  it('should send POST to read-all (markAllAsRead)', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    await markAllAsRead(client, '/api/v1');

    expect(client.post).toHaveBeenCalledWith('/api/v1/notifications/read-all');
  });

  // -----------------------------------------------------------------------
  // fetchUnreadCount
  // -----------------------------------------------------------------------
  it('should return the count number (fetchUnreadCount)', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 42 }));

    const result = await fetchUnreadCount(client, '/api/v1');

    expect(client.get).toHaveBeenCalledWith('/api/v1/notifications/unread-count');
    expect(result).toBe(42);
  });

  // -----------------------------------------------------------------------
  // fetchEntityActivityFeed
  // -----------------------------------------------------------------------
  it('should send GET with entity path (fetchEntityActivityFeed)', async () => {
    const page: ActivityFeedPageDto = { items: [], totalCount: 0 };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const result = await fetchEntityActivityFeed(client, '/api/v1', 'Patient', 'p-1', {
      skip: 0,
      take: 5,
    });

    expect(client.get).toHaveBeenCalledWith('/api/v1/activity-feed/Patient/p-1', {
      params: { skip: 0, take: 5 },
    });
    expect(result).toEqual(page);
  });

  // -----------------------------------------------------------------------
  // fetchPreferences
  // -----------------------------------------------------------------------
  it('should send GET for preferences (fetchPreferences)', async () => {
    const prefs: NotificationPreferenceDto[] = [];
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(prefs));

    const result = await fetchPreferences(client, '/api/v1');

    expect(client.get).toHaveBeenCalledWith('/api/v1/notification-preferences');
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // updatePreference
  // -----------------------------------------------------------------------
  it('should send PUT with preference data (updatePreference)', async () => {
    const pref: NotificationPreferenceDto = {
      notificationType: 'AppointmentReminder',
      label: 'Rappel de rendez-vous',
      channels: { inApp: true, email: false, push: true },
    };
    const client = createMockClient();
    vi.mocked(client.put).mockResolvedValue(axiosResponse(pref));

    const result = await updatePreference(client, '/api/v1', pref);

    expect(client.put).toHaveBeenCalledWith(
      '/api/v1/notification-preferences/AppointmentReminder',
      pref
    );
    expect(result).toEqual(pref);
  });
});
