// Provider
export {
  IdentityProvider,
  buildIdentityQueryKey,
  useIdentityConfig,
} from './providers/identity-provider.js';
export type { IdentityConfig, IdentityProviderProps } from './providers/identity-provider.js';

// Hooks
export { useIdentityCapabilities } from './hooks/use-identity-capabilities.js';
