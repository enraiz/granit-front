# @granit/authorization

Permission and role authorization types -- TypeScript mirror of Granit.Authorization .NET.

## Installation

```bash
pnpm add @granit/authorization
```

## API

### Types

- `PermissionsResponse` -- server response containing permission grants
- `PermissionDefinitionDto` -- single permission definition
- `PermissionGroupDto` -- group of related permissions
- `PermissionGrantDto` -- granted permission for a role/user
- `PermissionGrantParams` -- parameters for granting a permission
- `UsePermissionsOptions` -- options for the permissions hook
- `UsePermissionsReturn` -- return type of the permissions hook
- `UsePermissionDefinitionsOptions` -- options for fetching permission definitions
- `UseRolePermissionsOptions` -- options for fetching role-specific permissions
- `UsePermissionGrantOptions` -- options for the permission grant hook

## Usage

```ts
import type { PermissionsResponse, PermissionDefinitionDto } from '@granit/authorization';
```

## License

Apache-2.0
