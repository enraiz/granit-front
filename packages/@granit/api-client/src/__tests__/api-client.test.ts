import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ApiClientConfig } from '../index.ts';
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

// Dynamic import type to get fresh module state per test
interface ApiClientModule {
  createApiClient: (config: ApiClientConfig) => AxiosInstance;
  setTokenGetter: (getter: () => Promise<string | undefined>) => void;
  setTenantGetter: (getter: () => string | undefined) => void;
  createMutator: (
    instance: AxiosInstance,
  ) => <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig) => Promise<T>;
}

/**
 * Adapter that resolves immediately, allowing interceptors to run
 * without making actual HTTP calls. Returns the final request config
 * (post-interceptor) inside response.data for inspection.
 */
function captureAdapter(config: InternalAxiosRequestConfig): Promise<AxiosResponse> {
  return Promise.resolve({
    data: { __captured: true },
    status: 200,
    statusText: 'OK',
    headers: {},
    config,
  });
}

describe('createApiClient', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should create an instance with correct baseURL and default timeout', () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    expect(client.defaults.baseURL).toBe('https://api.example.com');
    expect(client.defaults.timeout).toBe(10_000);
  });

  it('should accept a custom timeout', () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com', timeout: 30_000 });
    expect(client.defaults.timeout).toBe(30_000);
  });

  it('should set Content-Type to application/json', () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    expect(client.defaults.headers['Content-Type']).toBe('application/json');
  });
});

describe('token interceptor', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should inject Authorization header when token getter returns a token', async () => {
    mod.setTokenGetter(() => Promise.resolve('my-jwt-token'));
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers.Authorization).toBe('Bearer my-jwt-token');
  });

  it('should not inject Authorization header when token getter returns undefined', async () => {
    mod.setTokenGetter(() => Promise.resolve(undefined));
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers.Authorization).toBeUndefined();
  });

  it('should not inject Authorization header when no token getter is configured', async () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers.Authorization).toBeUndefined();
  });
});

describe('tenant interceptor', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should inject X-Tenant-Id header when tenant getter returns a value', async () => {
    mod.setTenantGetter(() => 'tenant-42');
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers['X-Tenant-Id']).toBe('tenant-42');
  });

  it('should not inject X-Tenant-Id when tenant getter returns undefined', async () => {
    mod.setTenantGetter(() => undefined);
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers['X-Tenant-Id']).toBeUndefined();
  });

  it('should not inject X-Tenant-Id when no tenant getter is configured', async () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers['X-Tenant-Id']).toBeUndefined();
  });
});

describe('combined interceptors', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should inject both Authorization and X-Tenant-Id when both getters are configured', async () => {
    mod.setTokenGetter(() => Promise.resolve('jwt-123'));
    mod.setTenantGetter(() => 'tenant-abc');
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = captureAdapter;

    const response = await client.get('/test');
    expect(response.config.headers.Authorization).toBe('Bearer jwt-123');
    expect(response.config.headers['X-Tenant-Id']).toBe('tenant-abc');
  });
});

describe('setTokenGetter', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should accept an async getter function without throwing', () => {
    expect(() => {
      mod.setTokenGetter(() => Promise.resolve('mock-token'));
    }).not.toThrow();
  });
});

describe('setTenantGetter', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should accept a synchronous getter function without throwing', () => {
    expect(() => {
      mod.setTenantGetter(() => 'tenant-1');
    }).not.toThrow();
  });
});

describe('createMutator', () => {
  let mod: ApiClientModule;

  beforeEach(async () => {
    vi.resetModules();
    mod = await import('../index.ts');
  });

  it('should return response data instead of the full AxiosResponse', async () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = () =>
      Promise.resolve({
        data: { id: 1, name: 'test' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as InternalAxiosRequestConfig,
      });

    const mutator = mod.createMutator(client);
    const result = await mutator<{ id: number; name: string }>({ url: '/test', method: 'GET' });
    expect(result).toEqual({ id: 1, name: 'test' });
  });

  it('should merge config and options', async () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    let capturedConfig: Record<string, unknown> = {};
    client.defaults.adapter = (config) => {
      capturedConfig = config as unknown as Record<string, unknown>;
      return Promise.resolve({
        data: {},
        status: 200,
        statusText: 'OK',
        headers: {},
        config: config as InternalAxiosRequestConfig,
      });
    };

    const mutator = mod.createMutator(client);
    await mutator({ url: '/test', method: 'GET' }, { params: { page: 1 } });
    expect(capturedConfig.params).toEqual({ page: 1 });
  });

  it('should propagate errors from the axios instance', async () => {
    const client = mod.createApiClient({ baseURL: 'https://api.example.com' });
    client.defaults.adapter = () => Promise.reject(new Error('Network Error'));

    const mutator = mod.createMutator(client);
    await expect(mutator({ url: '/test', method: 'GET' })).rejects.toThrow('Network Error');
  });
});
