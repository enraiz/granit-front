import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useUnreadCount } from '../hooks/use-unread-count.js';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.js';

describe('useUnreadCount', () => {
  it('should fetch unread count on mount', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 7 }));

    const { result } = renderHook(
      () => useUnreadCount({ pollingInterval: 0 }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.count).toBe(7));
  });

  it('should return 0 when fetch fails silently', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('fail'));

    const { result } = renderHook(
      () => useUnreadCount({ pollingInterval: 0 }),
      { wrapper: createWrapper(client) },
    );

    // Should not throw, count stays at initial (0)
    await waitFor(() => expect(result.current.count).toBe(0));
  });

  it('should set up polling when pollingInterval > 0', async () => {
    const setIntervalSpy = vi.spyOn(globalThis, 'setInterval');
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 3 }));

    const { unmount } = renderHook(
      () => useUnreadCount({ pollingInterval: 30_000 }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(client.get).toHaveBeenCalled());

    expect(setIntervalSpy).toHaveBeenCalledWith(expect.any(Function), 30_000);

    unmount();
    setIntervalSpy.mockRestore();
  });

  it('should clean up polling interval on unmount', async () => {
    const clearIntervalSpy = vi.spyOn(globalThis, 'clearInterval');
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 0 }));

    const { unmount } = renderHook(
      () => useUnreadCount({ pollingInterval: 5000 }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(client.get).toHaveBeenCalled());

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();

    clearIntervalSpy.mockRestore();
  });

  it('should allow manual refresh', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 2 }));

    const { result } = renderHook(
      () => useUnreadCount({ pollingInterval: 0 }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.count).toBe(2));

    vi.mocked(client.get).mockResolvedValue(axiosResponse({ count: 5 }));

    await act(async () => {
      result.current.refresh();
    });

    await waitFor(() => expect(result.current.count).toBe(5));
  });
});
