# @granit/api-client

Factory Axios avec intercepteurs Bearer token et multi-tenant pour les applications
Digital Dynamics. Fournit également un mutator orval pour la génération de clients typés.

## API

### `createApiClient(config: ApiClientConfig): AxiosInstance`

Crée une instance Axios pré-configurée avec des intercepteurs de requête qui injectent
automatiquement le Bearer token Keycloak et le header `X-Tenant-Id` (si configuré).

```typescript
import { createApiClient } from '@granit/api-client';

export const api = createApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000, // optionnel, défaut : 10 000 ms
});
```

### `setTokenGetter(getter: () => Promise<string | undefined>): void`

Enregistre la fonction de récupération du token Keycloak. Cette fonction est appelée
automatiquement par `useKeycloakInit` de `@granit/auth` — il n'est pas nécessaire de
l'appeler manuellement si `@granit/auth` est utilisé.

```typescript
import { setTokenGetter } from '@granit/api-client';

// Exemple d'appel manuel (sans @granit/auth)
setTokenGetter(async () => {
  await keycloak.updateToken(5);
  return keycloak.token;
});
```

### `setTenantGetter(getter: () => string | undefined): void`

Enregistre une fonction synchrone qui retourne l'identifiant du tenant courant.
**Opt-in** : si aucun getter n'est configuré, le header `X-Tenant-Id` n'est pas
envoyé. Uniquement nécessaire pour les applications multi-tenant.

```typescript
import { setTenantGetter } from '@granit/api-client';

// Exemple : tenant depuis un store React
setTenantGetter(() => tenantStore.currentTenantId);
```

Le header `X-Tenant-Id` est aligné sur le backend Granit .NET
(`Granit.MultiTenancy` — résolution par header, priorité maximale).

### `createMutator(instance: AxiosInstance): MutatorFn`

Factory qui crée une fonction [mutator orval](https://orval.dev/guides/custom-client)
à partir d'une instance Axios existante. Le mutator réutilise les intercepteurs de
l'instance (token, tenant) et retourne directement `response.data`.

```typescript
import { createApiClient, createMutator } from '@granit/api-client';

const api = createApiClient({ baseURL: import.meta.env.VITE_API_URL });
export const customInstance = createMutator(api);
export default customInstance;
```

> Voir la documentation [orval](orval.md) pour la configuration complète.

### `setOnUnauthorized(callback: () => void): void`

Enregistre un callback invoqué automatiquement lorsqu'une requête reçoit une
réponse HTTP 401. Chaque instance créée par `createApiClient` inclut un
intercepteur de réponse qui déclenche ce callback.

Typiquement wiré par `@granit/auth` pour forcer un logout Keycloak lorsque le
backend rejette un token (ex : session révoquée via back-channel logout).

```typescript
import { setOnUnauthorized } from '@granit/api-client';

// Appelé automatiquement par useKeycloakInit — appel manuel si sans @granit/auth
setOnUnauthorized(() => {
  keycloak.logout();
});
```

> L'erreur 401 est toujours propagée après l'appel du callback — les composants
> peuvent donc la capter dans leur propre logique `catch`.

### Intercepteur de réponse 401

Toute instance créée par `createApiClient` inclut un intercepteur de réponse
qui :

1. Détecte les réponses HTTP 401
2. Appelle le callback `onUnauthorized` (s'il a été enregistré via
   `setOnUnauthorized`)
3. Propage l'erreur normalement (le callback ne « swallow » pas l'erreur)

Cet intercepteur est central pour la gestion des sessions révoquées : lorsque
le backend invalide une session via back-channel logout Keycloak, les appels
API suivants reçoivent un 401 → le callback force le logout côté frontend.

### Gestion des erreurs 403

La gestion des erreurs 403 (permissions insuffisantes) reste à la charge de
l'application consommatrice. Ajouter un intercepteur de réponse après la
création de l'instance :

```typescript
import axios from 'axios';
import { logger } from '@/lib/logger';

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 403) {
      logger.warn('[API] Accès refusé — permissions insuffisantes');
    }
    throw error;
  }
);
```

Le backend retourne les erreurs au format RFC 7807 `ProblemDetails` — voir
`@granit/types` pour le type TypeScript correspondant.

## Peer dependencies

- `axios`
