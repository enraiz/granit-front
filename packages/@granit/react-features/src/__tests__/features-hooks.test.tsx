import { createTestQueryClient } from '@granit/react-testing';
import { axiosResponse, createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useDeleteFeatureOverride } from '../hooks/use-delete-feature-override.js';
import { useFeatureDefinitions } from '../hooks/use-feature-definitions.js';
import { useFeatureFlag } from '../hooks/use-feature-flag.js';
import { useFeatureValue } from '../hooks/use-feature-value.js';
import { useFeatureValues } from '../hooks/use-feature-values.js';
import { useSetFeatureOverride } from '../hooks/use-set-feature-override.js';
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
// useFeatureDefinitions
// ---------------------------------------------------------------------------

describe('useFeatureDefinitions', () => {
  it('should fetch all feature definitions', async () => {
    const client = createMockClient();
    const groups = [{ name: 'Acme', displayName: 'Acme Features', features: [] }];
    vi.mocked(client.get).mockResolvedValue(axiosResponse(groups));

    const { result } = renderHook(() => useFeatureDefinitions(), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/features/definitions');
    expect(result.current.data).toEqual(groups);
  });

  it('should use empty string when basePath is undefined', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse([]));

    const { result } = renderHook(() => useFeatureDefinitions(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/features/definitions');
  });

  it('should not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useFeatureDefinitions({ enabled: false }), {
      wrapper: createWrapper(client, '/api'),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// useFeatureValues
// ---------------------------------------------------------------------------

describe('useFeatureValues', () => {
  it('should fetch all resolved values', async () => {
    const client = createMockClient();
    const values = { 'Acme.Video': 'true', 'Acme.MaxUsers': '50' };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(values));

    const { result } = renderHook(() => useFeatureValues(), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/features/values');
    expect(result.current.data).toEqual(values);
  });

  it('should not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useFeatureValues({ enabled: false }), {
      wrapper: createWrapper(client, '/api'),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// useFeatureFlag
// ---------------------------------------------------------------------------

describe('useFeatureFlag', () => {
  it('should return isEnabled true when value is "true"', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(
      axiosResponse({ 'Acme.Video': 'true', 'Acme.Export': 'false' })
    );

    const { result } = renderHook(() => useFeatureFlag('Acme.Video'), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isEnabled).toBe(true);
  });

  it('should return isEnabled false when value is "false"', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ 'Acme.Export': 'false' }));

    const { result } = renderHook(() => useFeatureFlag('Acme.Export'), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isEnabled).toBe(false);
  });

  it('should return isEnabled false when feature is not in map', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));

    const { result } = renderHook(() => useFeatureFlag('NonExistent'), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.isEnabled).toBe(false);
  });

  it('should return isLoading true while fetching', () => {
    const client = createMockClient();
    // Never resolve to keep loading state
    vi.mocked(client.get).mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useFeatureFlag('Acme.Video'), {
      wrapper: createWrapper(client, '/api'),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isEnabled).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// useFeatureValue
// ---------------------------------------------------------------------------

describe('useFeatureValue', () => {
  it('should return the raw value for a feature', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({ 'Acme.MaxUsers': '50' }));

    const { result } = renderHook(() => useFeatureValue('Acme.MaxUsers'), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.value).toBe('50');
  });

  it('should return undefined for missing feature', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));

    const { result } = renderHook(() => useFeatureValue('NonExistent'), {
      wrapper: createWrapper(client, '/api'),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.value).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// useSetFeatureOverride
// ---------------------------------------------------------------------------

describe('useSetFeatureOverride', () => {
  it('should call setFeatureOverride via the set function', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.put).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useSetFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.set('Acme.MaxUsers', '100');
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(client.put).toHaveBeenCalledWith('/api/features/overrides/Acme.MaxUsers', {
      value: '100',
    });
  });

  it('should call setFeatureOverride via setAsync', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.put).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useSetFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      await result.current.setAsync('Acme.Video', 'true');
    });

    expect(client.put).toHaveBeenCalledWith('/api/features/overrides/Acme.Video', {
      value: 'true',
    });
  });

  it('should use empty string when basePath is undefined', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.put).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useSetFeatureOverride(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      result.current.set('key', 'val');
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(client.put).toHaveBeenCalledWith('/features/overrides/key', { value: 'val' });
  });

  it('should expose error on mutation failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.put).mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useSetFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.set('key', 'val');
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.message).toBe('Forbidden');
  });
});

// ---------------------------------------------------------------------------
// useDeleteFeatureOverride
// ---------------------------------------------------------------------------

describe('useDeleteFeatureOverride', () => {
  it('should call deleteFeatureOverride via the remove function', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useDeleteFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.remove('Acme.Video');
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(client.delete).toHaveBeenCalledWith('/api/features/overrides/Acme.Video');
  });

  it('should call deleteFeatureOverride via removeAsync', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useDeleteFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      await result.current.removeAsync('Acme.MaxUsers');
    });

    expect(client.delete).toHaveBeenCalledWith('/api/features/overrides/Acme.MaxUsers');
  });

  it('should use empty string when basePath is undefined', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.delete).mockResolvedValue(axiosResponse(undefined));

    const { result } = renderHook(() => useDeleteFeatureOverride(), {
      wrapper: createWrapper(client),
    });

    await act(async () => {
      result.current.remove('key');
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));

    expect(client.delete).toHaveBeenCalledWith('/features/overrides/key');
  });

  it('should expose error on mutation failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue(axiosResponse({}));
    vi.mocked(client.delete).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useDeleteFeatureOverride(), {
      wrapper: createWrapper(client, '/api'),
    });

    await act(async () => {
      result.current.remove('key');
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.message).toBe('Not found');
  });
});
