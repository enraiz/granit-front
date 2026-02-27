import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  /** Request timeout in milliseconds. Default: 10_000 */
  timeout?: number;
}

// Global async token getter — shared across all createApiClient instances.
// Call setTokenGetter() from the auth provider after Keycloak initializes.
let _tokenGetter: (() => Promise<string | undefined>) | null = null;

export function setTokenGetter(getter: () => Promise<string | undefined>): void {
  _tokenGetter = getter;
}

/**
 * Create a pre-configured Axios instance with a Bearer token request interceptor.
 *
 * 401/403 response handling is intentionally left to the consuming app — add your own
 * `api.interceptors.response.use(...)` after calling this factory.
 */
export function createApiClient(config: ApiClientConfig): AxiosInstance {
  const instance = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout ?? 10_000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    async (req: InternalAxiosRequestConfig) => {
      if (_tokenGetter) {
        const token = await _tokenGetter();
        if (token) {
          req.headers.Authorization = `Bearer ${token}`;
        }
      }
      return req;
    },
    /* v8 ignore next 3 */
    (error: unknown) => {
      throw error;
    }
  );

  return instance;
}
