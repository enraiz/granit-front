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
  it('fetchNotifications sends GET with pagination params', async () => {
    const page: NotificationPageDto = {
      items: [],
      totalCount: 0,
      unreadCount: 0,
    };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const result = await fetchNotifications(client, '/api', { skip: 0, take: 10 });

    expect(client.get).toHaveBeenCalledWith('/api/notifications', {
      params: { skip: 0, take: 10 },
    });
    expect(result).toEqual(page);
  });

  // -----------------------------------------------------------------------
  // markAsRead
  // -----------------------------------------------------------------------
  it('markAsRead sends PATCH to the correct URL', async () => {
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

    const result = await markAsRead(client, '/api', 'n-1');

    expect(client.patch).toHaveBeenCalledWith('/api/notifications/n-1/read');
    expect(result.isRead).toBe(true);
  });

  // -----------------------------------------------------------------------
  // markAllAsRead
  // -----------------------------------------------------------------------
  it('markAllAsRead sends POST to read-all', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    await markAllAsRead(client, '/api');

    expect(client.post).toHaveBeenCalledWith('/api/notifications/read-all');
  });

  // -----------------------------------------------------------------------
  // fetchUnreadCount
  // -----------------------------------------------------------------------
  it('fetchUnreadCount returns the count number', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 42 }));

    const result = await fetchUnreadCount(client, '/api');

    expect(client.get).toHaveBeenCalledWith('/api/notifications/unread-count');
    expect(result).toBe(42);
  });

  // -----------------------------------------------------------------------
  // fetchEntityActivityFeed
  // -----------------------------------------------------------------------
  it('fetchEntityActivityFeed sends GET with entity path', async () => {
    const page: ActivityFeedPageDto = { items: [], totalCount: 0 };
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(page));

    const result = await fetchEntityActivityFeed(
      client,
      '/api',
      'Patient',
      'p-1',
      { skip: 0, take: 5 },
    );

    expect(client.get).toHaveBeenCalledWith('/api/activity-feed/Patient/p-1', {
      params: { skip: 0, take: 5 },
    });
    expect(result).toEqual(page);
  });

  // -----------------------------------------------------------------------
  // fetchPreferences
  // -----------------------------------------------------------------------
  it('fetchPreferences sends GET for preferences', async () => {
    const prefs: NotificationPreferenceDto[] = [];
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(prefs));

    const result = await fetchPreferences(client, '/api');

    expect(client.get).toHaveBeenCalledWith('/api/notification-preferences');
    expect(result).toEqual([]);
  });

  // -----------------------------------------------------------------------
  // updatePreference
  // -----------------------------------------------------------------------
  it('updatePreference sends PUT with preference data', async () => {
    const pref: NotificationPreferenceDto = {
      notificationType: 'AppointmentReminder',
      label: 'Rappel de rendez-vous',
      channels: { inApp: true, email: false, push: true },
    };
    const client = createMockClient();
    vi.mocked(client.put).mockResolvedValue(axiosResponse(pref));

    const result = await updatePreference(client, '/api', pref);

    expect(client.put).toHaveBeenCalledWith(
      '/api/notification-preferences/AppointmentReminder',
      pref,
    );
    expect(result).toEqual(pref);
  });
});
