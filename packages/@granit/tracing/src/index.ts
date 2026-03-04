export { getTraceContext } from './trace-context.js';
export { TracingProvider, useTracer } from './providers/tracing-provider.js';
export { useSpan } from './hooks/use-span.js';

export type { TraceContext, TracingConfig, TracingExporterConfig, TracingProviderProps } from './types/index.js';
export type { UseSpanReturn } from './hooks/use-span.js';
