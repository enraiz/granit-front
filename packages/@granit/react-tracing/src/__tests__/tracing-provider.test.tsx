import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { TracingProvider, useTracer } from '../providers/tracing-provider.js';

import type { TracingConfig } from '@granit/tracing';

// ---------------------------------------------------------------------------
// Mock OpenTelemetry
// ---------------------------------------------------------------------------

const { mockTracer, mockShutdown, mockRegister } = vi.hoisted(() => ({
  mockTracer: { startSpan: vi.fn() },
  mockShutdown: vi.fn().mockResolvedValue(undefined),
  mockRegister: vi.fn(),
}));

vi.mock('@opentelemetry/api', () => ({
  trace: {
    getTracer: vi.fn(() => mockTracer),
    getTracerProvider: vi.fn(() => ({ shutdown: mockShutdown })),
    setSpan: vi.fn(),
    getSpan: vi.fn(),
  },
  context: { active: vi.fn() },
  SpanStatusCode: { OK: 1, ERROR: 2 },
}));

vi.mock('@opentelemetry/sdk-trace-web', () => {
  class MockWebTracerProvider {
    register = mockRegister;
  }
  return { WebTracerProvider: MockWebTracerProvider, BatchSpanProcessor: class {} };
});

vi.mock('@opentelemetry/exporter-trace-otlp-http', () => ({
  OTLPTraceExporter: class {},
}));

vi.mock('@opentelemetry/resources', () => ({
  resourceFromAttributes: vi.fn((attrs: Record<string, string>) => attrs),
}));

vi.mock('@opentelemetry/semantic-conventions', () => ({
  ATTR_SERVICE_NAME: 'service.name',
  ATTR_SERVICE_VERSION: 'service.version',
}));

vi.mock('@opentelemetry/context-zone', () => ({
  ZoneContextManager: class {},
}));

vi.mock('@opentelemetry/instrumentation-fetch', () => ({
  FetchInstrumentation: class {
    enable = vi.fn();
  },
}));

vi.mock('@opentelemetry/instrumentation-xml-http-request', () => ({
  XMLHttpRequestInstrumentation: class {
    enable = vi.fn();
  },
}));

vi.mock('@opentelemetry/instrumentation-document-load', () => ({
  DocumentLoadInstrumentation: class {
    enable = vi.fn();
  },
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DEFAULT_CONFIG: TracingConfig = {
  serviceName: 'test-app',
  exporter: { url: '/v1/traces' },
};

function createWrapper(config: TracingConfig = DEFAULT_CONFIG) {
  return ({ children }: { children: React.ReactNode }) => (
    <TracingProvider config={config}>{children}</TracingProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('TracingProvider', () => {
  it('should provide a tracer via useTracer()', () => {
    const { result } = renderHook(() => useTracer(), {
      wrapper: createWrapper(),
    });

    expect(result.current).toBe(mockTracer);
  });

  it('should register the WebTracerProvider', () => {
    renderHook(() => useTracer(), { wrapper: createWrapper() });

    expect(mockRegister).toHaveBeenCalled();
  });

  it('should call shutdown on unmount', () => {
    const { unmount } = renderHook(() => useTracer(), {
      wrapper: createWrapper(),
    });

    unmount();

    expect(mockShutdown).toHaveBeenCalled();
  });
});

describe('useTracer', () => {
  it('should throw when used outside TracingProvider', () => {
    expect(() => renderHook(() => useTracer())).toThrowError(
      'useTracer must be used within a TracingProvider'
    );
  });
});
