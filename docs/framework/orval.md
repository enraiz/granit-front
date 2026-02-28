# Génération de clients typés avec orval

[orval](https://orval.dev/) génère des hooks TanStack Query typés depuis les documents
OpenAPI du backend Granit .NET. Il élimine les types et appels API écrits à la main et
garantit la synchronisation client-serveur.

> **Voir aussi** : [api-client.md](api-client.md) pour la factory Axios et le mutator.

## Pourquoi orval

- **Typage end-to-end** : les types TypeScript sont générés depuis l'OpenAPI — pas de
  dérive entre le backend et le frontend
- **Hooks prêts à l'emploi** : chaque endpoint produit un `useQuery` ou `useMutation`
  TanStack Query, avec query keys automatiques
- **Zéro code runtime** : orval est une devDependency, le code généré n'a pas de
  dépendance propre
- **Synchronisation CI** : regénérer en CI détecte les breaking changes au plus tôt

## Prérequis

- TanStack Query v5 (`@tanstack/react-query`) — déjà installé
- `@granit/api-client` avec `createMutator` — voir [api-client.md](api-client.md)

## Installation

```bash
pnpm add -D orval
```

## Configuration

Créer un fichier `orval.config.ts` à la racine de l'application :

```typescript
import { defineConfig } from 'orval';

export default defineConfig({
  api: {
    input: {
      // Pointer vers le backend en cours d'exécution
      target: 'http://localhost:5000/openapi/v1.json',
    },
    output: {
      target: './src/api/generated',
      client: 'react-query',
      mode: 'tags-split',
      clean: true,
      override: {
        mutator: {
          path: './src/api/mutator.ts',
          name: 'customInstance',
        },
        header: (info) => [
          '/* eslint-disable */',
          `/* Generated from OpenAPI — ${info.title} v${info.version} */`,
        ],
      },
    },
  },
});
```

### Options clés

| Option | Valeur | Description |
| ------ | ------ | ----------- |
| `client` | `"react-query"` | Génère des hooks TanStack Query v5 |
| `mode` | `"tags-split"` | Un fichier par tag OpenAPI (ex : patients, audit) |
| `clean` | `true` | Supprime le répertoire de sortie avant génération |
| `mutator.path` | `"./src/api/mutator.ts"` | Chemin vers le custom fetcher |

## Mutator

Le mutator connecte orval à `@granit/api-client` — les requêtes passent par l'instance
Axios avec ses intercepteurs (Bearer token, `X-Tenant-Id`).

```typescript
// src/api/mutator.ts
import { createMutator } from '@granit/api-client';

import { api } from '@/lib/api';

export const customInstance = createMutator(api);
export default customInstance;
```

## Génération

```bash
pnpm api:generate    # alias pour: pnpm exec orval
```

Ajouter le script dans `package.json` :

```json
{
  "scripts": {
    "api:generate": "orval"
  }
}
```

## Code généré

Le code généré est placé dans `src/api/generated/` et **ne doit pas être commité**.

```gitignore
# .gitignore
src/api/generated/
```

Regénérer au build ou en CI :

```bash
pnpm api:generate && pnpm build
```

### Structure générée (mode tags-split)

```
src/api/generated/
  patients/
    patients.ts          # hooks useGetPatients, useGetPatientById, ...
  audit/
    audit.ts             # hooks useGetAuditLogs, ...
  model/
    problemDetails.ts    # types d'erreur RFC 7807
    patient.ts           # types Patient, PaginatedResponse, ...
```

## Utilisation des hooks

```typescript
import { useGetPatientById } from '@/api/generated/patients/patients';

function PatientPage({ id }: { id: string }) {
  const { data, isLoading } = useGetPatientById(id, {
    query: {
      staleTime: 1000 * 60 * 5,  // options custom acceptées
    },
  });

  if (isLoading) return <Spinner />;
  return <PatientCard patient={data} />;
}
```

### Mutations avec invalidation de cache

```typescript
import { useToggleUserStatus } from '@/api/generated/users/users';
import { useQueryClient } from '@tanstack/react-query';

function UserActions({ userId }: { userId: string }) {
  const queryClient = useQueryClient();
  const { mutate } = useToggleUserStatus({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['users'] });
      },
    },
  });

  return <Button onClick={() => mutate({ id: userId, data: { enabled: false } })} />;
}
```

## Gestion des erreurs RFC 7807

Le backend retourne les erreurs au format `application/problem+json`. Le type
`ProblemDetails` de `@granit/types` permet de les typer :

```typescript
import type { ProblemDetails } from '@granit/types';

const { mutate } = useCreatePatient({
  mutation: {
    onError: (error) => {
      const problem = error.response?.data as ProblemDetails;
      if (problem.errorCode === 'Patient:DuplicateEmail') {
        showToast(problem.detail ?? problem.title);
      }
    },
  },
});
```

## Bonnes pratiques

- **Pointer vers l'API en cours d'exécution** (`/openapi/v1.json`), pas vers un
  fichier JSON copié manuellement
- **Regénérer en CI** : ajouter une étape dans le pipeline qui regénère et échoue
  si les types changent sans mise à jour du consommateur
- **Ne pas modifier le code généré** : toute personnalisation passe par le mutator
  ou les options du hook au point d'appel
- **Un `orval.config.ts` par application** : chaque app pointe vers son backend
  (URL et version potentiellement différents)
