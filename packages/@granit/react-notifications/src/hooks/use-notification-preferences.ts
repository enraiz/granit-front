import { fetchPreferences, updatePreference } from '@granit/notifications';
import { useCallback, useEffect, useOptimistic, useRef, useState, useTransition } from 'react';

import { useNotificationContext } from '../providers/notification-provider.js';

import type { NotificationChannel, NotificationPreferenceDto } from '@granit/notifications';

export interface UseNotificationPreferencesReturn {
  preferences: NotificationPreferenceDto[];
  loading: boolean;
  error: Error | null;
  saving: boolean;
  toggleChannel: (notificationType: string, channel: NotificationChannel, enabled: boolean) => void;
  refresh: () => void;
}

type OptimisticAction = {
  notificationType: string;
  updated: NotificationPreferenceDto;
};

/**
 * CRUD hook for notification preferences (type x channel matrix).
 *
 * Uses React 19 `useOptimistic` for instant UI feedback with automatic
 * rollback on server failure.
 */
export function useNotificationPreferences(): UseNotificationPreferencesReturn {
  const { config } = useNotificationContext();
  const basePath = config.basePath ?? '/api';

  const [preferences, setPreferences] = useState<NotificationPreferenceDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const mountedRef = useRef(true);

  const [optimisticPreferences, applyOptimistic] = useOptimistic(
    preferences,
    (state: NotificationPreferenceDto[], action: OptimisticAction) =>
      state.map((p) => (p.notificationType === action.notificationType ? action.updated : p))
  );

  const [saving, startTransition] = useTransition();

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
    (notificationType: string, channel: NotificationChannel, enabled: boolean) => {
      const pref = preferences.find((p) => p.notificationType === notificationType);
      if (!pref) return;

      const updated: NotificationPreferenceDto = {
        ...pref,
        channels: { ...pref.channels, [channel]: enabled },
      };

      startTransition(async () => {
        applyOptimistic({ notificationType, updated });

        try {
          const saved = await updatePreference(config.apiClient, basePath, updated);
          if (mountedRef.current) {
            setPreferences((prev) =>
              prev.map((p) => (p.notificationType === notificationType ? saved : p))
            );
          }
        } catch (err) {
          // No manual rollback — useOptimistic reverts automatically when the
          // transition ends and setPreferences was not called with a new value.
          if (mountedRef.current) {
            setError(err instanceof Error ? err : new Error(String(err)));
          }
        }
      });
    },
    [config.apiClient, basePath, preferences, applyOptimistic]
  );

  const refresh = useCallback(() => {
    setLoading(true);
    load();
  }, [load]);

  return { preferences: optimisticPreferences, loading, error, saving, toggleChannel, refresh };
}
