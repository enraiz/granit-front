import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { usePermissions } from '../hooks/use-permissions.js';

import type { PermissionsResponse } from '../types/index.js';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { ReactNode } from 'react';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockClient(
  response: PermissionsResponse = { permissions: [] },
): AxiosInstance {
  return {
    get: vi.fn().mockResolvedValue({ data: response } as AxiosResponse<PermissionsResponse>),
  } as unknown as AxiosInstance;
}

function createFailingClient(error: Error): AxiosInstance {
  return {
    get: vi.fn().mockRejectedValue(error),
  } as unknown as AxiosInstance;
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  function Wrapper({ children }: Readonly<{ children: ReactNode }>) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return { Wrapper, queryClient };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('usePermissions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  // ── Loading state ─────────────────────────────────────────────────────────

  it('should start with isLoading=true and empty permissions', () => {
    const client = createMockClient({ permissions: ['A'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.permissions.size).toBe(0);
  });

  // ── Successful fetch ──────────────────────────────────────────────────────

  it('should return granted permissions after successful fetch', async () => {
    const client = createMockClient({
      permissions: ['Invoices.Read', 'Invoices.Create', 'Reports.Export'],
    });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions.size).toBe(3);
    expect(result.current.error).toBeNull();
  });

  it('should call GET /auth/me with default basePath', async () => {
    const client = createMockClient();
    const { Wrapper } = createWrapper();

    renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(client.get).toHaveBeenCalledOnce());

    expect(client.get).toHaveBeenCalledWith('/auth/me');
  });

  it('should use custom basePath when provided', async () => {
    const client = createMockClient();
    const { Wrapper } = createWrapper();

    renderHook(
      () => usePermissions({ client, basePath: '/api/v1/authorization' }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(client.get).toHaveBeenCalledOnce());

    expect(client.get).toHaveBeenCalledWith('/api/v1/authorization/me');
  });

  // ── hasPermission ─────────────────────────────────────────────────────────

  it('hasPermission should return true for a granted permission', async () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasPermission('Invoices.Read')).toBe(true);
  });

  it('hasPermission should return false for an ungranted permission', async () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasPermission('Invoices.Delete')).toBe(false);
  });

  it('hasPermission should return false while loading (safe default)', () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    expect(result.current.hasPermission('Invoices.Read')).toBe(false);
  });

  // ── hasAnyPermission ──────────────────────────────────────────────────────

  it('hasAnyPermission should return true when at least one matches', async () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAnyPermission(['Invoices.Read', 'Invoices.Delete'])).toBe(true);
  });

  it('hasAnyPermission should return false when none match', async () => {
    const client = createMockClient({ permissions: ['Reports.Export'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAnyPermission(['Invoices.Read', 'Invoices.Delete'])).toBe(false);
  });

  // ── hasAllPermissions ─────────────────────────────────────────────────────

  it('hasAllPermissions should return true when all match', async () => {
    const client = createMockClient({
      permissions: ['Invoices.Read', 'Invoices.Create', 'Reports.Export'],
    });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAllPermissions(['Invoices.Read', 'Invoices.Create'])).toBe(true);
  });

  it('hasAllPermissions should return false when only some match', async () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.hasAllPermissions(['Invoices.Read', 'Invoices.Delete'])).toBe(false);
  });

  // ── Error handling ────────────────────────────────────────────────────────

  it('should expose error and return empty permissions on fetch failure', async () => {
    const client = createFailingClient(new Error('Network error'));
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.error).not.toBeNull(), { timeout: 5000 });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.permissions.size).toBe(0);
    expect(result.current.hasPermission('Anything')).toBe(false);
  });

  // ── Disabled query ────────────────────────────────────────────────────────

  it('should not fetch when enabled=false', async () => {
    const client = createMockClient({ permissions: ['Invoices.Read'] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client, enabled: false }),
      { wrapper: Wrapper },
    );

    // Wait a tick to ensure no fetch is triggered.
    await new Promise((resolve) => { setTimeout(resolve, 50); });

    expect(client.get).not.toHaveBeenCalled();
    expect(result.current.permissions.size).toBe(0);
  });

  // ── Empty permissions ─────────────────────────────────────────────────────

  it('should handle empty permissions list gracefully', async () => {
    const client = createMockClient({ permissions: [] });
    const { Wrapper } = createWrapper();

    const { result } = renderHook(
      () => usePermissions({ client }),
      { wrapper: Wrapper },
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.permissions.size).toBe(0);
    expect(result.current.hasPermission('Anything')).toBe(false);
    expect(result.current.hasAnyPermission(['A', 'B'])).toBe(false);
    expect(result.current.hasAllPermissions([])).toBe(true); // vacuous truth
  });
});
