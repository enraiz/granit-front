import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type InternalAxiosRequestConfig,
} from 'axios';

export interface ApiClientConfig {
  baseURL: string;
  /** Request timeout in milliseconds. Default: 10_000 */
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Generic response types (REST APIs)
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// RFC 7807 Problem Details — standard error format from Granit .NET backend.
// See: Granit.ExceptionHandling (400 BusinessException, 404 NotFoundException,
// 403 ForbiddenException, 409 ConflictException, 422 ValidationException, 500).
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  /** OpenTelemetry trace ID for correlation in Grafana/Loki/Tempo */
  traceId?: string;
  /** Domain error code (e.g. "Appointment:SlotUnavailable") from IHasErrorCode */
  errorCode?: string;
}

// Global async token getter — shared across all createApiClient instances.
// Call setTokenGetter() from the auth provider after Keycloak initializes.
let _tokenGetter: (() => Promise<string | undefined>) | null = null;

// Global synchronous tenant getter — opt-in for multi-tenant apps.
// Call setTenantGetter() from the app initialization code.
let _tenantGetter: (() => string | undefined) | null = null;

// Global callback invoked on any 401 response — wired by @granit/auth to force logout.
let _onUnauthorized: (() => void) | null = null;

export function setTokenGetter(getter: () => Promise<string | undefined>): void {
  _tokenGetter = getter;
}

export function setTenantGetter(getter: () => string | undefined): void {
  _tenantGetter = getter;
}

/**
 * Register a callback invoked on any HTTP 401 response.
 *
 * Typically wired by `@granit/auth` to force a Keycloak logout when the
 * backend rejects a token (e.g. session revoked via back-channel logout).
 */
export function setOnUnauthorized(callback: () => void): void {
  _onUnauthorized = callback;
}

/**
 * Create a pre-configured Axios instance with Bearer token injection,
 * optional X-Tenant-Id header, and a 401 response interceptor that
 * triggers the `onUnauthorized` callback (if registered via {@link setOnUnauthorized}).
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

  instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response?.status === 401 && _onUnauthorized) {
        _onUnauthorized();
      }
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

// ---------------------------------------------------------------------------
// Domain error classes
// ---------------------------------------------------------------------------

export { HttpError, TimeoutError, ValidationError } from './errors.js';
export type { ProblemDetailsPayload, ValidationDetails } from './errors.js';
