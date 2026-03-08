# Contribuer à granit-front

Guide de contribution pour le framework TypeScript/React partagé Digital Dynamics.

## Prérequis

| Outil   | Version minimale |
| ------- | ---------------- |
| Node.js | 24               |
| pnpm    | 10               |
| Git     | 2.40+            |

> **pnpm uniquement** — ne jamais utiliser npm ou yarn.

## Installation

```bash
git clone git@gitlab.digitaldynamics.be:digital-dynamics/granit-front.git
cd granit-front
pnpm install
```

## Commandes

```bash
# Lint — ESLint strict (0 warnings max)
pnpm lint

# Vérification TypeScript — tous les packages
pnpm tsc

# Tests — mode watch (développement)
pnpm test

# Tests — exécution unique avec couverture (v8, lcov + html)
pnpm test:coverage

# Formatage — Prettier
pnpm format

# Cibler un package spécifique
pnpm --filter @granit/utils lint
pnpm --filter @granit/auth test
```

## Conventions de commit

Les commits suivent la spécification
[Conventional Commits](https://www.conventionalcommits.org/fr/) et sont
validés par [commitlint](https://commitlint.js.org/).

### Format

```text
<type>(<scope>): <description>
```

### Types autorisés

| Type       | Usage                                   |
| ---------- | --------------------------------------- |
| `feat`     | Nouvelle fonctionnalité                 |
| `fix`      | Correction de bug                       |
| `docs`     | Documentation uniquement                |
| `chore`    | Maintenance, dépendances, CI            |
| `refactor` | Refactoring sans changement fonctionnel |
| `test`     | Ajout ou modification de tests          |
| `perf`     | Amélioration de performance             |

### Exemples

```text
feat(querying): ajouter le support des filtres enum
fix(auth): corriger le rafraîchissement du token expiré
docs: mettre à jour le guide de démarrage rapide
chore(deps): mettre à jour pnpm-lock.yaml
refactor(api-client): extraire la logique d'intercepteur
test(notifications): améliorer la couverture ≥80%
```

## Workflow Git

Le projet suit le modèle **GitFlow** :

```text
main ─────────────────────────────── versions stables (tags vX.Y.Z)
  │
  └── develop ────────────────────── intégration continue
        │
        ├── feature/ma-feature ──── nouvelles fonctionnalités
        ├── fix/mon-fix ──────────── corrections
        ├── release/vX.Y.Z ──────── préparation de release
        └── hotfix/vX.Y.Z ───────── correctifs urgents
```

### Branches

| Type de branche | Base      | Cible MR           | Nommage                  |
| --------------- | --------- | ------------------ | ------------------------ |
| `feature/*`     | `develop` | `develop`          | `feature/nom-descriptif` |
| `fix/*`         | `develop` | `develop`          | `fix/nom-descriptif`     |
| `release/*`     | `develop` | `main` + `develop` | `release/vX.Y.Z`         |
| `hotfix/*`      | `main`    | `main` + `develop` | `hotfix/vX.Y.Z`          |

> **Le push direct sur `main` est interdit.**

### Merge Requests

- 1 approbation minimum pour `main`
- Titre en Conventional Commits
- Description claire du changement et de son impact

## Structure des packages

Chaque package `@granit/*` suit cette structure :

```text
packages/@granit/mon-package/
├── package.json          ← exports: { ".": "./src/index.ts" }
├── tsconfig.json
└── src/
    ├── index.ts          ← point d'entrée unique (re-exports)
    ├── types/            ← types et interfaces exportés
    ├── api/              ← fonctions d'appel API
    ├── hooks/            ← hooks React
    ├── providers/        ← contextes et providers React
    └── __tests__/        ← tests co-localisés
        ├── hook-a.test.ts
        └── hook-b.test.tsx
```

### Principes

- **Source-direct** : les packages exportent des fichiers `.ts` — pas de build,
  pas de `dist/`
- **Point d'entrée unique** : `src/index.ts` re-exporte l'API publique
- **Headless** : les packages fournissent hooks et logique — les composants UI
  vivent dans les applications consommatrices
- **Agnostique** : aucun code spécifique à une application (pas de FHIR,
  Capacitor, HDS, etc.)

## Qualité du code

### Critères bloquants (Definition of Done)

Tout code poussé doit satisfaire ces quatre critères :

1. **Lint** : `pnpm lint` passe sans aucun warning
2. **TypeScript** : `pnpm tsc` compile sans erreur
3. **Tests** : `pnpm test run` passe — tous les tests au vert
4. **Couverture** : ≥ 80 % sur tout nouveau code

### Hooks de pré-commit

Les hooks Git sont gérés par [Husky](https://typicode.github.io/husky/) et
[lint-staged](https://github.com/lint-staged/lint-staged) :

- **pre-commit** : `pnpm lint && pnpm tsc` sur les fichiers modifiés
- **commit-msg** : validation du message via commitlint

Si un hook échoue, le commit est bloqué. Corriger les erreurs avant de
recommencer.

### Règles TypeScript

- Mode `strict` activé sur tous les fichiers `.ts`/`.tsx`
- `import type` obligatoire pour les imports de type uniquement
- Jamais de `any` implicite

### Règles ESLint

- Zéro warning toléré (`--max-warnings 0`)
- Ordre des imports strict (`import-x/order`) — exécuter `npx eslint --fix`
  après création de nouveaux fichiers
- Pas de lignes vides entre les groupes d'imports

## Dépendances

### Peer dependencies

Les dépendances externes sont déclarées en `peerDependencies`, jamais en
`dependencies`. L'application consommatrice installe les versions requises.

### THIRD-PARTY-NOTICES.md

Lors de l'ajout, la suppression ou la mise à jour d'une dépendance externe,
mettre à jour le fichier `THIRD-PARTY-NOTICES.md` à la racine du dépôt
(nom, version, licence SPDX, copyright).

## Langue

| Contexte                                 | Langue   |
| ---------------------------------------- | -------- |
| Code (identifiants, JSDoc, commentaires) | Anglais  |
| Documentation, issues, commits           | Français |

## Ressources

- [Démarrage rapide](docs/guide/demarrage-rapide.md)
- [Documentation framework](docs/framework/index.md)
- [Tests](docs/testing/index.md)
- [CI/CD et déploiement](docs/deployment/index.md)
- [Patterns](docs/patterns/index.md)
