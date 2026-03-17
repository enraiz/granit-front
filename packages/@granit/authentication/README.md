# @granit/authentication

Keycloak/OIDC authentication types -- TypeScript mirror of Granit.Authentication .NET.

## Installation

```bash
pnpm add @granit/authentication
```

## API

### Types

- `BaseAuthContextType` -- shared base interface for authentication context
- `KeycloakCoreConfig` -- Keycloak instance configuration
- `KeycloakEvent` -- Keycloak lifecycle event
- `KeycloakUserInfo` -- user profile from Keycloak token
- `LoginOptions` -- options for login redirect
- `LogoutOptions` -- options for logout redirect

## Usage

```ts
import type { BaseAuthContextType, KeycloakCoreConfig } from '@granit/authentication';

const config: KeycloakCoreConfig = {
  url: 'https://auth.example.com',
  realm: 'my-realm',
  clientId: 'my-app',
};
```

## License

Apache-2.0
