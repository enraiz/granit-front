import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useWebPush } from '../hooks/use-web-push.js';

import type { WebPushConfig } from '../hooks/use-web-push.js';
import type { AxiosInstance } from 'axios';

const mockRegisterPushSubscription = vi.fn().mockResolvedValue(undefined);
const mockUnregisterPushSubscription = vi.fn().mockResolvedValue(undefined);

vi.mock('@granit/notifications-web-push', () => ({
  registerPushSubscription: (...args: unknown[]) => mockRegisterPushSubscription(...args),
  unregisterPushSubscription: (...args: unknown[]) => mockUnregisterPushSubscription(...args),
  urlBase64ToUint8Array: vi.fn().mockReturnValue(new Uint8Array([1, 2, 3])),
}));

function createMockAxios(): AxiosInstance {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance;
}

function createConfig(overrides?: Partial<WebPushConfig>): WebPushConfig {
  return {
    vapidPublicKey: 'test-vapid-key',
    apiClient: createMockAxios(),
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Helpers for Web Push browser API mocks
// ---------------------------------------------------------------------------

const mockSubscription = {
  endpoint: 'https://push.example.com/sub/123',
  toJSON: () => ({ endpoint: 'https://push.example.com/sub/123', keys: {} }),
  unsubscribe: vi.fn().mockResolvedValue(true),
};

function installWebPushGlobals(opts?: { existingSubscription?: boolean }) {
  const mockGetSubscription = vi
    .fn()
    .mockResolvedValue(opts?.existingSubscription ? mockSubscription : null);
  const mockSubscribe = vi.fn().mockResolvedValue(mockSubscription);

  const mockRegistration = {
    pushManager: {
      getSubscription: mockGetSubscription,
      subscribe: mockSubscribe,
    },
  };

  Object.defineProperty(globalThis, 'Notification', {
    value: {
      permission: 'default',
      requestPermission: vi.fn().mockResolvedValue('granted'),
    },
    writable: true,
    configurable: true,
  });

  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: vi.fn().mockResolvedValue(mockRegistration),
      ready: Promise.resolve(mockRegistration),
      getRegistration: vi.fn().mockResolvedValue(mockRegistration),
    },
    writable: true,
    configurable: true,
  });

  Object.defineProperty(globalThis, 'PushManager', {
    value: class PushManager {},
    writable: true,
    configurable: true,
  });

  return { mockRegistration, mockGetSubscription, mockSubscribe };
}

function removeWebPushGlobals() {
  // @ts-expect-error -- cleanup test globals
  delete navigator.serviceWorker;
  // @ts-expect-error -- cleanup test globals
  delete globalThis.Notification;
  // @ts-expect-error -- cleanup test globals
  delete globalThis.PushManager;
}

describe('useWebPush', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    removeWebPushGlobals();
  });

  // -- Unsupported environment tests --

  it('should detect when Web Push is not supported', () => {
    const { result } = renderHook(() => useWebPush(createConfig()));

    expect(result.current.isSupported).toBe(false);
    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should expose subscribe and unsubscribe functions', () => {
    const { result } = renderHook(() => useWebPush(createConfig()));

    expect(typeof result.current.subscribe).toBe('function');
    expect(typeof result.current.unsubscribe).toBe('function');
  });

  it('should no-op subscribe when Web Push is not supported', async () => {
    const { result } = renderHook(() => useWebPush(createConfig()));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should no-op unsubscribe when Web Push is not supported', async () => {
    const { result } = renderHook(() => useWebPush(createConfig()));

    await act(async () => {
      await result.current.unsubscribe();
    });

    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should use default basePath and serviceWorkerPath', () => {
    const { result } = renderHook(() => useWebPush(createConfig()));

    expect(result.current.error).toBeNull();
  });

  // -- Supported environment tests --

  it('should detect when Web Push is supported', () => {
    installWebPushGlobals();
    const { result } = renderHook(() => useWebPush(createConfig()));

    expect(result.current.isSupported).toBe(true);
    expect(result.current.permission).toBe('default');
  });

  it('should detect existing subscription on mount', async () => {
    installWebPushGlobals({ existingSubscription: true });
    const { result } = renderHook(() => useWebPush(createConfig()));

    await vi.waitFor(() => {
      expect(result.current.isSubscribed).toBe(true);
    });
  });

  it('should subscribe successfully', async () => {
    installWebPushGlobals();
    const config = createConfig();
    const { result } = renderHook(() => useWebPush(config));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.isSubscribed).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockRegisterPushSubscription).toHaveBeenCalledWith(
      config.apiClient,
      '/api/v1',
      mockSubscription.toJSON()
    );
  });

  it('should set error when permission is denied', async () => {
    installWebPushGlobals();
    vi.mocked(globalThis.Notification.requestPermission).mockResolvedValue('denied');

    const { result } = renderHook(() => useWebPush(createConfig()));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Notification permission denied');
    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('should handle subscribe error', async () => {
    installWebPushGlobals();
    mockRegisterPushSubscription.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useWebPush(createConfig()));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.loading).toBe(false);
  });

  it('should unsubscribe successfully', async () => {
    installWebPushGlobals({ existingSubscription: true });
    const config = createConfig();
    const { result } = renderHook(() => useWebPush(config));

    await vi.waitFor(() => {
      expect(result.current.isSubscribed).toBe(true);
    });

    await act(async () => {
      await result.current.unsubscribe();
    });

    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(mockUnregisterPushSubscription).toHaveBeenCalledWith(
      config.apiClient,
      '/api/v1',
      mockSubscription.endpoint
    );
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('should handle unsubscribe error', async () => {
    installWebPushGlobals({ existingSubscription: true });
    mockUnregisterPushSubscription.mockRejectedValueOnce(new Error('Server error'));

    const { result } = renderHook(() => useWebPush(createConfig()));

    await vi.waitFor(() => {
      expect(result.current.isSubscribed).toBe(true);
    });

    await act(async () => {
      await result.current.unsubscribe();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Server error');
    expect(result.current.loading).toBe(false);
  });

  it('should use custom basePath and serviceWorkerPath', async () => {
    installWebPushGlobals();
    const config = createConfig({ basePath: '/custom/api', serviceWorkerPath: '/custom-sw.js' });
    const { result } = renderHook(() => useWebPush(config));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(navigator.serviceWorker.register).toHaveBeenCalledWith('/custom-sw.js');
    expect(mockRegisterPushSubscription).toHaveBeenCalledWith(
      config.apiClient,
      '/custom/api',
      expect.any(Object)
    );
  });

  it('should wrap non-Error thrown values', async () => {
    installWebPushGlobals();
    mockRegisterPushSubscription.mockRejectedValueOnce('string error');

    const { result } = renderHook(() => useWebPush(createConfig()));

    await act(async () => {
      await result.current.subscribe();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('string error');
  });
});
