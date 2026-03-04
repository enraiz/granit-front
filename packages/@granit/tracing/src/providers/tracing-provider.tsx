import { type Tracer, trace } from '@opentelemetry/api';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { BatchSpanProcessor, WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION } from '@opentelemetry/semantic-conventions';
import * as React from 'react';

import type { TracingProviderProps } from '../types/index.js';
import type { Instrumentation } from '@opentelemetry/instrumentation';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const TracerContext = React.createContext<Tracer | null>(null);

/**
 * Returns the OTel `Tracer` instance provided by the nearest `TracingProvider`.
 *
 * @throws If called outside a `TracingProvider`.
 */
export function useTracer(): Tracer {
  const tracer = React.useContext(TracerContext);
  if (!tracer) {
    throw new Error('useTracer must be used within a TracingProvider');
  }
  return tracer;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

/**
 * Initialises the OpenTelemetry `WebTracerProvider` with auto-instrumentations
 * (fetch, XHR, document-load) and an OTLP HTTP exporter.
 *
 * Provides a `Tracer` via React context (accessible with `useTracer()`).
 * Shuts down the provider on unmount to flush pending spans.
 *
 * @example
 * ```tsx
 * <TracingProvider config={{
 *   serviceName: 'guava-front',
 *   exporter: { url: '/v1/traces' },
 * }}>
 *   <App />
 * </TracingProvider>
 * ```
 */
export function TracingProvider({ config, children }: Readonly<TracingProviderProps>) {
  const tracerRef = React.useRef<Tracer | null>(null);

  if (!tracerRef.current) {
    const {
      serviceName,
      serviceVersion,
      exporter: exporterConfig,
      instrumentFetch = true,
      instrumentXhr = true,
      instrumentDocumentLoad = true,
      additionalInstrumentations = [],
    } = config;

    // --- Resource ---
    const attributes: Record<string, string> = {
      [ATTR_SERVICE_NAME]: serviceName,
    };
    if (serviceVersion) {
      attributes[ATTR_SERVICE_VERSION] = serviceVersion;
    }
    const resource = resourceFromAttributes(attributes);

    // --- Exporter & Processor ---
    const otlpExporter = new OTLPTraceExporter({
      url: exporterConfig.url,
      headers: exporterConfig.headers,
    });
    const spanProcessor = new BatchSpanProcessor(otlpExporter);

    // --- Instrumentations ---
    const instrumentations: Instrumentation[] = [
      ...additionalInstrumentations,
    ];
    if (instrumentFetch) {
      instrumentations.push(new FetchInstrumentation());
    }
    if (instrumentXhr) {
      instrumentations.push(new XMLHttpRequestInstrumentation());
    }
    if (instrumentDocumentLoad) {
      instrumentations.push(new DocumentLoadInstrumentation());
    }

    // --- Provider ---
    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [spanProcessor],
    });
    provider.register({
      contextManager: new ZoneContextManager(),
    });

    // Register instrumentations
    for (const instrumentation of instrumentations) {
      if ('enable' in instrumentation && typeof instrumentation.enable === 'function') {
        instrumentation.enable();
      }
    }

    tracerRef.current = trace.getTracer(serviceName, serviceVersion);
  }

  React.useEffect(() => {
    return () => {
      const activeProvider = trace.getTracerProvider();
      if ('shutdown' in activeProvider && typeof activeProvider.shutdown === 'function') {
        (activeProvider as { shutdown: () => Promise<void> }).shutdown();
      }
    };
  }, []);

  return (
    <TracerContext.Provider value={tracerRef.current}>
      {children}
    </TracerContext.Provider>
  );
}
