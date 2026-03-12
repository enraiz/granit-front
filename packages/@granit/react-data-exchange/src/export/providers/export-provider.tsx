import { createContext, useContext, useMemo } from 'react';

import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

/**
 * Configuration for the export provider.
 */
export interface ExportConfig {
  /** Axios instance used for API calls. */
  readonly client: AxiosInstance;
  /** Base path for export metadata endpoints (e.g. `/api/v1/data-exchange/metadata`). */
  readonly basePath: string;
  /** Optional prefix for React Query keys. */
  readonly queryKeyPrefix?: readonly string[];
}

export interface ExportProviderProps {
  readonly config: ExportConfig;
  readonly children: ReactNode;
}

const ExportConfigContext = createContext<ExportConfig | null>(null);

/**
 * Provides export configuration to child components and hooks.
 */
export function ExportProvider({ config, children }: Readonly<ExportProviderProps>) {
  const value = useMemo(() => config, [config]);
  return <ExportConfigContext value={value}>{children}</ExportConfigContext>;
}

/**
 * Returns the export configuration from the nearest `ExportProvider`.
 * Throws if used outside a provider.
 */
export function useExportConfig(): ExportConfig {
  const ctx = useContext(ExportConfigContext);
  if (!ctx) {
    throw new Error('useExportConfig must be used within an ExportProvider');
  }
  return ctx;
}

/**
 * Builds a consistent React Query key for export operations.
 */
export function buildExportQueryKey(
  config: ExportConfig,
  ...segments: readonly string[]
): readonly unknown[] {
  const prefix = config.queryKeyPrefix ?? ['data-exchange', 'metadata'];
  return [...prefix, ...segments];
}
