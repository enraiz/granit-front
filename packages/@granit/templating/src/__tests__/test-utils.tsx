import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TemplatingProvider } from '../providers/templating-provider.js';

import type { AxiosInstance } from 'axios';

export { createMockClient, axiosResponse } from '@granit/api-client/test-utils';

export function createWrapper(
  client: AxiosInstance,
  basePath = '/api/v1',
  queryKeyPrefix: readonly string[] = ['templates']
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
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
