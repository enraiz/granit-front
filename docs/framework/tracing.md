# @granit/tracing

Tracing distribué OpenTelemetry pour le navigateur : initialisation automatique,
instrumentations (fetch, XHR, document-load), export OTLP HTTP, et helpers pour
spans personnalisés.

## Architecture

```text
TracingProvider
  ├── WebTracerProvider + BatchSpanProcessor + OTLPTraceExporter
  ├── Auto-instrumentations (fetch, XHR, document-load)
  ├── ZoneContextManager (propagation du contexte async)
  └── React Context → useTracer() → useSpan()

getTraceContext() ── lit le span actif (global singleton, pas de dépendance React)
                     └── utilisable par @granit/logger-otlp pour corrélation log↔trace
```

## API

### `TracingProvider`

Composant React qui initialise le `WebTracerProvider` OpenTelemetry avec un
exporteur OTLP HTTP et les auto-instrumentations. Shutdown automatique au unmount.

```tsx
import { TracingProvider } from '@granit/tracing';

<TracingProvider config={{
  serviceName: 'guava-front',
  serviceVersion: '1.0.0',
  exporter: { url: '/v1/traces' },
  // Options d'instrumentation (tous true par défaut)
  instrumentFetch: true,
  instrumentXhr: true,
  instrumentDocumentLoad: true,
}}>
  <App />
</TracingProvider>
```

### `TracingConfig`

```typescript
type TracingConfig = {
  serviceName: string;
  serviceVersion?: string;
  exporter: {
    url: string;                          // ex : '/v1/traces'
    headers?: Record<string, string>;     // headers HTTP supplémentaires
  };
  instrumentFetch?: boolean;              // défaut : true
  instrumentXhr?: boolean;                // défaut : true
  instrumentDocumentLoad?: boolean;       // défaut : true
  additionalInstrumentations?: Instrumentation[];
};
```

### `useTracer(): Tracer`

Retourne l'instance OTel `Tracer` fournie par le `TracingProvider` le plus proche.
Lève une erreur si appelé hors du provider.

```typescript
import { useTracer } from '@granit/tracing';

const tracer = useTracer();
const span = tracer.startSpan('custom-operation');
```

### `useSpan(): UseSpanReturn`

Hook fournissant deux helpers pour créer des spans personnalisés.

```typescript
import { useSpan } from '@granit/tracing';

const { withSpan, createSpan } = useSpan();
```

#### `withSpan(name, fn)`

Exécute une fonction dans un nouveau span. Le span est automatiquement terminé
et les erreurs sont enregistrées.

```typescript
const result = await withSpan('save-invoice', async (span) => {
  span.setAttribute('invoice.id', invoiceId);
  return await api.post('/invoices', data);
});
```

#### `createSpan(name, options?)`

Crée un span manuellement pour un contrôle fin. **Vous devez appeler `span.end()`
vous-même.**

```typescript
const span = createSpan('long-operation');
try {
  // ...
} finally {
  span.end();
}
```

### `getTraceContext(): TraceContext | undefined`

Lit le span actif depuis le singleton global OpenTelemetry. **Pas de dépendance
React** — conçu pour être passé comme callback `getTraceContext` à
`@granit/logger-otlp`.

```typescript
import { createOtlpTransport } from '@granit/logger-otlp';
import { getTraceContext } from '@granit/tracing';

const transport = createOtlpTransport({
  endpoint: '/v1/logs',
  serviceName: 'guava-front',
  getTraceContext, // corrélation automatique log ↔ trace
});
```

## Intégration avec @granit/logger-otlp

La corrélation log-to-trace permet de naviguer d'un log à sa trace dans Grafana.
Il suffit de passer `getTraceContext` au transport OTLP :

```typescript
import { createLogger, createConsoleTransport } from '@granit/logger';
import { createOtlpTransport } from '@granit/logger-otlp';
import { getTraceContext } from '@granit/tracing';

const logger = createLogger('[Guava]', {
  transports: [
    createConsoleTransport(),
    createOtlpTransport({
      endpoint: '/v1/logs',
      serviceName: 'guava-front',
      getTraceContext,
    }),
  ],
});
```

Chaque log émis pendant un span actif contiendra automatiquement les champs
`traceId` et `spanId` dans ses attributs OTLP.

## Configuration Vite (développement)

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/v1/traces': {
        target: 'http://localhost:4318',
        changeOrigin: true,
      },
      '/v1/logs': {
        target: 'http://localhost:18889',
        changeOrigin: true,
      },
    },
  },
});
```

## Types exportés

| Export | Type | Description |
| --- | --- | --- |
| `TracingProvider` | `component` | Provider React d'initialisation OTel |
| `useTracer` | `hook` | Accès au `Tracer` OTel |
| `useSpan` | `hook` | Helpers `withSpan` et `createSpan` |
| `getTraceContext` | `function` | Lecture du span actif (non-React) |
| `TraceContext` | `type` | `{ traceId: string; spanId: string }` |
| `TracingConfig` | `type` | Configuration du provider |
| `TracingExporterConfig` | `type` | Configuration de l'exporteur OTLP |
| `TracingProviderProps` | `type` | Props du provider |
| `UseSpanReturn` | `type` | Retour du hook `useSpan` |

## Peer dependencies

| Dépendance | Version |
| --- | --- |
| `react` | `^19.0.0` |
| `@opentelemetry/api` | `^1.9.0` |
| `@opentelemetry/sdk-trace-web` | `^2.6.0` |
| `@opentelemetry/exporter-trace-otlp-http` | `^0.213.0` |
| `@opentelemetry/instrumentation-fetch` | `^0.213.0` |
| `@opentelemetry/instrumentation-xml-http-request` | `^0.213.0` |
| `@opentelemetry/instrumentation-document-load` | `^0.57.0` |
| `@opentelemetry/resources` | `^2.6.0` |
| `@opentelemetry/semantic-conventions` | `^1.40.0` |
| `@opentelemetry/context-zone` | `^2.6.0` |
