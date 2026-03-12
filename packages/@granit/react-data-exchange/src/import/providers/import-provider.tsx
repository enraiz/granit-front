import { createContext, useContext, useMemo } from 'react';

import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

/**
 * Configuration for the import provider.
 */
export interface ImportConfig {
  /** Axios instance used for API calls. */
  readonly client: AxiosInstance;
  /** Base path for import endpoints (e.g. `/api/v1/data-exchange`). */
  readonly basePath: string;
  /** Optional prefix for React Query keys. */
  readonly queryKeyPrefix?: readonly string[];
}

export interface ImportProviderProps {
  readonly config: ImportConfig;
  readonly children: ReactNode;
}

const ImportConfigContext = createContext<ImportConfig | null>(null);

/**
 * Provides import configuration to child components and hooks.
 */
export function ImportProvider({ config, children }: Readonly<ImportProviderProps>) {
  const value = useMemo(() => config, [config]);
  return <ImportConfigContext value={value}>{children}</ImportConfigContext>;
}

/**
 * Returns the import configuration from the nearest `ImportProvider`.
 * Throws if used outside a provider.
 */
export function useImportConfig(): ImportConfig {
  const ctx = useContext(ImportConfigContext);
  if (!ctx) {
    throw new Error('useImportConfig must be used within an ImportProvider');
  }
  return ctx;
}

/**
 * Builds a consistent React Query key for import operations.
 */
export function buildImportQueryKey(
  config: ImportConfig,
  ...segments: readonly string[]
): readonly unknown[] {
  const prefix = config.queryKeyPrefix ?? ['data-exchange', 'import'];
  return [...prefix, ...segments];
}
