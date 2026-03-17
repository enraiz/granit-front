import { createTestQueryClient } from '@granit/react-testing';
import { axiosResponse, createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';

import { TemplatingProvider } from '../providers/templating-provider.js';

import type { AxiosInstance } from 'axios';

export { createMockClient, axiosResponse };

export function createWrapper(
  client: AxiosInstance,
  basePath = '/api/v1',
  queryKeyPrefix: readonly string[] = ['templates']
) {
  const queryClient = createTestQueryClient();
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <QueryClientProvider client={queryClient}>
        <TemplatingProvider client={client} basePath={basePath} queryKeyPrefix={queryKeyPrefix}>
          {children}
        </TemplatingProvider>
      </QueryClientProvider>
    );
  };
}
