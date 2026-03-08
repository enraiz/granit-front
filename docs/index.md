<p align="center">
  <img src="images/granit-logo.svg" alt="granit" width="160" />
</p>

# granit-front

Framework TypeScript/React partagé pour les applications front-end Digital Dynamics.

Granit-front fournit les briques communes à toutes les applications front-end :
logger, utilitaires, client HTTP, authentification, notifications temps réel,
flux d'activité, workflow, grille de données, import/export, tracing et gestion d'erreurs.

Équivalent JavaScript/TypeScript de [`granit-dotnet`](https://gitlab.digitaldynamics.be/digital-dynamics/granit-dotnet).

## Stack technique

TypeScript 5 (strict) · React 19 · Vitest 4 · ESLint 9 · pnpm workspace · Node 24

## Packages

### Fondations

| Package                                             | Rôle                                                                                                  |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [`@granit/logger`](framework/logger.md)             | Factory de loggers configurables (`createLogger`)                                                     |
| [`@granit/logger-otlp`](framework/logger.md)        | Transport OTLP pour le logger (corrélation trace-log)                                                 |
| [`@granit/utils`](framework/utils.md)               | Utilitaires partagés (`cn`, `formatDate`, `formatNumber`, …)                                          |
| [`@granit/api-client`](framework/api-client.md)     | Factory Axios, intercepteur Bearer, classes d'erreur (`HttpError`, `ValidationError`, `TimeoutError`) |
| [`@granit/auth`](framework/auth.md)                 | Hooks Keycloak, factory de contexte auth, permissions (RBAC)                                          |
| [`@granit/storage`](framework/storage.md)           | Abstraction `localStorage`/`sessionStorage` avec préfixe et accesseurs typés                          |
| [`@granit/localization`](framework/localization.md) | Résolution de locale, chargement de traductions i18next                                               |

### Modules métier (headless)

| Package                                               | Rôle                                                                                |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------- |
| [`@granit/querying`](framework/querying.md)           | Grille de données Odoo-like : filtres, tri, pagination, group-by, vues sauvegardées |
| [`@granit/timeline`](framework/timeline.md)           | Flux d'activité : commentaires, notes, threading, @mentions, follow/unfollow        |
| [`@granit/workflow`](framework/workflow.md)           | Cycle de vie : statut, transitions, historique d'audit                              |
| [`@granit/notifications`](framework/notifications.md) | Notifications temps réel (SignalR), boîte de réception, fil d'activité, préférences |
| [`@granit/data-exchange`](framework/data-exchange.md) | Import/export tabulaire : définitions, presets, mapping, rapports                   |

### Transversal

| Package                                                 | Rôle                                                                    |
| ------------------------------------------------------- | ----------------------------------------------------------------------- |
| [`@granit/cookies`](framework/cookies.md)               | Abstraction du consentement cookies (provider-agnostic)                 |
| [`@granit/cookies-klaro`](framework/cookies-klaro.md)   | Adaptateur Klaro CMP pour `@granit/cookies`                             |
| [`@granit/tracing`](framework/tracing.md)               | Tracing distribué OpenTelemetry (provider, spans, corrélation)          |
| [`@granit/error-boundary`](framework/error-boundary.md) | Capture structurée des erreurs : boundary, capture globale, breadcrumbs |

## Documentation

| Section                                 | Description                                                 |
| --------------------------------------- | ----------------------------------------------------------- |
| [Framework](framework/index.md)         | Documentation de référence de chaque module                 |
| [Guide](guide/index.md)                 | Tutoriels pas-à-pas, démarrage rapide, architecture         |
| [Tests](testing/index.md)               | Conventions, stack Vitest, patterns de mock, couverture     |
| [CI/CD et qualité](deployment/index.md) | Pipeline GitLab CI, analyse de qualité, workflow de release |
| [Patterns](patterns/index.md)           | 8 design patterns identifiés dans granit-front              |
| [ADR](adr/index.md)                     | Architecture Decision Records                               |
| [Dépannage](troubleshooting.md)         | Problèmes courants et solutions                             |

## Démarrage rapide

```bash
# Lint (0 warnings max)
pnpm lint

# TypeScript check (tous les packages)
pnpm tsc

# Tests — mode watch
pnpm test

# Couverture — v8 (lcov + html)
pnpm test:coverage
```

## Applications consommatrices

| Application   | Dépôt                                     |
| ------------- | ----------------------------------------- |
| `guava-front` | `guava-platform/applications/guava-front` |
| `guava-admin` | `guava-platform/applications/guava-admin` |
