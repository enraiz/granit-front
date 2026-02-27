import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useKeycloakInit } from '../keycloak-core.ts';
import type { KeycloakCoreConfig } from '../types.ts';

// ---------------------------------------------------------------------------
// Hoisted mock references (declared before vi.mock hoisting)
// ---------------------------------------------------------------------------
const { mockInit, mockLogin, mockLogout, mockLoadUserInfo, mockUpdateToken, mockSetTokenGetter } =
  vi.hoisted(() => ({
    mockInit: vi.fn(),
    mockLogin: vi.fn(),
    mockLogout: vi.fn(),
    mockLoadUserInfo: vi.fn(),
    mockUpdateToken: vi.fn(),
    mockSetTokenGetter: vi.fn(),
  }));

vi.mock('keycloak-js', () => ({
  default: vi.fn(() => ({
    init: mockInit,
    login: mockLogin,
    logout: mockLogout,
    loadUserInfo: mockLoadUserInfo,
    updateToken: mockUpdateToken,
    token: 'mock-access-token',
  })),
}));

vi.mock('@granit/api-client', () => ({
  setTokenGetter: mockSetTokenGetter,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const config: KeycloakCoreConfig = {
  url: 'https://auth.example.com',
  realm: 'test-realm',
  clientId: 'test-client',
};

const userInfo = { sub: 'user-1', email: 'test@example.com', preferred_username: 'testuser' };

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('useKeycloakInit', () => {
  beforeEach(() => {
    mockLoadUserInfo.mockResolvedValue(userInfo);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('starts with loading=true and authenticated=false', () => {
    mockInit.mockResolvedValue(false);
    const { result } = renderHook(() => useKeycloakInit(config));
    expect(result.current.loading).toBe(true);
    expect(result.current.authenticated).toBe(false);
  });

  it('sets loading=false after unauthenticated init', async () => {
    mockInit.mockResolvedValue(false);
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.authenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('sets authenticated=true and loads user info after successful init', async () => {
    mockInit.mockResolvedValue(true);
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.authenticated).toBe(true);
    expect(result.current.user).toMatchObject({ sub: 'user-1' });
  });

  it('registers a token getter with setTokenGetter when authenticated', async () => {
    mockInit.mockResolvedValue(true);
    renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(mockSetTokenGetter).toHaveBeenCalledOnce());
  });

  it('stays unauthenticated when keycloak.init rejects', async () => {
    mockInit.mockRejectedValue(new Error('network error'));
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.authenticated).toBe(false);
  });

  it('handles loadUserInfo failure gracefully (non-fatal)', async () => {
    mockInit.mockResolvedValue(true);
    mockLoadUserInfo.mockRejectedValue(new Error('user info failed'));
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.authenticated).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('login calls keycloak.login()', async () => {
    mockInit.mockResolvedValue(true);
    mockLogin.mockResolvedValue(undefined);
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.login();
    });

    expect(mockLogin).toHaveBeenCalledOnce();
  });

  it('logout calls keycloak.logout()', async () => {
    mockInit.mockResolvedValue(true);
    mockLogout.mockResolvedValue(undefined);
    const { result } = renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(result.current.loading).toBe(false));

    await act(async () => {
      await result.current.logout();
    });

    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('token getter returns token after successful updateToken', async () => {
    mockInit.mockResolvedValue(true);
    mockUpdateToken.mockResolvedValue(true);
    renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(mockSetTokenGetter).toHaveBeenCalledOnce());

    const getter = mockSetTokenGetter.mock.calls[0][0] as () => Promise<string | undefined>;
    const token = await getter();
    expect(token).toBe('mock-access-token');
  });

  it('token getter returns undefined when updateToken rejects', async () => {
    mockInit.mockResolvedValue(true);
    mockUpdateToken.mockRejectedValue(new Error('token expired'));
    renderHook(() => useKeycloakInit(config));

    await waitFor(() => expect(mockSetTokenGetter).toHaveBeenCalledOnce());

    const getter = mockSetTokenGetter.mock.calls[0][0] as () => Promise<string | undefined>;
    const token = await getter();
    expect(token).toBeUndefined();
  });

  it('silentCheckSso is omitted from init options when silentCheckSso=false', async () => {
    mockInit.mockResolvedValue(false);
    const { result } = renderHook(() =>
      useKeycloakInit({ ...config, silentCheckSso: false })
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    const initArg = mockInit.mock.calls[0][0] as Record<string, unknown>;
    expect(initArg).not.toHaveProperty('silentCheckSsoRedirectUri');
  });
});
