export { createMockClient, axiosResponse } from '@granit/api-client/test-utils';

import { NotificationProvider } from '../providers/notification-provider.js';

import type { NotificationConfig } from '../types/index.js';
import type { AxiosInstance } from 'axios';

export function createWrapper(client: AxiosInstance, basePath = '/api') {
  return function Wrapper({ children }: Readonly<{ children: React.ReactNode }>) {
    const config: NotificationConfig = {
      apiClient: client,
      basePath,
    };
    return <NotificationProvider {...config}>{children}</NotificationProvider>;
  };
}
