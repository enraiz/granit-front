import type { TracingConfig } from '@granit/tracing';

/** Props for the `TracingProvider` component. */
export type TracingProviderProps = {
  config: TracingConfig;
  children: React.ReactNode;
};
