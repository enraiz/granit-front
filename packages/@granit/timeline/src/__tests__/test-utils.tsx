import { TimelineProvider } from '../timeline-provider.tsx';

import type { AxiosInstance } from 'axios';

export { createMockClient, axiosResponse } from '@granit/api-client/test-utils';

export function createWrapper(client: AxiosInstance, basePath = '/api/timeline') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <TimelineProvider apiClient={client} basePath={basePath}>
        {children}
      </TimelineProvider>
    );
  };
}
