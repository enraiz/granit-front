import { WorkflowProvider } from '../workflow-provider.tsx';

import type { AxiosInstance } from 'axios';

export { createMockClient, axiosResponse } from '@granit/api-client/test-utils';

export function createWrapper(client: AxiosInstance, basePath = '/api/workflow') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <WorkflowProvider apiClient={client} basePath={basePath}>
        {children}
      </WorkflowProvider>
    );
  };
}
