# @granit/react-identity

React bindings for `@granit/identity` -- IdentityProvider, useIdentityCapabilities.

## Installation

```bash
pnpm add @granit/react-identity
```

## API

### Components

- `IdentityProvider` -- provides identity configuration to the component tree

### Hooks

- `useIdentityCapabilities()` -- fetch identity provider capabilities
- `useIdentityConfig()` -- access identity configuration from context

### Utilities

- `buildIdentityQueryKey(...)` -- React Query key factory

### Types

- `IdentityConfig` -- identity provider configuration
- `IdentityProviderProps` -- props for `IdentityProvider`

## Usage

```tsx
import { IdentityProvider, useIdentityCapabilities } from '@granit/react-identity';

function App() {
  return (
    <IdentityProvider config={{ basePath: '/api' }}>
      <LoginForm />
    </IdentityProvider>
  );
}

function LoginForm() {
  const { data: capabilities } = useIdentityCapabilities();

  return <form>{capabilities?.canResetPassword && <a href="/reset">Forgot password?</a>}</form>;
}
```

## License

Apache-2.0
