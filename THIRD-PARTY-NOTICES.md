# Avis relatifs aux composants tiers — granit-front

Ce fichier répertorie les bibliothèques tierces utilisées par le projet
**granit-front** ainsi que leurs licences respectives. Il est mis à jour
à chaque ajout ou modification de dépendance externe.

Dernière mise à jour : 2026-03-01

---

## Récapitulatif des licences

| Licence | Nombre de packages |
| ------- | ------------------ |
| MIT | 17 |
| Apache-2.0 | 2 |
| BSD-3-Clause | 1 |

---

## Dépendances (devDependencies — monorepo workspace)

> Le `package.json` racine ne déclare aucune `dependencies` de production.
> Toutes les dépendances sont en `devDependencies` et servent les packages
> workspace `@granit/*` via `peerDependencies`.

### MIT

| Package | Version | Copyright |
| ------- | ------- | --------- |
| @eslint/js | 10.0.1 | OpenJS Foundation |
| @testing-library/react | 16.3.2 | Copyright (c) Testing Library Contributors |
| @types/react | 19.2.14 | DefinitelyTyped Contributors |
| @vitest/coverage-v8 | 4.0.18 | Vitest Contributors |
| axios | 1.13.6 | Copyright (c) Matt Zabriskie |
| clsx | 2.1.1 | Copyright (c) Luke Edwards |
| date-fns | 4.1.0 | Copyright (c) Sasha Koss |
| eslint | 10.0.2 | OpenJS Foundation |
| eslint-plugin-import-x | 4.16.1 | eslint-plugin-import-x Contributors |
| i18next | 25.8.13 | Copyright (c) i18next Contributors |
| jsdom | 28.1.0 | Copyright (c) jsdom Contributors |
| react | 19.2.4 | Copyright (c) Meta Platforms, Inc. |
| react-dom | 19.2.4 | Copyright (c) Meta Platforms, Inc. |
| react-i18next | 16.5.4 | Copyright (c) i18next Contributors |
| tailwind-merge | 3.5.0 | Copyright (c) Dany Castillo |
| typescript-eslint | 8.56.1 | typescript-eslint Contributors |
| vitest | 4.0.18 | Vitest Contributors |

### Apache-2.0

| Package | Version | Copyright |
| ------- | ------- | --------- |
| keycloak-js | 26.2.3 | Copyright Red Hat, Inc. |
| typescript | 5.9.3 | Copyright (c) Microsoft Corporation |

### BSD-3-Clause

| Package | Version | Copyright |
| ------- | ------- | --------- |
| klaro | 0.7.x | Copyright (c) KIProtect GmbH, Berlin |

> `klaro` est une peerDependency de `@granit/cookies-klaro`, installée
> dans les applications consommatrices (guava-front).
