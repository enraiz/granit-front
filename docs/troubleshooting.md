# Dépannage

Solutions aux problèmes courants rencontrés lors du développement avec
granit-front.

## Cannot find module '@granit/xxx'

### Symptôme

TypeScript ou Vite ne résout pas un import `@granit/*` :

```text
Cannot find module '@granit/auth' or its corresponding type declarations.
```

### Solution

1. Vérifier que le package est déclaré via le protocole `link:` dans le
   `package.json` de l'application consommatrice :

   ```json
   {
     "dependencies": {
       "@granit/auth": "link:../granit-front/packages/@granit/auth"
     }
   }
   ```

2. Vérifier que l'alias Vite est configuré dans `vite.config.ts` :

   ```typescript
   resolve: {
     alias: {
       '@granit/auth': path.join(GRANIT, 'auth/src/index.ts'),
     },
   }
   ```

3. Relancer `pnpm install` dans l'application consommatrice.

## Erreurs d'ordre des imports ESLint

### Symptôme

ESLint signale des erreurs `import-x/order` après la création d'un nouveau
fichier :

```text
error  There should be no empty line within import group  import-x/order
```

### Solution

1. Exécuter le correcteur automatique :

   ```bash
   npx eslint --fix packages/@granit/mon-package/src/mon-fichier.ts
   ```

2. Vérifier qu'il n'y a **aucune ligne vide** entre les imports d'un même
   groupe (imports externes ensemble, imports internes ensemble, imports de
   type ensemble).

3. Respecter l'ordre : imports externes triés alphabétiquement, puis imports
   internes, puis imports `type`.

## Résolution des chemins TypeScript

### Symptôme

TypeScript ne trouve pas les modules `@granit/*` malgré le protocole `link:` :

```text
TS2307: Cannot find module '@granit/utils' or its corresponding type declarations.
```

### Solution

Ajouter les `paths` dans **chaque** fichier `tsconfig` de l'application
(`tsconfig.app.json`, `tsconfig.test.json`, `tsconfig.storybook.json`) :

```json
{
  "compilerOptions": {
    "paths": {
      "@granit/utils": ["../granit-front/packages/@granit/utils/src/index.ts"],
      "@granit/auth": ["../granit-front/packages/@granit/auth/src/index.ts"]
    }
  }
}
```

> Les `paths` TypeScript et les alias Vite doivent pointer vers le **même
> fichier** (`src/index.ts`).

## Alias Vitest non résolu

### Symptôme

Les tests échouent avec une erreur de résolution de module pour un package
`@granit/*` :

```text
Error: Failed to resolve import "@granit/querying" from "src/components/..."
```

### Solution

Dans `vitest.config.ts`, vérifier que les **sous-chemins** sont déclarés
**avant** le chemin principal du package :

```typescript
resolve: {
  alias: {
    // Sous-chemins en premier
    '@granit/querying/types': path.join(GRANIT, 'querying/src/types/index.ts'),
    // Chemin principal après
    '@granit/querying': path.join(GRANIT, 'querying/src/index.ts'),
  },
}
```

Vitest résout les alias dans l'ordre de déclaration. Si le chemin principal
est listé en premier, les sous-chemins ne sont jamais atteints.

## Problèmes de mock SignalR dans les tests

### Symptôme

Les tests du package `@granit/notifications` échouent avec :

```text
ReferenceError: HubConnectionBuilder is not defined
```

### Solution

Vérifier que le fichier `setup.ts` du package inclut le mock de
`@microsoft/signalr`. Le mock doit être hoisté via `vi.hoisted` :

```typescript
const mockConnection = vi.hoisted(() => ({
  start: vi.fn().mockResolvedValue(undefined),
  stop: vi.fn().mockResolvedValue(undefined),
  on: vi.fn(),
  off: vi.fn(),
  invoke: vi.fn(),
  state: 'Connected',
}));

vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder: vi.fn(() => ({
    withUrl: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    build: vi.fn(() => mockConnection),
  })),
  HubConnectionState: { Connected: 'Connected', Disconnected: 'Disconnected' },
}));
```

> Ne pas destructurer `createConnection` au top-level du fichier de test —
> cela crée une référence stale qui n'est pas mockée.

## Incompatibilité de type readonly array

### Symptôme

TypeScript signale une erreur de type lors du retour d'un tableau :

```text
Type 'readonly string[]' is not assignable to type 'string[]'.
  The type 'readonly string[]' is 'readonly' and cannot be assigned to the mutable type 'string[]'.
```

### Solution

Utiliser `readonly T[]` dans les types de retour des hooks et fonctions :

```typescript
// Incorrect
function useItems(): string[] { ... }

// Correct
function useItems(): readonly string[] { ... }
```

Ou utiliser `ReadonlyArray<T>` pour les types plus complexes :

```typescript
type Result = {
  items: readonly Item[];
  selectedIds: ReadonlyArray<string>;
};
```

## Échec des hooks de pré-commit

### Symptôme

Le commit est bloqué par un hook Husky :

```text
✖ pnpm lint:
  error  ...

husky - pre-commit hook exited with code 1
```

### Solution

1. **Lint** : corriger les erreurs ESLint signalées, puis relancer :

   ```bash
   pnpm lint
   # ou pour corriger automatiquement :
   npx eslint --fix packages/@granit/*/src/**/*.{ts,tsx}
   ```

2. **TypeScript** : corriger les erreurs de compilation :

   ```bash
   pnpm tsc
   ```

3. **commitlint** : vérifier le format du message de commit
   ([Conventional Commits](https://www.conventionalcommits.org/fr/)) :

   ```text
   # Correct
   feat(auth): ajouter le support PKCE

   # Incorrect — manque le type
   ajouter le support PKCE

   # Incorrect — type inconnu
   feature(auth): ajouter le support PKCE
   ```

4. Corriger les problèmes, restager les fichiers (`git add`), puis refaire
   le commit. Ne jamais utiliser `--no-verify` pour contourner les hooks.

## Voir aussi

- [Démarrage rapide](guide/demarrage-rapide.md)
- [Tests](testing/index.md)
- [CI/CD et déploiement](deployment/index.md)
