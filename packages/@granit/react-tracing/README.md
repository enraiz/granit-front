# @granit/react-tracing

React bindings for `@granit/tracing` -- TracingProvider, useTracer, useSpan.

## Installation

```bash
pnpm add @granit/react-tracing
```

## API

### Components

- `TracingProvider` -- initializes OpenTelemetry WebTracerProvider with OTLP exporter and auto-instrumentations

### Hooks

- `useTracer()` -- access the OpenTelemetry tracer instance
- `useSpan(name, options?)` -- create and manage a custom span

### Types

- `TracingProviderProps` -- props for `TracingProvider`
- `UseSpanReturn` -- return type of `useSpan`

## Usage

```tsx
import { TracingProvider, useSpan } from '@granit/react-tracing';

function App() {
  return (
    <TracingProvider serviceName="my-app" collectorUrl="https://otel.example.com/v1/traces">
      <MyApp />
    </TracingProvider>
  );
}

function MyApp() {
  const { startSpan, endSpan } = useSpan('page-load');

  return <div>Traced application</div>;
}
```

## License

Apache-2.0
