import type { AxiosInstance } from 'axios';

// --- Provider config ---

export interface TimelineConfig {
  apiClient: AxiosInstance;
  basePath: string;
}
