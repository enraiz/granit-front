import { setIdempotencyKeyGenerator } from '@granit/api-client';

import type { InternalAxiosRequestConfig } from 'axios';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface IdempotencyOptions {
  /**
   * HTTP methods that receive an `Idempotency-Key` header.
   * Default: `['post', 'put', 'patch', 'delete']`.
   */
  methods?: string[];

  /**
   * Name of the HTTP header. Default: `'Idempotency-Key'`.
   * Must match the backend `IdempotencyOptions.HeaderName`.
   */
  headerName?: string;

  /**
   * Custom key generator. Receives the Axios request config and returns
   * the idempotency key string, or `undefined` to skip the header.
   *
   * Default: UUID v4 via `crypto.randomUUID()`.
   */
  keyGenerator?: (config: InternalAxiosRequestConfig) => string | undefined;
}

const DEFAULT_METHODS = ['post', 'put', 'patch', 'delete'];

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Enable idempotency key injection on the shared `@granit/api-client` instance.
 *
 * Call once during app initialization (e.g. in `main.ts` or the root component).
 * All subsequent mutation requests will automatically include an `Idempotency-Key` header.
 *
 * @example
 * ```typescript
 * // src/main.ts
 * import { enableIdempotency } from '@granit/idempotency';
 *
 * enableIdempotency();
 * ```
 *
 * @example
 * ```typescript
 * // Custom key generator (e.g. form-based deduplication)
 * enableIdempotency({
 *   keyGenerator: (config) => {
 *     // Use a stable key derived from the request body for retries
 *     return config.data?.idempotencyKey ?? crypto.randomUUID();
 *   },
 * });
 * ```
 */
export function enableIdempotency(options?: IdempotencyOptions): void {
  const methods = new Set((options?.methods ?? DEFAULT_METHODS).map((m) => m.toLowerCase()));
  const generate = options?.keyGenerator ?? defaultKeyGenerator;

  setIdempotencyKeyGenerator((config: InternalAxiosRequestConfig) => {
    const method = config.method?.toLowerCase();
    if (!method || !methods.has(method)) {
      return undefined;
    }
    return generate(config);
  });
}

/**
 * Disable idempotency key injection.
 * Useful for testing or conditional feature flags.
 */
export function disableIdempotency(): void {
  setIdempotencyKeyGenerator(() => undefined);
}

// ---------------------------------------------------------------------------
// Default key generator
// ---------------------------------------------------------------------------

function defaultKeyGenerator(_config: InternalAxiosRequestConfig): string {
  return crypto.randomUUID();
}
