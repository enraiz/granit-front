import { vi } from 'vitest';

import { WorkflowProvider } from '../workflow-provider.tsx';

import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export function createMockClient(): AxiosInstance {
  return {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    request: vi.fn(),
    head: vi.fn(),
    options: vi.fn(),
    getUri: vi.fn(),
    defaults: {} as AxiosInstance['defaults'],
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    },
  } as unknown as AxiosInstance;
}

export function axiosResponse<T>(data: T): AxiosResponse<T> {
  return {
    data,
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig,
  };
}

export function createWrapper(client: AxiosInstance, basePath = '/api/workflow') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <WorkflowProvider apiClient={client} basePath={basePath}>
        {children}
      </WorkflowProvider>
    );
  };
}
