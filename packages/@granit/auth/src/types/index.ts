// ---------------------------------------------------------------------------
// Facade re-exports — @granit/auth re-exports from the split packages
// for backward compatibility. Prefer importing directly from
// @granit/authentication or @granit/authorization in new code.
// ---------------------------------------------------------------------------

// Authentication types (from @granit/authentication)
export type {
  BaseAuthContextType,
  KeycloakCoreConfig,
  KeycloakEvent,
  KeycloakUserInfo,
  LoginOptions,
  LogoutOptions,
} from '@granit/authentication';

// Authorization types (from @granit/authorization)
export type {
  PermissionDefinitionDto,
  PermissionGrantDto,
  PermissionGrantParams,
  PermissionGroupDto,
  PermissionsResponse,
  UsePermissionDefinitionsOptions,
  UsePermissionGrantOptions,
  UsePermissionsOptions,
  UsePermissionsReturn,
  UseRolePermissionsOptions,
} from '@granit/authorization';
