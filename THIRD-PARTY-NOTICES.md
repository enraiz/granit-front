# Avis relatifs aux composants tiers — granit-front

Ce fichier répertorie les bibliothèques tierces utilisées par le projet
**granit-front** ainsi que leurs licences respectives. Il est mis à jour
à chaque ajout ou modification de dépendance externe.

Dernière mise à jour : 2026-03-06

---

## Récapitulatif des licences

| Licence      | Nombre de packages |
| ------------ | ------------------ |
| MIT          | 32                 |
| Apache-2.0   | 13                 |
| ISC          | 1                  |
| BSD-3-Clause | 1                  |

---

## Dépendances (devDependencies — monorepo workspace)

> Le `package.json` racine ne déclare aucune `dependencies` de production.
> Toutes les dépendances sont en `devDependencies` et servent les packages
> workspace `@granit/*` via `peerDependencies`.

### MIT

| Package                         | Version | Copyright                                  |
| ------------------------------- | ------- | ------------------------------------------ |
| @tailwindcss/vite               | 4.2.1   | Copyright (c) Tailwind Labs, Inc.          |
| @tanstack/react-query           | 5.90.21 | Copyright (c) Tanner Linsley               |
| @tanstack/react-table           | 8.21.3  | Copyright (c) Tanner Linsley               |
| @tanstack/react-virtual         | 3.13.0  | Copyright (c) Tanner Linsley               |
| @eslint/js                      | 10.0.1  | OpenJS Foundation                          |
| @microsoft/signalr              | 10.0.0  | Copyright (c) .NET Foundation              |
| @testing-library/jest-dom       | 6.9.1   | Copyright (c) Testing Library Contributors |
| @testing-library/react          | 16.3.2  | Copyright (c) Testing Library Contributors |
| @testing-library/user-event     | 14.6.1  | Copyright (c) Testing Library Contributors |
| @types/react                    | 19.2.14 | DefinitelyTyped Contributors               |
| @vitest/coverage-v8             | 4.0.18  | Vitest Contributors                        |
| axios                           | 1.13.6  | Copyright (c) Matt Zabriskie               |
| cmdk                            | 1.1.1   | Copyright (c) Paco Coursey                 |
| clsx                            | 2.1.1   | Copyright (c) Luke Edwards                 |
| date-fns                        | 4.1.0   | Copyright (c) Sasha Koss                   |
| eslint                          | 10.0.2  | OpenJS Foundation                          |
| eslint-plugin-import-x          | 4.16.1  | eslint-plugin-import-x Contributors        |
| husky                           | 9.1.7   | Copyright (c) typicode                     |
| i18next                         | 25.8.14 | Copyright (c) i18next Contributors         |
| jsdom                           | 28.1.0  | Copyright (c) jsdom Contributors           |
| lint-staged                     | 16.3.2  | Copyright (c) Andrey Okonetchnikov         |
| markdownlint-cli2               | 0.21.0  | Copyright (c) David Anson                  |
| prettier                        | 3.8.1   | Copyright (c) James Long                   |
| react                           | 19.2.4  | Copyright (c) Meta Platforms, Inc.         |
| react-dom                       | 19.2.4  | Copyright (c) Meta Platforms, Inc.         |
| react-i18next                   | 16.5.4  | Copyright (c) i18next Contributors         |
| tailwind-merge                  | 3.5.0   | Copyright (c) Dany Castillo                |
| tsup                            | 8.5.1   | Copyright (c) EGOIST                       |
| typescript-eslint               | 8.56.1  | typescript-eslint Contributors             |
| react-hook-form                 | 7.71.1  | Copyright (c) react-hook-form Contributors |
| @commitlint/cli                 | 20.4.3  | commitlint Contributors                    |
| @commitlint/config-conventional | 20.4.3  | commitlint Contributors                    |
| vitest                          | 4.0.18  | Vitest Contributors                        |

### Apache-2.0

| Package                                         | Version | Copyright                           |
| ----------------------------------------------- | ------- | ----------------------------------- |
| @opentelemetry/api                              | 1.9.0   | Copyright The OpenTelemetry Authors |
| @opentelemetry/context-zone                     | 2.6.0   | Copyright The OpenTelemetry Authors |
| @opentelemetry/exporter-trace-otlp-http         | 0.213.0 | Copyright The OpenTelemetry Authors |
| @opentelemetry/instrumentation                  | 0.213.0 | Copyright The OpenTelemetry Authors |
| @opentelemetry/instrumentation-document-load    | 0.57.0  | Copyright The OpenTelemetry Authors |
| @opentelemetry/instrumentation-fetch            | 0.213.0 | Copyright The OpenTelemetry Authors |
| @opentelemetry/instrumentation-xml-http-request | 0.213.0 | Copyright The OpenTelemetry Authors |
| @opentelemetry/resources                        | 2.6.0   | Copyright The OpenTelemetry Authors |
| @opentelemetry/sdk-trace-web                    | 2.6.0   | Copyright The OpenTelemetry Authors |
| @opentelemetry/semantic-conventions             | 1.40.0  | Copyright The OpenTelemetry Authors |
| keycloak-js                                     | 26.2.3  | Copyright Red Hat, Inc.             |
| tailwindcss                                     | 4.2.1   | Copyright (c) Tailwind Labs, Inc.   |
| typescript                                      | 5.9.3   | Copyright (c) Microsoft Corporation |

### ISC

| Package      | Version | Copyright                         |
| ------------ | ------- | --------------------------------- |
| lucide-react | 0.577.0 | Copyright (c) Lucide Contributors |

### BSD-3-Clause

| Package | Version | Copyright                            |
| ------- | ------- | ------------------------------------ |
| klaro   | 0.7.x   | Copyright (c) KIProtect GmbH, Berlin |

> `klaro` est une peerDependency de `@granit/cookies-klaro`, installée
> dans les applications consommatrices (guava-front).
