// ---------------------------------------------------------------------------
// Facade re-exports — @granit/react-auth re-exports from the split packages
// for backward compatibility. Prefer importing directly from
// @granit/react-authentication or @granit/react-authorization in new code.
// ---------------------------------------------------------------------------

// Authentication (from @granit/react-authentication)
export {
  useKeycloakInit,
  createAuthContext,
  createMockProvider,
} from '@granit/react-authentication';
export type { KeycloakCoreResult } from '@granit/react-authentication';

// Authorization (from @granit/react-authorization)
export {
  usePermissions,
  permissionKeys,
  usePermissionDefinitions,
  useRolePermissions,
  usePermissionGrant,
} from '@granit/react-authorization';
export type { UsePermissionGrantReturn } from '@granit/react-authorization';
