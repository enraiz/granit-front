export { axiosResponse, createMockClient } from '@granit/testing';

import { WorkflowProvider } from '../providers/workflow-provider.js';

import type { AxiosInstance } from 'axios';

export function createWrapper(client: AxiosInstance, basePath = '/api/v1/workflow') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <WorkflowProvider apiClient={client} basePath={basePath}>
        {children}
      </WorkflowProvider>
    );
  };
}
