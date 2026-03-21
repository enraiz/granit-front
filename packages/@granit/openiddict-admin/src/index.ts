// Types
export type {
  AdminGroup,
  AdminGroupCreateRequest,
  AdminGroupMemberRequest,
  AdminImpersonationResult,
  AdminOidcApplication,
  AdminOidcApplicationCreateRequest,
  AdminOidcApplicationSecretResponse,
  AdminOidcAuthorization,
  AdminOidcAuthorizationListParams,
  AdminOidcScope,
  AdminOidcScopeCreateRequest,
  AdminRole,
  AdminRoleCreateRequest,
  AdminRoleMember,
  AdminUser,
  AdminUserCreateRequest,
  AdminUserListParams,
  AdminUserPage,
} from './types/index.js';

// Query keys
export { openIddictAdminKeys } from './hooks/query-keys.js';

// API — Users
export {
  createUser,
  deleteUser,
  getUser,
  impersonateUser,
  listUsers,
} from './api/admin-user-api.js';

// API — Roles
export {
  createRole,
  deleteRole,
  getRoleMembers,
  listRoles,
} from './api/admin-role-api.js';

// API — Groups
export {
  addGroupMember,
  createGroup,
  deleteGroup,
  listGroups,
  removeGroupMember,
} from './api/admin-group-api.js';

// API — OIDC Applications
export {
  createApplication,
  deleteApplication,
  listApplications,
  rotateApplicationSecret,
} from './api/admin-oidc-application-api.js';

// API — OIDC Scopes
export {
  createScope,
  deleteScope,
  listScopes,
} from './api/admin-oidc-scope-api.js';

// API — OIDC Authorizations
export {
  listAuthorizations,
  revokeAuthorization,
  revokeUserAuthorizations,
} from './api/admin-oidc-authorization-api.js';
