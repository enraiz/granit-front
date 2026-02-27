<img src="../../../docs/images/granit-icon.svg" alt="" height="32" align="left" style="margin-right:10px" />

# @granit/auth

Couche d'authentification Keycloak partagée : hook d'initialisation, factory de contexte
React typé, et mock provider pour les tests et Storybook.

## Installation

Consommé via `link:` protocol — voir la [documentation d'intégration](../../README.md).

## API

### `useKeycloakInit(config: KeycloakCoreConfig): KeycloakCoreResult`

Hook d'initialisation Keycloak partagé (web uniquement — sans logique Capacitor).

Gère automatiquement :

- Instanciation Keycloak avec PKCE S256
- `check-sso` au démarrage (configurable via `silentCheckSso`)
- Rechargement des infos utilisateur (`loadUserInfo`)
- Renouvellement automatique du token toutes les 60 secondes
- Wiring du Bearer token vers `@granit/api-client` (via `setTokenGetter`)

```typescript
import { useKeycloakInit } from '@granit/auth';

const { keycloak, keycloakRef, authenticated, loading, user, login, logout } =
  useKeycloakInit({
    url:      import.meta.env.VITE_KEYCLOAK_URL,
    realm:    import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
    silentCheckSso: true, // false sur Capacitor native
  });
```

`keycloakRef` expose l'instance Keycloak brute pour les apps qui ont besoin de construire
des URLs de login/logout personnalisées (ex : schéma URL custom sur Capacitor).

### `createAuthContext<T extends BaseAuthContextType>()`

Factory générique de contexte d'authentification typé. Retourne `{ AuthContext, useAuth }`.

```typescript
import { createAuthContext, type BaseAuthContextType } from '@granit/auth';

// Définir le type étendu de l'application
interface AuthContextType extends BaseAuthContextType {
  hasAdminRole: boolean; // champ spécifique à l'app
}

// Créer le contexte et le hook typés
export const { AuthContext, useAuth } = createAuthContext<AuthContextType>();
```

`useAuth()` lève une erreur explicite si appelé hors d'un `AuthContext.Provider`.

### `createMockProvider<T>(AuthContext, value): React.FC`

Factory de provider mock pour Storybook et tests unitaires. Utilise le même `AuthContext`
que le provider réel — aucun double contexte.

```typescript
import { createMockProvider } from '@granit/auth';
import { AuthContext } from './auth-context';

export const MockAuthProvider = createMockProvider(AuthContext, {
  keycloak:      null,
  authenticated: true,
  loading:       false,
  user: {
    sub:  'mock-001',
    name: 'Test User',
    email: 'test@example.com',
  },
  hasAdminRole: true,
  login:  () => {},
  logout: () => {},
});
```

## Interfaces

### `BaseAuthContextType`

Interface de base partagée par toutes les applications.

```typescript
interface BaseAuthContextType {
  keycloak:      Keycloak | null; // null avant la fin de l'init
  authenticated: boolean;
  loading:       boolean;
  user:          KeycloakUserInfo | null;
  login:         () => void;
  logout:        () => void;
}
```

### `KeycloakCoreConfig`

```typescript
interface KeycloakCoreConfig {
  url:              string;
  realm:            string;
  clientId:         string;
  silentCheckSso?:  boolean; // défaut : true — passer false sur Capacitor
}
```

## Extensions par application

| Application | Champs supplémentaires |
| --- | --- |
| `guava-front` | `register: () => void` |
| `guava-admin` | `hasAdminRole: boolean` |

## Peer dependencies

- `react`
- `keycloak-js`
- `@granit/types`
