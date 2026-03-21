// Provider
export {
  OpenIddictAdminProvider,
  buildAdminQueryKey,
  useAdminConfig,
} from './providers/openiddict-admin-provider.js';
export type {
  OpenIddictAdminConfig,
  OpenIddictAdminProviderProps,
} from './providers/openiddict-admin-provider.js';

// Hooks — Users
export {
  useAdminUser,
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useImpersonateUser,
} from './hooks/use-admin-users.js';

// Hooks — Roles
export {
  useAdminRoleMembers,
  useAdminRoles,
  useCreateAdminRole,
  useDeleteAdminRole,
} from './hooks/use-admin-roles.js';

// Hooks — Groups
export {
  useAddGroupMember,
  useAdminGroups,
  useCreateAdminGroup,
  useDeleteAdminGroup,
  useRemoveGroupMember,
} from './hooks/use-admin-groups.js';
export type {
  AddGroupMemberVariables,
  RemoveGroupMemberVariables,
} from './hooks/use-admin-groups.js';

// Hooks — OIDC Applications
export {
  useCreateOidcApplication,
  useDeleteOidcApplication,
  useOidcApplications,
  useRotateApplicationSecret,
} from './hooks/use-oidc-applications.js';

// Hooks — OIDC Scopes
export {
  useCreateOidcScope,
  useDeleteOidcScope,
  useOidcScopes,
} from './hooks/use-oidc-scopes.js';

// Hooks — OIDC Authorizations
export {
  useOidcAuthorizations,
  useRevokeAuthorization,
  useRevokeUserAuthorizations,
} from './hooks/use-oidc-authorizations.js';
