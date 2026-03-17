# @granit/react-authorization

React hooks for `@granit/authorization` -- permission checking, definitions, role grants.

## Installation

```bash
pnpm add @granit/react-authorization
```

## API

### Hooks

- `usePermissions(options?)` -- check current user permissions
- `usePermissionDefinitions(options?)` -- fetch all permission definitions
- `useRolePermissions(options?)` -- fetch permissions for a specific role
- `usePermissionGrant(options?)` -- grant or revoke a permission

### Utilities

- `permissionKeys` -- React Query key factory

### Types

- `UsePermissionGrantReturn` -- return type of `usePermissionGrant`

## Usage

```tsx
import { usePermissions } from '@granit/react-authorization';

function ProtectedButton() {
  const { data: permissions } = usePermissions();

  if (!permissions?.isGranted('documents.create')) {
    return null;
  }

  return <button>Create Document</button>;
}
```

## License

Apache-2.0
