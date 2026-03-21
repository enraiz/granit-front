import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type {
  ConnectionState,
  NotificationConfig,
  UserNotification,
  NotificationTransport,
} from '@granit/notifications';

// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

interface NotificationContextValue {
  config: NotificationConfig;
  connectionState: ConnectionState;
  lastNotification: UserNotification | null;
  unreadCount: number;
  setUnreadCount: (count: number | ((prev: number) => number)) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useNotificationContext(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) {
    throw new Error('useNotificationContext must be used within a <NotificationProvider>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface NotificationProviderProps {
  children: React.ReactNode;
  config: NotificationConfig;
  /** Optional real-time transport. When omitted, only REST API polling is available. */
  transport?: NotificationTransport;
}

export function NotificationProvider({
  children,
  config,
  transport,
}: Readonly<NotificationProviderProps>) {
  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastNotification, setLastNotification] = useState<UserNotification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!transport) return;

    const unsubNotification = transport.onNotification((notification) => {
      setLastNotification(notification);
      setUnreadCount((prev) => prev + 1);
    });

    const unsubState = transport.onStateChange((state) => {
      setConnectionState(state);
    });

    setConnectionState('connecting');
    transport.connect().then(
      () => setConnectionState('connected'),
      () => setConnectionState('disconnected')
    );

    return () => {
      unsubNotification();
      unsubState();
      transport.disconnect();
    };
  }, [transport]);

  const setUnreadCountCb = useCallback(
    (update: number | ((prev: number) => number)) => setUnreadCount(update),
    []
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      config,
      connectionState,
      lastNotification,
      unreadCount,
      setUnreadCount: setUnreadCountCb,
    }),
    [config, connectionState, lastNotification, unreadCount, setUnreadCountCb]
  );

  return <NotificationContext value={value}>{children}</NotificationContext>;
}
