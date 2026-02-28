import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  /** Request timeout in milliseconds. Default: 10_000 */
  timeout?: number;
}

// Global async token getter — shared across all createApiClient instances.
// Call setTokenGetter() from the auth provider after Keycloak initializes.
let _tokenGetter: (() => Promise<string | undefined>) | null = null;

// Global synchronous tenant getter — opt-in for multi-tenant apps.
// Call setTenantGetter() from the app initialization code.
let _tenantGetter: (() => string | undefined) | null = null;

export function setTokenGetter(getter: () => Promise<string | undefined>): void {
  _tokenGetter = getter;
}

export function setTenantGetter(getter: () => string | undefined): void {
  _tenantGetter = getter;
}

/**
 * Create a pre-configured Axios instance with Bearer token and optional
 * X-Tenant-Id request interceptors.
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
      if (_tenantGetter) {
        const tenantId = _tenantGetter();
        if (tenantId) {
          req.headers['X-Tenant-Id'] = tenantId;
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

/**
 * Create an orval-compatible mutator function from an existing Axios instance.
 *
 * The returned function matches the orval custom instance signature:
 * `<T>(config: AxiosRequestConfig, options?: AxiosRequestConfig) => Promise<T>`
 *
 * It reuses the instance's interceptors (token injection, tenant header, etc.).
 *
 * @example
 * ```typescript
 * // src/api/mutator.ts (in consuming app)
 * import { api } from '@/lib/api';
 * import { createMutator } from '@granit/api-client';
 *
 * export const customInstance = createMutator(api);
 * export default customInstance;
 * ```
 */
export function createMutator(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    return instance({ ...config, ...options }).then(({ data }) => data as T);
  };
}
