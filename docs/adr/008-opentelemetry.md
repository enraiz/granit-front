# ADR-008 — OpenTelemetry pour le tracing distribue

- **Statut** : Accepte
- **Date** : 2026-03-04

## Contexte

La plateforme Guava necessite du tracing distribue pour :

- Suivre les requetes de bout en bout (frontend → backend .NET → base de donnees)
- Diagnostiquer les problemes de performance
- Correler les logs frontend avec les traces backend
- Alimenter un backend d'observabilite (Jaeger, Grafana Tempo, etc.)

Les alternatives evaluees :

- **Solution proprietaire** (Datadog, New Relic) : lock-in commercial,
  hebergement US incompatible HDS, cout eleve
- **OpenTelemetry** : standard ouvert (CNCF), vendor-agnostic, SDK web
  disponible, compatible avec tout backend OTLP

## Decision

Utiliser **OpenTelemetry** via le package `@granit/tracing` qui encapsule :

- `WebTracerProvider` pour l'initialisation du SDK
- `OTLPTraceExporter` (HTTP) pour l'envoi des traces
- Auto-instrumentations : `fetch`, `XMLHttpRequest`, `document-load`
- `TracingProvider` (React context) pour l'activation dans l'arbre de composants
- `useTracer` et `useSpan` pour les spans custom
- `getTraceContext` pour l'integration non-React (ex: `@granit/logger-otlp`)

Le package `@granit/logger-otlp` etend `@granit/logger` pour injecter les
trace IDs dans les logs, permettant la correlation logs/traces.

Toutes les dependances OpenTelemetry sont declarees en `peerDependencies` :

```json
{
  "peerDependencies": {
    "@opentelemetry/api": "^1.9.0",
    "@opentelemetry/sdk-trace-web": "^2.6.0",
    "@opentelemetry/exporter-trace-otlp-http": "^0.213.0",
    "@opentelemetry/instrumentation-fetch": "^0.213.0",
    "@opentelemetry/instrumentation-xml-http-request": "^0.213.0",
    "@opentelemetry/instrumentation-document-load": "^0.57.0",
    "@opentelemetry/resources": "^2.6.0",
    "@opentelemetry/semantic-conventions": "^1.40.0",
    "@opentelemetry/context-zone": "^2.6.0"
  }
}
```

## Consequences

### Positives

- **Standard ouvert** : pas de lock-in, compatible avec Jaeger, Grafana Tempo,
  Zipkin, etc.
- **Vendor-agnostic** : le backend d'observabilite peut etre change sans
  modifier le code frontend
- **Correlation** : les trace IDs propagent automatiquement le contexte entre
  frontend et backend
- **Auto-instrumentation** : les requetes HTTP (fetch, XHR) et le chargement
  de page sont traces automatiquement
- **Conformite HDS** : le collecteur OTLP peut etre auto-heberge

### Negatives

- **Nombre de peer dependencies** : 9 packages OpenTelemetry, ce qui alourdit
  la configuration dans les applications consommatrices
- **SDK web immature** : le SDK web OpenTelemetry est moins mature que les SDK
  backend (Node.js, .NET)
- **Performance** : l'instrumentation ajoute un leger overhead aux requetes
  HTTP (mitige par la degradation gracieuse quand le collecteur est absent)
