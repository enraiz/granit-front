import { createContext, useContext, useMemo } from 'react';

import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

/** Configuration for the settings provider. */
export interface SettingsConfig {
  readonly client: AxiosInstance;
  /** Base path prefix before `/settings/...` (default: empty string). */
  readonly basePath?: string;
  readonly queryKeyPrefix?: readonly string[];
}

export interface SettingsProviderProps {
  readonly config: SettingsConfig;
  readonly children: ReactNode;
}

const SettingsConfigContext = createContext<SettingsConfig | null>(null);

/** Provides settings configuration to child components and hooks. */
export function SettingsProvider({ config, children }: Readonly<SettingsProviderProps>) {
  const value = useMemo(() => config, [config]);
  return <SettingsConfigContext value={value}>{children}</SettingsConfigContext>;
}

/** Returns the settings configuration from the nearest `SettingsProvider`. */
export function useSettingsConfig(): SettingsConfig {
  const ctx = useContext(SettingsConfigContext);
  if (!ctx) {
    throw new Error('useSettingsConfig must be used within a SettingsProvider');
  }
  return ctx;
}

/** Builds a consistent React Query key for settings operations. */
export function buildSettingsQueryKey(
  config: SettingsConfig,
  ...segments: readonly string[]
): readonly unknown[] {
  const prefix = config.queryKeyPrefix ?? ['settings'];
  return [...prefix, ...segments];
}
