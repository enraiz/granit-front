import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useNotificationContext } from '../providers/notification-provider.js';

import { createMockClient, createWrapper } from './test-utils.js';

describe('NotificationProvider', () => {
  it('provides context with initial values', () => {
    const client = createMockClient();
    // Mock the unread-count fetch that useUnreadCount may trigger indirectly
    vi.mocked(client.get).mockResolvedValue({ data: { count: 0 } });

    const { result } = renderHook(() => useNotificationContext(), {
      wrapper: createWrapper(client),
    });

    expect(result.current.config.apiClient).toBe(client);
    expect(result.current.connectionState).toBeDefined();
    expect(result.current.lastNotification).toBeNull();
    expect(result.current.unreadCount).toBe(0);
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useNotificationContext());
    }).toThrow('useNotificationContext must be used within a <NotificationProvider>');
  });
});
