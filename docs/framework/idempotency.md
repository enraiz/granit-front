# @granit/idempotency

Injection automatique du header `Idempotency-Key` sur les requêtes de mutation
(`POST`, `PUT`, `PATCH`, `DELETE`) via `@granit/api-client`.

Le backend `Granit.Idempotency` (.NET) utilise ce header pour dédupliquer les
requêtes identiques (retries réseau, double-clic). Ce package côté frontend
génère un UUID v4 unique par requête et l'injecte transparentement.

## Installation

```bash
pnpm add @granit/idempotency
```

## Utilisation

Appeler `enableIdempotency()` une seule fois au démarrage de l'application,
**avant** toute requête API :

```typescript
// src/main.ts
import { enableIdempotency } from '@granit/idempotency';

enableIdempotency();
```

Toutes les requêtes de mutation passant par `@granit/api-client` incluront
automatiquement le header `Idempotency-Key: <uuid>`.

## API

### `enableIdempotency(options?: IdempotencyOptions): void`

Active l'injection du header d'idempotence sur l'instance partagée
`@granit/api-client`. Chaque requête de mutation reçoit un UUID v4 unique
via `crypto.randomUUID()`.

```typescript
interface IdempotencyOptions {
  /** Méthodes HTTP ciblées. Défaut : `['post', 'put', 'patch', 'delete']`. */
  methods?: string[];

  /** Nom du header HTTP. Défaut : `'Idempotency-Key'`. */
  headerName?: string;

  /** Générateur personnalisé. Retourne la clé ou `undefined` pour ignorer. */
  keyGenerator?: (config: InternalAxiosRequestConfig) => string | undefined;
}
```

#### Options

| Option         | Type                              | Défaut                               | Description                                  |
| -------------- | --------------------------------- | ------------------------------------ | -------------------------------------------- |
| `methods`      | `string[]`                        | `['post', 'put', 'patch', 'delete']` | Méthodes HTTP qui reçoivent le header        |
| `headerName`   | `string`                          | `'Idempotency-Key'`                  | Nom du header (doit correspondre au backend) |
| `keyGenerator` | `(config) => string \| undefined` | `crypto.randomUUID()`                | Fonction de génération de clé                |

### `disableIdempotency(): void`

Désactive l'injection du header. Utile pour les tests ou les feature flags.

```typescript
import { disableIdempotency } from '@granit/idempotency';

disableIdempotency();
```

## Exemples avancés

### Générateur de clé personnalisé

Pour dédupliquer les retries avec une clé stable dérivée du body :

```typescript
enableIdempotency({
  keyGenerator: (config) => {
    return config.data?.idempotencyKey ?? crypto.randomUUID();
  },
});
```

### Restreindre aux POST uniquement

```typescript
enableIdempotency({ methods: ['post'] });
```

## Architecture — soft dependency

Ce package suit le pattern de soft dependency de `@granit/api-client` :

1. `@granit/api-client` expose `setIdempotencyKeyGenerator()` (setter global)
2. `@granit/idempotency` appelle ce setter au moment de `enableIdempotency()`
3. L'intercepteur de requête d'`@granit/api-client` invoque le générateur
   s'il est enregistré

Ce découplage permet aux applications de ne pas installer `@granit/idempotency`
si elles n'en ont pas besoin — `@granit/api-client` fonctionne sans.

```text
@granit/idempotency ──setIdempotencyKeyGenerator()──▶ @granit/api-client
                                                           │
                                                    intercepteur requête
                                                           │
                                                    Idempotency-Key: <uuid>
```

## Lien avec le backend

Le header `Idempotency-Key` est consommé par le middleware
`Granit.Idempotency` (.NET) qui :

- Calcule un hash SHA-256 du payload
- Stocke la réponse dans Redis avec une clé composite `tenantId:userId:key`
- Retourne la réponse mise en cache si la même clé est rejouée
- Renvoie HTTP 409 si la même clé est utilisée avec un payload différent
- Renvoie HTTP 422 si le header est manquant et que l'endpoint le requiert
  (`[Idempotent(Required = true)]`)

Documentation backend complète : see `granit-dotnet/docs/framework/api/idempotency.md`.

## Peer dependencies

- `@granit/api-client`
- `axios`
