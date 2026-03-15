import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIdentityCapabilities } from '../hooks/use-identity-capabilities.js';
import { IdentityProvider } from '../providers/identity-provider.js';

import type { IdentityConfig } from '../providers/identity-provider.js';
import type { IdentityProviderCapabilities } from '@granit/identity';
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
      React.createElement(IdentityProvider, { config, children })
    );
  };
}

const mockCapabilities: IdentityProviderCapabilities = {
  providerName: 'Keycloak',
  supportsIndividualSessionTermination: true,
  supportsNativePasswordResetEmail: false,
  supportsGroupHierarchy: true,
  supportsCustomAttributes: false,
  maxCustomAttributes: 50,
  supportsCredentialVerification: true,
  supportsUserCreation: true,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('useIdentityCapabilities', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches capabilities with default basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue({ data: mockCapabilities });

    const { result } = renderHook(() => useIdentityCapabilities({ enabled: true }), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(client.get).toHaveBeenCalled();
  });

  it('fetches capabilities with custom basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue({ data: mockCapabilities });

    const { result } = renderHook(() => useIdentityCapabilities({ enabled: true }), {
      wrapper: createWrapper(client, '/custom/identity'),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(client.get).toHaveBeenCalled();
  });

  it('does not fetch when enabled is false', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useIdentityCapabilities({ enabled: false }), {
      wrapper: createWrapper(client),
    });

    expect(result.current.isFetching).toBe(false);
    expect(client.get).not.toHaveBeenCalled();
  });

  it('defaults to enabled when options omitted', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValue({ data: mockCapabilities });

    const { result } = renderHook(() => useIdentityCapabilities(), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });

  it('exposes error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useIdentityCapabilities({ enabled: true }), {
      wrapper: createWrapper(client),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Network error');
  });
});
