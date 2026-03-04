import type { AxiosInstance } from 'axios';

/** Configuration for the workflow provider context. */
export interface WorkflowConfig {
  readonly apiClient: AxiosInstance;
  readonly basePath: string;
}
