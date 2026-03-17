# @granit/react-multi-tenancy

React bindings for `@granit/multi-tenancy` -- TenantProvider, useTenant.

## Installation

```bash
pnpm add @granit/react-multi-tenancy
```

## API

### Components

- `TenantProvider` -- resolves and provides current tenant to the component tree, auto-wires `X-Tenant-Id` header via `@granit/api-client`

### Hooks

- `useTenant()` -- access the current tenant from context
- `useKeycloakTenantResolvers(options?)` -- creates tenant resolvers that extract tenant from Keycloak token claims

### Types

- `TenantProviderProps` -- props for `TenantProvider`
- `UseKeycloakTenantResolversOptions` -- options for `useKeycloakTenantResolvers`

## Usage

```tsx
import { TenantProvider, useTenant } from '@granit/react-multi-tenancy';

function App() {
  return (
    <TenantProvider resolvers={resolvers}>
      <Dashboard />
    </TenantProvider>
  );
}

function Dashboard() {
  const { tenant } = useTenant();

  return <h1>Tenant: {tenant?.name}</h1>;
}
```

## License

Apache-2.0
