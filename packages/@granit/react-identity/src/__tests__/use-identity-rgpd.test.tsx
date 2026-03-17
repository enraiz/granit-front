import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIdentityRgpd } from '../hooks/use-identity-rgpd.js';
import { IdentityProvider } from '../providers/identity-provider.js';

import type { IdentityConfig } from '../providers/identity-provider.js';
import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockClient(): AxiosInstance {
  return { get: vi.fn(), post: vi.fn(), put: vi.fn(), delete: vi.fn() } as unknown as AxiosInstance;
}

function createWrapper(client: AxiosInstance, basePath?: string) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const config: IdentityConfig = { client, basePath };
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      <IdentityProvider config={config}>{children}</IdentityProvider>
    );
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useIdentityRgpd', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('erase mutation deletes user cache', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockResolvedValue({ data: undefined });

    const { result } = renderHook(() => useIdentityRgpd(), {
      wrapper: createWrapper(client),
    });

    result.current.erase.mutate('user-1');

    await waitFor(() => expect(result.current.erase.isSuccess).toBe(true));
    expect(client.delete).toHaveBeenCalledWith('/identity/users/user-1/erase');
  });

  it('pseudonymize mutation pseudonymizes user cache', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockResolvedValue({ data: undefined });

    const { result } = renderHook(() => useIdentityRgpd(), {
      wrapper: createWrapper(client),
    });

    result.current.pseudonymize.mutate('user-1');

    await waitFor(() => expect(result.current.pseudonymize.isSuccess).toBe(true));
    expect(client.post).toHaveBeenCalledWith('/identity/users/user-1/pseudonymize');
  });

  it('uses custom basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockResolvedValue({ data: undefined });

    const { result } = renderHook(() => useIdentityRgpd(), {
      wrapper: createWrapper(client, '/custom/path'),
    });

    result.current.erase.mutate('user-1');

    await waitFor(() => expect(result.current.erase.isSuccess).toBe(true));
    expect(client.delete).toHaveBeenCalledWith('/custom/path/user-1/erase');
  });

  it('exposes error state on erase failure', async () => {
    const client = createMockClient();
    vi.mocked(client.delete).mockRejectedValue(new Error('Forbidden'));

    const { result } = renderHook(() => useIdentityRgpd(), {
      wrapper: createWrapper(client),
    });

    result.current.erase.mutate('user-1');

    await waitFor(() => expect(result.current.erase.isError).toBe(true));
    expect(result.current.erase.error?.message).toBe('Forbidden');
  });

  it('exposes error state on pseudonymize failure', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockRejectedValue(new Error('Not found'));

    const { result } = renderHook(() => useIdentityRgpd(), {
      wrapper: createWrapper(client),
    });

    result.current.pseudonymize.mutate('user-1');

    await waitFor(() => expect(result.current.pseudonymize.isError).toBe(true));
    expect(result.current.pseudonymize.error?.message).toBe('Not found');
  });
});
