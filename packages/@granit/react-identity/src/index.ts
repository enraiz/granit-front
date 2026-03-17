// Provider
export {
  IdentityProvider,
  buildIdentityQueryKey,
  useIdentityConfig,
} from './providers/identity-provider.js';
export type { IdentityConfig, IdentityProviderProps } from './providers/identity-provider.js';

// Hooks
export { useIdentityCacheStats, useBatchResolveUsers } from './hooks/use-identity-cache.js';
export { useIdentityCapabilities } from './hooks/use-identity-capabilities.js';
export { useIdentityRgpd } from './hooks/use-identity-rgpd.js';
export { useIdentitySync } from './hooks/use-identity-sync.js';
export { useIdentityUser, useIdentityUsers } from './hooks/use-identity-users.js';
