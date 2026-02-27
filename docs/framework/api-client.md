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

### Gestion des erreurs 401/403

La gestion des erreurs 401/403 est intentionnellement **laissée à l'application** consommatrice.
Ajouter un intercepteur de réponse après la création de l'instance :

```typescript
import axios from 'axios';
import { logger } from '@/lib/logger';

api.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        logger.warn('[API] Session expirée — token invalide');
      } else if (error.response?.status === 403) {
        logger.warn('[API] Accès refusé — permissions insuffisantes');
      }
    }
    throw error;
  }
);
```

Le backend retourne les erreurs au format RFC 7807 `ProblemDetails` — voir
`@granit/types` pour le type TypeScript correspondant.

## Peer dependencies

- `axios`
