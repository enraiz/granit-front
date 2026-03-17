# @granit/react-authentication

React bindings for `@granit/authentication` -- Keycloak init hook, auth context factory, mock provider.

## Installation

```bash
pnpm add @granit/react-authentication
```

## API

### Hooks

- `useKeycloakInit(config)` -- initializes Keycloak and returns auth state

### Factories

- `createAuthContext()` -- creates a typed React context and hook for authentication
- `createMockProvider(overrides)` -- creates a mock auth provider for testing

### Types

- `KeycloakCoreResult` -- return type of `useKeycloakInit`

## Usage

```tsx
import { useKeycloakInit, createAuthContext } from '@granit/react-authentication';

const { AuthProvider, useAuth } = createAuthContext();

function App() {
  const keycloak = useKeycloakInit({
    url: 'https://auth.example.com',
    realm: 'my-realm',
    clientId: 'my-app',
  });

  return (
    <AuthProvider value={keycloak}>
      <MyApp />
    </AuthProvider>
  );
}

function MyApp() {
  const { user, logout } = useAuth();
  return <span>{user?.name}</span>;
}
```

## License

Apache-2.0
