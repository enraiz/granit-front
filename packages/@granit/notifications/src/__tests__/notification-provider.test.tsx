import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  NotificationProvider,
  useNotificationContext,
} from '../providers/notification-provider.js';

import { createMockClient, createWrapper } from './test-utils.js';

import type { NotificationConfig, NotificationDto } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Each test that needs fine-grained control over the SignalR connection
 * captures it via this shared variable, set by a fresh vi.mock override.
 */
let lastConnection: {
  start: ReturnType<typeof vi.fn>;
  stop: ReturnType<typeof vi.fn>;
  on: ReturnType<typeof vi.fn>;
  onreconnecting: ReturnType<typeof vi.fn>;
  onreconnected: ReturnType<typeof vi.fn>;
  onclose: ReturnType<typeof vi.fn>;
};

function resetLastConnection() {
  lastConnection = {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
  };
}

let capturedWithUrlArgs: { url: string; options: Record<string, unknown> } | null = null;

// Override the global @microsoft/signalr mock from setup.ts to capture connection objects
vi.mock('@microsoft/signalr', () => {
  function HubConnectionBuilder() {
    return {
      withUrl: vi.fn(function (
        this: ReturnType<typeof HubConnectionBuilder>,
        url: string,
        options: Record<string, unknown>
      ) {
        capturedWithUrlArgs = { url, options };
        return this;
      }),
      withAutomaticReconnect: vi.fn().mockReturnThis(),
      configureLogging: vi.fn().mockReturnThis(),
      build: vi.fn(() => lastConnection),
    };
  }

  return {
    HubConnectionBuilder,
    HttpTransportType: { WebSockets: 1, LongPolling: 4 },
    LogLevel: { Warning: 3 },
  };
});

function createProviderWrapper(client: AxiosInstance, overrides: Partial<NotificationConfig> = {}) {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    const config: NotificationConfig = {
      apiClient: client,
      basePath: '/api/v1',
      ...overrides,
    };
    return <NotificationProvider {...config}>{children}</NotificationProvider>;
  };
}

describe('NotificationProvider', () => {
  beforeEach(() => {
    resetLastConnection();
    capturedWithUrlArgs = null;
  });

  it('should provide context with initial values', () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue({ data: { count: 0 } });

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createWrapper(client),
    });

    expect(result.current.config.apiClient).toBe(client);
    expect(result.current.connectionState).toBeDefined();
    expect(result.current.lastNotification).toBeNull();
    expect(result.current.unreadCount).toBe(0);
  });

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useNotificationContext());
    }).toThrow('useNotificationContext must be used within a <NotificationProvider>');
  });

  it('should skip SignalR connection when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: false }),
    });

    expect(result.current.connectionState).toBe('disconnected');
    // start should not have been called since enabled is false
    expect(lastConnection.start).not.toHaveBeenCalled();
  });

  it('should transition to connected state after start succeeds', async () => {
    const client = createMockClient();

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true }),
    });

    await waitFor(() => expect(result.current.connectionState).toBe('connected'));
    expect(lastConnection.start).toHaveBeenCalled();
  });

  it('should handle connection start failure and set state to disconnected', async () => {
    lastConnection.start.mockRejectedValueOnce(new Error('Connection failed'));

    const client = createMockClient();

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true }),
    });

    await waitFor(() => expect(result.current.connectionState).toBe('disconnected'));
  });

  it('should handle ReceiveNotification SignalR event', async () => {
    const client = createMockClient();

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true }),
    });

    await waitFor(() => expect(result.current.connectionState).toBe('connected'));

    // Find the ReceiveNotification handler registered via connection.on()
    const receiveCall = lastConnection.on.mock.calls.find(
      (call: unknown[]) => call[0] === 'ReceiveNotification'
    );
    expect(receiveCall).toBeDefined();

    const handler = receiveCall![1] as (notification: NotificationDto) => void;

    const mockNotif: NotificationDto = {
      id: 'n-99',
      title: 'Real-time notification',
      body: null,
      severity: 'info',
      entityType: null,
      entityId: null,
      isRead: false,
      createdAt: '2026-01-15T10:00:00Z',
      readAt: null,
    };

    act(() => {
      handler(mockNotif);
    });

    expect(result.current.lastNotification).toEqual(mockNotif);
    expect(result.current.unreadCount).toBe(1);
  });

  it('should handle reconnecting, reconnected, and onclose SignalR events', async () => {
    const client = createMockClient();

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true }),
    });

    await waitFor(() => expect(result.current.connectionState).toBe('connected'));

    // Trigger reconnecting
    const reconnectingHandler = lastConnection.onreconnecting.mock.calls[0][0] as () => void;
    act(() => {
      reconnectingHandler();
    });
    expect(result.current.connectionState).toBe('reconnecting');

    // Trigger reconnected
    const reconnectedHandler = lastConnection.onreconnected.mock.calls[0][0] as () => void;
    act(() => {
      reconnectedHandler();
    });
    expect(result.current.connectionState).toBe('connected');

    // Trigger onclose
    const oncloseHandler = lastConnection.onclose.mock.calls[0][0] as () => void;
    act(() => {
      oncloseHandler();
    });
    expect(result.current.connectionState).toBe('disconnected');
  });

  it('should pass tokenGetter as accessTokenFactory to SignalR', async () => {
    const client = createMockClient();
    const tokenGetter = vi.fn().mockResolvedValue('test-token');

    renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, {
        enabled: true,
        tokenGetter,
        hubUrl: '/hubs/test',
      }),
    });

    expect(capturedWithUrlArgs).not.toBeNull();
    expect(capturedWithUrlArgs!.url).toBe('/hubs/test');
    expect(capturedWithUrlArgs!.options).toHaveProperty('accessTokenFactory');

    // Call the factory and verify it delegates to tokenGetter
    const factory = capturedWithUrlArgs!.options.accessTokenFactory as () => Promise<string>;
    const token = await factory();
    expect(token).toBe('test-token');
    expect(tokenGetter).toHaveBeenCalled();
  });

  it('should return empty string from accessTokenFactory when tokenGetter returns null', async () => {
    const client = createMockClient();
    const tokenGetter = vi.fn().mockResolvedValue(null);

    renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true, tokenGetter }),
    });

    expect(capturedWithUrlArgs).not.toBeNull();
    const factory = capturedWithUrlArgs!.options.accessTokenFactory as () => Promise<string>;
    const token = await factory();
    expect(token).toBe('');
  });

  it('should not set accessTokenFactory when no tokenGetter is provided', () => {
    const client = createMockClient();

    renderHook(() => useNotificationContext(), {
      wrapper: createProviderWrapper(client, { enabled: true }),
    });

    expect(capturedWithUrlArgs).not.toBeNull();
    expect(capturedWithUrlArgs!.options.accessTokenFactory).toBeUndefined();
  });
});
