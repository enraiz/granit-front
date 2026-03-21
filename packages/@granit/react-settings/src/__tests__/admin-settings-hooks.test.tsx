import { createTestQueryClient } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAdminAppSettings, useSaveAdminAppSettings } from '../hooks/use-admin-app-settings.js';
import { SettingsProvider } from '../providers/settings-provider.js';

import type { AdminAppSetting } from '@granit/settings';
import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

vi.mock('@granit/settings', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return {
    ...actual,
    fetchAdminAppSettings: vi.fn(),
    saveAdminAppSettings: vi.fn(),
  };
});

const { fetchAdminAppSettings, saveAdminAppSettings } = await import('@granit/settings');

function createWrapper(client: AxiosInstance, basePath?: string) {
  const queryClient = createTestQueryClient();
  return {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <SettingsProvider config={{ client, basePath }}>{children}</SettingsProvider>
      </QueryClientProvider>
    ),
    queryClient,
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

const mockSettings: AdminAppSetting[] = [
  {
    key: 'Granit.Locale',
    label: 'Locale',
    description: 'Default locale',
    value: 'fr',
    type: 'string',
  },
];

describe('useAdminAppSettings', () => {
  it('should fetch admin settings', async () => {
    const client = createMockClient();
    vi.mocked(fetchAdminAppSettings).mockResolvedValue(mockSettings);

    const { wrapper } = createWrapper(client, '/api');
    const { result } = renderHook(() => useAdminAppSettings(), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchAdminAppSettings).toHaveBeenCalledWith(client, '/api');
    expect(result.current.data).toEqual(mockSettings);
  });

  it('should respect enabled option', () => {
    const client = createMockClient();

    const { wrapper } = createWrapper(client);
    const { result } = renderHook(() => useAdminAppSettings({ enabled: false }), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(fetchAdminAppSettings).not.toHaveBeenCalled();
  });
});

describe('useSaveAdminAppSettings', () => {
  it('should save settings and invalidate queries', async () => {
    const client = createMockClient();
    vi.mocked(saveAdminAppSettings).mockResolvedValue(undefined);

    const { wrapper, queryClient } = createWrapper(client, '/api');
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
    const { result } = renderHook(() => useSaveAdminAppSettings(), { wrapper });

    const payload = [{ key: 'Granit.Locale', value: 'en' }];

    await act(async () => {
      await result.current.mutateAsync(payload);
    });

    expect(saveAdminAppSettings).toHaveBeenCalledWith(client, '/api', payload);
    expect(invalidateSpy).toHaveBeenCalled();
  });
});
