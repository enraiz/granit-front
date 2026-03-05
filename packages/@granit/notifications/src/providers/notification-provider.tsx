import { HttpTransportType, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type {
  ConnectionState,
  NotificationConfig,
  NotificationDto,
} from '../types/index.js';
import type { HubConnection } from '@microsoft/signalr';


// ---------------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------------

interface NotificationContextValue {
  config: NotificationConfig;
  connectionState: ConnectionState;
  lastNotification: NotificationDto | null;
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

const DEFAULT_BASE_PATH = '/api';
const DEFAULT_HUB_URL = '/hubs/notifications';

export function NotificationProvider({
  children,
  ...config
}: Readonly<NotificationConfig & { children: React.ReactNode }>) {
  const { apiClient, tokenGetter, hubUrl = DEFAULT_HUB_URL, enabled = true } = config;
  const basePath = config.basePath ?? DEFAULT_BASE_PATH;

  const [connectionState, setConnectionState] = useState<ConnectionState>('disconnected');
  const [lastNotification, setLastNotification] = useState<NotificationDto | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        transport: HttpTransportType.WebSockets | HttpTransportType.LongPolling,
        accessTokenFactory: tokenGetter
          ? async () => (await tokenGetter()) ?? ''
          : undefined,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Warning)
      .build();

    connectionRef.current = connection;

    connection.on('ReceiveNotification', (notification: NotificationDto) => {
      setLastNotification(notification);
      setUnreadCount((prev) => prev + 1);
    });

    connection.onreconnecting(() => setConnectionState('reconnecting'));
    connection.onreconnected(() => setConnectionState('connected'));
    connection.onclose(() => setConnectionState('disconnected'));

    setConnectionState('connecting');
    connection.start().then(
      () => setConnectionState('connected'),
      () => setConnectionState('disconnected'),
    );

    return () => {
      connection.stop();
    };
  }, [enabled, hubUrl, tokenGetter]);

  const fullConfig = useMemo<NotificationConfig>(
    () => ({ apiClient, basePath, hubUrl, tokenGetter }),
    [apiClient, basePath, hubUrl, tokenGetter],
  );

  const setUnreadCountCb = useCallback(
    (update: number | ((prev: number) => number)) => setUnreadCount(update),
    [],
  );

  const value = useMemo<NotificationContextValue>(
    () => ({
      config: fullConfig,
      connectionState,
      lastNotification,
      unreadCount,
      setUnreadCount: setUnreadCountCb,
    }),
    [fullConfig, connectionState, lastNotification, unreadCount, setUnreadCountCb],
  );

  return (
    <NotificationContext value={value}>
      {children}
    </NotificationContext>
  );
}
