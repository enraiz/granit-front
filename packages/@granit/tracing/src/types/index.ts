import type { Instrumentation } from '@opentelemetry/instrumentation';

// ---------------------------------------------------------------------------
// Trace context (shared with @granit/logger-otlp)
// ---------------------------------------------------------------------------

/** W3C Trace Context identifiers extracted from the active span. */
export type TraceContext = {
  traceId: string;
  spanId: string;
};

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

/** Configuration for the OTLP trace exporter. */
export type TracingExporterConfig = {
  /** OTLP HTTP endpoint URL (e.g. `/v1/traces`). */
  url: string;
  /** Optional HTTP headers to attach to export requests. */
  headers?: Record<string, string>;
};

/** Full tracing configuration passed to `TracingProvider`. */
export type TracingConfig = {
  /** Application/service name reported in traces. */
  serviceName: string;
  /** Application version reported in traces. */
  serviceVersion?: string;
  /** OTLP exporter configuration. */
  exporter: TracingExporterConfig;
  /** Whether to instrument `fetch()` calls. Default: `true`. */
  instrumentFetch?: boolean;
  /** Whether to instrument `XMLHttpRequest` calls. Default: `true`. */
  instrumentXhr?: boolean;
  /** Whether to instrument document load timing. Default: `true`. */
  instrumentDocumentLoad?: boolean;
  /** Additional OTel instrumentations to register. */
  additionalInstrumentations?: Instrumentation[];
};
