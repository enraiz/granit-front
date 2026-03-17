import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useWebPush } from '../hooks/use-web-push.js';

import type { WebPushConfig } from '../hooks/use-web-push.js';
import type { AxiosInstance } from 'axios';

vi.mock('@granit/notifications-web-push', () => ({
  registerPushSubscription: vi.fn().mockResolvedValue(undefined),
  unregisterPushSubscription: vi.fn().mockResolvedValue(undefined),
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

describe('useWebPush', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should detect when Web Push is not supported', () => {
    // jsdom does not have serviceWorker/PushManager by default
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

    // Hook initializes without error using defaults
    expect(result.current.error).toBeNull();
  });
});
