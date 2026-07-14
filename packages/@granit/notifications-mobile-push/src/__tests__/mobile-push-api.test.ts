import { createMockClient } from '@granit/testing';
import { toISODateString } from '@granit/types';
import { describe, expect, it, vi } from 'vitest';

import {
  listDeviceTokens,
  registerDeviceToken,
  unregisterDeviceToken,
} from '../api/mobile-push-api';

describe('mobile-push-api', () => {
  it('should register a device token', async () => {
    const client = createMockClient();

    await registerDeviceToken(client, '/api/v1', {
      deviceToken: 'fcm-token-123',
      platform: 'Android',
    });

    expect(client.post).toHaveBeenCalledWith('/api/v1/notifications/mobile-push/tokens', {
      deviceToken: 'fcm-token-123',
      platform: 'Android',
    });
  });

  it('should unregister a device token via the request body', async () => {
    const client = createMockClient();

    await unregisterDeviceToken(client, '/api/v1', 'fcm-token-123');

    // The token is a sendable credential, so it travels in the body, never the URL.
    expect(client.delete).toHaveBeenCalledWith('/api/v1/notifications/mobile-push/tokens', {
      data: { deviceToken: 'fcm-token-123' },
    });
  });

  it('should carry tokens with special characters unescaped in the body', async () => {
    const client = createMockClient();

    await unregisterDeviceToken(client, '/api/v1', 'token/with+special=chars');

    expect(client.delete).toHaveBeenCalledWith('/api/v1/notifications/mobile-push/tokens', {
      data: { deviceToken: 'token/with+special=chars' },
    });
  });

  it('should fetch all device tokens', async () => {
    const client = createMockClient();
    const tokens = [
      {
        deviceTokenPreview: 'token-1',
        platform: 'Android' as const,
        createdAt: toISODateString('2026-03-17T10:00:00Z'),
      },
      {
        deviceTokenPreview: 'token-2',
        platform: 'Ios' as const,
        createdAt: toISODateString('2026-03-17T11:00:00Z'),
      },
    ];
    vi.mocked(client.get).mockResolvedValueOnce({ data: tokens });

    const result = await listDeviceTokens(client, '/api/v1');
    expect(client.get).toHaveBeenCalledWith('/api/v1/notifications/mobile-push/tokens');
    expect(result).toEqual(tokens);
  });

  it('should return empty array when no tokens registered', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValueOnce({ data: [] });

    const result = await listDeviceTokens(client, '/api/v1');
    expect(result).toEqual([]);
  });
});
