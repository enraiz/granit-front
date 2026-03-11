# Architecture Decision Records (ADR)

Registre des decisions architecturales pour le monorepo `granit-front`.

## Convention

Chaque ADR suit le format :

- **Statut** : Propose | Accepte | Deprecie | Remplace par ADR-NNN
- **Date** : date de la decision
- **Contexte** : pourquoi la decision etait necessaire
- **Decision** : ce qui a ete decide
- **Consequences** : impacts positifs et negatifs

## Index

| ADR                                      | Titre                                         | Statut                             | Date       |
| ---------------------------------------- | --------------------------------------------- | ---------------------------------- | ---------- |
| [ADR-001](001-source-direct.md)          | TypeScript source-direct (pas de build step)  | Accepte                            | 2026-02-27 |
| [ADR-002](002-pnpm-workspace.md)         | pnpm workspace monorepo                       | Accepte                            | 2026-02-27 |
| [ADR-003](003-react-19.md)               | React 19 comme version minimale               | Accepte                            | 2026-02-27 |
| [ADR-004](004-headless-packages.md)      | Packages headless (hooks-only)                | Accepte                            | 2026-03-06 |
| [ADR-005](005-keycloak.md)               | Keycloak comme provider d'authentification    | Accepte                            | 2026-02-27 |
| [ADR-006](006-tanstack-query.md)         | TanStack Query pour le data fetching          | Accepte                            | 2026-03-04 |
| [ADR-007](007-vitest.md)                 | Vitest comme runner de tests                  | Accepte                            | 2026-02-27 |
| [ADR-008](008-opentelemetry.md)          | OpenTelemetry pour le tracing distribue       | Accepte                            | 2026-03-04 |
| ~~ADR-009~~                              | ~~SignalR pour les notifications temps reel~~ | Déplacé vers guava-front (ADR-001) | 2026-03-02 |
| [ADR-010](010-pagination-centralisee.md) | Pagination centralisee dans @granit/querying  | Accepte                            | 2026-03-08 |
