/** Query key factory for OpenIddict admin queries. */
export const openIddictAdminKeys = {
  all: ['openiddict-admin'] as const,
  users: () => [...openIddictAdminKeys.all, 'users'] as const,
  user: (id: string) => [...openIddictAdminKeys.users(), id] as const,
  roles: () => [...openIddictAdminKeys.all, 'roles'] as const,
  roleMembers: (name: string) => [...openIddictAdminKeys.roles(), name, 'members'] as const,
  groups: () => [...openIddictAdminKeys.all, 'groups'] as const,
  applications: () => [...openIddictAdminKeys.all, 'oidc', 'applications'] as const,
  scopes: () => [...openIddictAdminKeys.all, 'oidc', 'scopes'] as const,
  authorizations: () => [...openIddictAdminKeys.all, 'oidc', 'authorizations'] as const,
};
