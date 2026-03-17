import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import type { ReactNode } from 'react';

/**
 * Create a QueryClient configured for tests — retries disabled on both
 * queries and mutations to make tests deterministic and fast.
 */
export function createTestQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

/**
 * Create a wrapper component that provides a QueryClientProvider.
 * Useful as the `wrapper` option in `renderHook()` and `render()`.
 *
 * @param queryClient - Optional custom QueryClient. Defaults to `createTestQueryClient()`.
 */
export function createQueryWrapper(queryClient?: QueryClient) {
  const client = queryClient ?? createTestQueryClient();
  return function QueryWrapper({ children }: Readonly<{ children: ReactNode }>) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}
