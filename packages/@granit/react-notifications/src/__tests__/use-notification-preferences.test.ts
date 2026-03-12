import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useNotificationPreferences } from '../hooks/use-notification-preferences.js';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.js';

import type { NotificationPreferenceDto } from '@granit/notifications';

const MOCK_PREFS: NotificationPreferenceDto[] = [
  {
    notificationType: 'AppointmentReminder',
    label: 'Rappel de rendez-vous',
    channels: { inApp: true, email: true, push: false },
  },
  {
    notificationType: 'SystemAlert',
    label: 'Alerte système',
    channels: { inApp: true, email: false, push: false },
  },
];

describe('useNotificationPreferences', () => {
  it('should fetch preferences on mount', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.preferences).toHaveLength(2);
    expect(result.current.preferences[0].notificationType).toBe('AppointmentReminder');
  });

  it('should update preference optimistically via toggleChannel', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));

    const updatedPref: NotificationPreferenceDto = {
      ...MOCK_PREFS[0],
      channels: { inApp: true, email: false, push: false },
    };
    vi.mocked(client.put).mockResolvedValue(axiosResponse(updatedPref));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleChannel('AppointmentReminder', 'email', false);
    });

    expect(result.current.preferences[0].channels.email).toBe(false);
  });

  it('should roll back on toggle failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));
    vi.mocked(client.put).mockRejectedValue(new Error('Save failed'));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleChannel('AppointmentReminder', 'email', false);
    });

    // Should roll back to original value
    expect(result.current.preferences[0].channels.email).toBe(true);
    expect(result.current.error?.message).toBe('Save failed');
  });

  it('should handle initial fetch error', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Load failed'));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Load failed');
    expect(result.current.preferences).toHaveLength(0);
  });

  it('should wrap non-Error throws in Error on initial fetch', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue('string error');

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('string error');
  });

  it('should no-op when toggling a non-existent notification type', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleChannel('NonExistentType', 'email', false);
    });

    // No put call should have been made
    expect(client.put).not.toHaveBeenCalled();
    // Preferences unchanged
    expect(result.current.preferences).toEqual(MOCK_PREFS);
  });

  it('should wrap non-Error throws in Error on toggle failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));
    vi.mocked(client.put).mockRejectedValue(42);

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.toggleChannel('AppointmentReminder', 'email', false);
    });

    // Should roll back to original value
    expect(result.current.preferences[0].channels.email).toBe(true);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('42');
  });

  it('should refresh preferences', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(MOCK_PREFS));

    const { result } = renderHook(() => useNotificationPreferences(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const updatedPrefs: NotificationPreferenceDto[] = [
      { ...MOCK_PREFS[0], channels: { inApp: false, email: true, push: true } },
    ];
    vi.mocked(client.get).mockResolvedValue(axiosResponse(updatedPrefs));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.preferences).toHaveLength(1);
    expect(result.current.preferences[0].channels.push).toBe(true);
  });
});
