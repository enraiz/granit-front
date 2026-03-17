import { axiosResponse, createMockClient } from '@granit/testing';

import { TimelineProvider } from '../providers/timeline-provider.js';

import type { AxiosInstance } from 'axios';

export { createMockClient, axiosResponse };

export function createWrapper(client: AxiosInstance, basePath = '/api/v1/timeline') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
      <TimelineProvider apiClient={client} basePath={basePath}>
        {children}
      </TimelineProvider>
    );
  };
}
