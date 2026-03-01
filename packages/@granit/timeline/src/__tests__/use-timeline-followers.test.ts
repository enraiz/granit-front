import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';


import { useTimelineFollowers } from '../use-timeline-followers.ts';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.tsx';

describe('useTimelineFollowers', () => {
  it('loads followers on mount', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(['u-1', 'u-2']));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
          currentUserId: 'u-1',
        }),
      { wrapper: createWrapper(client) },
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.followers).toEqual(['u-1', 'u-2']);
    expect(result.current.isFollowing).toBe(true);
  });

  it('detects isFollowing=false when user not in followers', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(['u-2']));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
          currentUserId: 'u-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isFollowing).toBe(false);
  });

  it('follows an entity and updates local state', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([]));
    vi.mocked(client.post).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
          currentUserId: 'u-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isFollowing).toBe(false);

    await result.current.follow();

    await waitFor(() => expect(result.current.isFollowing).toBe(true));
    expect(result.current.followers).toContain('u-1');
    expect(client.post).toHaveBeenCalledWith('/api/timeline/Patient/p-1/follow');
  });

  it('unfollows an entity and updates local state', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(['u-1']));
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
          currentUserId: 'u-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.isFollowing).toBe(true);

    await result.current.unfollow();

    await waitFor(() => expect(result.current.isFollowing).toBe(false));
    expect(result.current.followers).not.toContain('u-1');
    expect(client.delete).toHaveBeenCalledWith('/api/timeline/Patient/p-1/follow');
  });

  it('sets error state on follow failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([]));
    vi.mocked(client.post).mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
          currentUserId: 'u-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    await expect(result.current.follow()).rejects.toThrow('Forbidden');

    await waitFor(() => expect(result.current.error?.message).toBe('Forbidden'));
  });

  it('handles missing currentUserId gracefully', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse(['u-1']));

    const { result } = renderHook(
      () =>
        useTimelineFollowers({
          entityType: 'Patient',
          entityId: 'p-1',
        }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.isFollowing).toBe(false);
    expect(result.current.followers).toEqual(['u-1']);
  });
});
