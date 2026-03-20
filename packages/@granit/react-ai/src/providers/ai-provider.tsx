// ---------------------------------------------------------------------------
// AI context provider — supplies Axios client and config to all AI hooks.
// ---------------------------------------------------------------------------

import { createContext, useContext, useMemo } from 'react';

import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

/** Configuration for the AI provider. */
export interface AIConfig {
  /** Axios client with auth and tenant interceptors. */
  readonly client: AxiosInstance;
  /** Route prefix before `/ai/...` (default: empty string). */
  readonly basePath?: string;
  /**
   * Base URL used for streaming endpoints (native fetch, not Axios).
   * Typically `window.location.origin` or `import.meta.env.VITE_API_URL`.
   */
  readonly streamBaseUrl?: string;
  /**
   * Returns the current Bearer token for streaming auth.
   * Streaming uses native `fetch` and cannot reuse Axios interceptors.
   */
  readonly tokenGetter?: () => Promise<string | null>;
  /** Current tenant ID to inject as `X-Tenant-Id` header in streams. */
  readonly tenantId?: string;
  /** Custom React Query key prefix (default: `['ai']`). */
  readonly queryKeyPrefix?: readonly string[];
}

export interface AIProviderProps {
  readonly config: AIConfig;
  readonly children: ReactNode;
}

const AIConfigContext = createContext<AIConfig | null>(null);

/** Provides AI configuration to child components and hooks. */
export function AIProvider({ config, children }: Readonly<AIProviderProps>) {
  const value = useMemo(() => config, [config]);
  return <AIConfigContext value={value}>{children}</AIConfigContext>;
}

/** Returns the AI configuration from the nearest `AIProvider`. */
export function useAIConfig(): AIConfig {
  const ctx = useContext(AIConfigContext);
  if (!ctx) {
    throw new Error('useAIConfig must be used within an AIProvider');
  }
  return ctx;
}

/** Builds a consistent React Query key for AI operations. */
export function buildAIQueryKey(
  config: AIConfig,
  ...segments: readonly string[]
): readonly unknown[] {
  const prefix = config.queryKeyPrefix ?? ['ai'];
  return [...prefix, ...segments];
}
