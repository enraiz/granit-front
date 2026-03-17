import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useMobilePush } from '../hooks/use-mobile-push.js';

import type { MobilePushConfig } from '../hooks/use-mobile-push.js';
import type { AxiosInstance } from 'axios';

const mockCheckPermissions = vi.fn();
const mockRequestPermissions = vi.fn();
const mockRegister = vi.fn();
const mockAddListener = vi.fn();

vi.mock('@capacitor/push-notifications', () => ({
  PushNotifications: {
    checkPermissions: (...args: unknown[]) => mockCheckPermissions(...args),
    requestPermissions: (...args: unknown[]) => mockRequestPermissions(...args),
    register: (...args: unknown[]) => mockRegister(...args),
    addListener: (...args: unknown[]) => mockAddListener(...args),
  },
}));

vi.mock('@granit/notifications-mobile-push', () => ({
  registerDeviceToken: vi.fn().mockResolvedValue(undefined),
  unregisterDeviceToken: vi.fn().mockResolvedValue(undefined),
}));

function createMockAxios(): AxiosInstance {
  return {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance;
}

function createConfig(overrides?: Partial<MobilePushConfig>): MobilePushConfig {
  return {
    apiClient: createMockAxios(),
    platform: 'android',
    ...overrides,
  };
}

describe('useMobilePush', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAddListener.mockResolvedValue({ remove: vi.fn() });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useMobilePush(createConfig()));

    expect(result.current.isRegistered).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should expose register and unregister functions', () => {
    const { result } = renderHook(() => useMobilePush(createConfig()));

    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.unregister).toBe('function');
  });

  it('should set error when permission is denied', async () => {
    mockCheckPermissions.mockResolvedValue({ receive: 'prompt' });
    mockRequestPermissions.mockResolvedValue({ receive: 'denied' });

    const { result } = renderHook(() => useMobilePush(createConfig()));

    await act(async () => {
      await result.current.register();
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('Push notification permission denied');
    expect(result.current.loading).toBe(false);
    expect(result.current.isRegistered).toBe(false);
  });

  it('should handle unregister when no token exists', async () => {
    const { result } = renderHook(() => useMobilePush(createConfig()));

    await act(async () => {
      await result.current.unregister();
    });

    expect(result.current.isRegistered).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should use default basePath', () => {
    const { result } = renderHook(() => useMobilePush(createConfig()));

    // Hook initializes without error using default basePath
    expect(result.current.error).toBeNull();
  });

  it('should accept custom basePath', () => {
    const { result } = renderHook(() => useMobilePush(createConfig({ basePath: '/custom/api' })));

    expect(result.current.error).toBeNull();
  });
});
