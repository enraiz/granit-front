import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchPreferences, updatePreference } from '../api/notification-api.js';
import { useNotificationContext } from '../providers/notification-provider.js';

import type { NotificationChannel, NotificationPreferenceDto } from '../types/index.js';

export interface UseNotificationPreferencesResult {
  preferences: NotificationPreferenceDto[];
  loading: boolean;
  error: Error | null;
  saving: boolean;
  toggleChannel: (
    notificationType: string,
    channel: NotificationChannel,
    enabled: boolean,
  ) => Promise<void>;
  refresh: () => void;
}

/**
 * CRUD hook for notification preferences (type x channel matrix).
 */
export function useNotificationPreferences(): UseNotificationPreferencesResult {
  const { config } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const [preferences, setPreferences] = useState<NotificationPreferenceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [saving, setSaving] = useState(false);
  const mountedRef = useRef(true);

  const load = useCallback(async () => {
    try {
      const data = await fetchPreferences(config.apiClient, basePath);
      if (mountedRef.current) {
        setPreferences(data);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [config.apiClient, basePath]);

  useEffect(() => {
    mountedRef.current = true;
    load();
    return () => {
      mountedRef.current = false;
    };
  }, [load]);

  const toggleChannel = useCallback(
    async (
      notificationType: string,
      channel: NotificationChannel,
      enabled: boolean,
    ) => {
      const pref = preferences.find((p) => p.notificationType === notificationType);
      if (!pref) return;

      const updated: NotificationPreferenceDto = {
        ...pref,
        channels: { ...pref.channels, [channel]: enabled },
      };

      // Optimistic update
      setPreferences((prev) =>
        prev.map((p) => (p.notificationType === notificationType ? updated : p)),
      );

      setSaving(true);
      try {
        const saved = await updatePreference(config.apiClient, basePath, updated);
        if (mountedRef.current) {
          setPreferences((prev) =>
            prev.map((p) => (p.notificationType === notificationType ? saved : p)),
          );
        }
      } catch (err) {
        // Rollback on failure
        if (mountedRef.current) {
          setPreferences((prev) =>
            prev.map((p) => (p.notificationType === notificationType ? pref : p)),
          );
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (mountedRef.current) setSaving(false);
      }
    },
    [config.apiClient, basePath, preferences],
  );

  const refresh = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return { preferences, loading, error, saving, toggleChannel, refresh };
}
