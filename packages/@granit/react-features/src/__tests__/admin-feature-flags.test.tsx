import { createTestQueryClient } from '@granit/react-testing';
import { axiosResponse, createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  useAdminFeatureFlags,
  useToggleAdminFeatureFlag,
} from '../hooks/use-admin-feature-flags.js';
import { FeaturesProvider } from '../providers/features-provider.js';

import type { FeaturesConfig } from '../providers/features-provider.js';
import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createWrapper(client: AxiosInstance, basePath?: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = createTestQueryClient();
    const config: FeaturesConfig = { client, basePath };
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      <FeaturesProvider config={config}>{children}</FeaturesProvider>
    );
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ---------------------------------------------------------------------------
// useAdminFeatureFlags
// ---------------------------------------------------------------------------

describe('useAdminFeatureFlags', () => {
  it('should fetch admin feature flags', async () => {
    const client = createMockClient();
    const flags = [
      { key: 'Acme.Video', isEnabled: true, lastModifiedBy: 'admin', lastModifiedAt: '2025-01-01' },
    ];
    vi.mocked(client.get).mockResolvedValue(axiosResponse(flags));

    const { result } = renderHook(() => useAdminFeatureFlags(), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/admin/config/flags');
    expect(result.current.data).toEqual(flags);
  });

  it('should use empty string when basePath is undefined', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([]));

    const { result } = renderHook(() => useAdminFeatureFlags(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/admin/config/flags');
  });

  it('should not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useAdminFeatureFlags({ enabled: false }), {
      wrapper: createWrapper(client, '/api'),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// useToggleAdminFeatureFlag
// ---------------------------------------------------------------------------

describe('useToggleAdminFeatureFlag', () => {
  it('should toggle a feature flag on', async () => {
    const client = createMockClient();
    vi.mocked(client.patch).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useToggleAdminFeatureFlag(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.mutate({ key: 'Acme.Video', enabled: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.patch).toHaveBeenCalledWith('/api/admin/config/flags/Acme.Video', {
      enabled: true,
    });
  });

  it('should toggle a feature flag off', async () => {
    const client = createMockClient();
    vi.mocked(client.patch).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useToggleAdminFeatureFlag(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.mutate({ key: 'Acme.Export', enabled: false });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.patch).toHaveBeenCalledWith('/api/admin/config/flags/Acme.Export', {
      enabled: false,
    });
  });

  it('should use empty string when basePath is undefined', async () => {
    const client = createMockClient();
    vi.mocked(client.patch).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useToggleAdminFeatureFlag(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      result.current.mutate({ key: 'key', enabled: true });
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.patch).toHaveBeenCalledWith('/admin/config/flags/key', {
      enabled: true,
    });
  });

  it('should expose error on mutation failure', async () => {
    const client = createMockClient();
    vi.mocked(client.patch).mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useToggleAdminFeatureFlag(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.mutate({ key: 'key', enabled: true });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe('Forbidden');
  });
});
