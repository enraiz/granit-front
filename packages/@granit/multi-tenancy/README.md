# @granit/multi-tenancy

Multi-tenancy types and tenant resolver abstraction -- mirrors Granit.MultiTenancy .NET contract.

## Installation

```bash
pnpm add @granit/multi-tenancy
```

## API

### Types

- `TenantInfo` -- tenant metadata (id, name)
- `CurrentTenant` -- currently resolved tenant
- `MultiTenancyOptions` -- multi-tenancy configuration options
- `TenantResolver` -- interface for tenant resolution strategies
- `JwtClaimTenantResolverOptions` -- options for the JWT claim resolver

### Constants

- `DEFAULT_MULTI_TENANCY_OPTIONS` -- sensible default configuration

### Functions

- `resolveTenant(resolvers)` -- runs the tenant resolver pipeline
- `createJwtClaimTenantResolver(options)` -- creates a resolver that extracts tenant from JWT claims

## Usage

```ts
import { createJwtClaimTenantResolver, resolveTenant } from '@granit/multi-tenancy';
import type { TenantInfo } from '@granit/multi-tenancy';

const jwtResolver = createJwtClaimTenantResolver({ claimName: 'tenant_id' });
const tenant = await resolveTenant([jwtResolver]);
```

## License

Apache-2.0
