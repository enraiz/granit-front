import { fetchDeviceTokens } from '@granit/notifications-mobile-push';
import { createQueryWrapper } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { deviceTokenKeys, useDeviceTokens } from '../hooks/use-device-tokens.js';

import type { MobilePushTokenResponse } from '@granit/notifications-mobile-push';

vi.mock('@granit/notifications-mobile-push', () => ({
  fetchDeviceTokens: vi.fn(),
}));

const mockTokens: readonly MobilePushTokenResponse[] = [
  {
    deviceToken: 'token-abc-123',
    platform: 'android',
    createdAt: '2026-03-17T10:00:00Z',
  },
  {
    deviceToken: 'token-def-456',
    platform: 'ios',
    createdAt: '2026-03-17T09:00:00Z',
  },
];

describe('deviceTokenKeys', () => {
  it('should produce stable list key', () => {
    expect(deviceTokenKeys.list()).toEqual(['device-tokens', 'list']);
  });
});

describe('useDeviceTokens', () => {
  it('should fetch device tokens with default basePath', async () => {
    vi.mocked(fetchDeviceTokens).mockResolvedValueOnce(mockTokens);

    const client = createMockClient();
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useDeviceTokens({ client }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchDeviceTokens).toHaveBeenCalledWith(client, '/api/v1');
    expect(result.current.data).toEqual(mockTokens);
  });

  it('should fetch device tokens with custom basePath', async () => {
    vi.mocked(fetchDeviceTokens).mockResolvedValueOnce(mockTokens);

    const client = createMockClient();
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useDeviceTokens({ client, basePath: '/custom/api' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchDeviceTokens).toHaveBeenCalledWith(client, '/custom/api');
  });

  it('should handle fetch error', async () => {
    vi.mocked(fetchDeviceTokens).mockRejectedValueOnce(new Error('Unauthorized'));

    const client = createMockClient();
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useDeviceTokens({ client }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Unauthorized');
  });

  it('should return empty array when no tokens exist', async () => {
    vi.mocked(fetchDeviceTokens).mockResolvedValueOnce([]);

    const client = createMockClient();
    const wrapper = createQueryWrapper();
    const { result } = renderHook(() => useDeviceTokens({ client }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([]);
  });
});
