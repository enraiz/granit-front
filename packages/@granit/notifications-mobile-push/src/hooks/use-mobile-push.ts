import { PushNotifications } from '@capacitor/push-notifications';
import { useCallback, useEffect, useRef, useState } from 'react';

import { registerDeviceToken, unregisterDeviceToken } from '../api/mobile-push-api.js';

import type { MobilePlatform } from '../api/mobile-push-api.js';
import type { AxiosInstance } from 'axios';

export interface MobilePushConfig {
  readonly apiClient: AxiosInstance;
  readonly basePath?: string;
  readonly platform: MobilePlatform;
}

export interface UseMobilePushReturn {
  /** Whether the device token has been registered with the backend. */
  readonly isRegistered: boolean;
  /** Loading state during register/unregister. */
  readonly loading: boolean;
  /** Last error, if any. */
  readonly error: Error | null;
  /** Request permission and register the device token. */
  register: () => Promise<void>;
  /** Unregister the current device token. */
  unregister: () => Promise<void>;
}

/**
 * Manages FCM/APNs device token registration for Capacitor apps.
 *
 * This hook handles:
 * - Requesting push notification permissions via Capacitor
 * - Capturing the FCM/APNs token from the native layer
 * - Registering/unregistering the token with the backend REST API
 * - Handling token refresh events
 *
 * Push payload display is handled by the native OS — the backend sends
 * wake-up only payloads (no PII in push payload, ISO 27001 compliant).
 */
export function useMobilePush(config: MobilePushConfig): UseMobilePushReturn {
  const basePath = config.basePath ?? '/api/v1';

  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const tokenRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Listen for token refresh events while registered
  useEffect(() => {
    if (!isRegistered) return;

    const listener = PushNotifications.addListener('registration', async (token) => {
      const oldToken = tokenRef.current;
      tokenRef.current = token.value;

      try {
        if (oldToken) {
          await unregisterDeviceToken(config.apiClient, basePath, oldToken);
        }
        await registerDeviceToken(config.apiClient, basePath, {
          token: token.value,
          platform: config.platform,
        });
      } catch (err) {
        if (mountedRef.current) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    });

    return () => {
      listener.then((l) => l.remove());
    };
  }, [isRegistered, config.apiClient, basePath, config.platform]);

  const register = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        throw new Error('Push notification permission denied');
      }

      // Wait for the registration token
      const tokenPromise = new Promise<string>((resolve, reject) => {
        const regListener = PushNotifications.addListener('registration', (token) => {
          regListener.then((l) => l.remove());
          errListener.then((l) => l.remove());
          resolve(token.value);
        });

        const errListener = PushNotifications.addListener('registrationError', (err) => {
          regListener.then((l) => l.remove());
          errListener.then((l) => l.remove());
          reject(new Error(err.error));
        });
      });

      await PushNotifications.register();
      const token = await tokenPromise;
      tokenRef.current = token;

      await registerDeviceToken(config.apiClient, basePath, {
        token,
        platform: config.platform,
      });

      if (mountedRef.current) {
        setIsRegistered(true);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [config.apiClient, basePath, config.platform]);

  const unregister = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (tokenRef.current) {
        await unregisterDeviceToken(config.apiClient, basePath, tokenRef.current);
        tokenRef.current = null;
      }

      if (mountedRef.current) {
        setIsRegistered(false);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [config.apiClient, basePath]);

  return { isRegistered, loading, error, register, unregister };
}
