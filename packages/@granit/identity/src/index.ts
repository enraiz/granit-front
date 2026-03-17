// Types
export type { IdentityProviderCapabilities } from './types/index.js';
export type {
  IdentityUser,
  IdentityUserCacheStats,
  IdentityUserCacheSyncAllResult,
  IdentityUserCacheSyncStaleResult,
  IdentityUserListParams,
  IdentityUserPage,
} from './types/index.js';

// API
export { fetchIdentityCapabilities } from './api/identity-capabilities-api.js';
export {
  batchResolveUsers,
  eraseUserCache,
  getCacheStats,
  getUserById,
  pseudonymizeUserCache,
  searchUsers,
  syncAllUsers,
  syncStaleUsers,
  syncUsers,
} from './api/identity-user-cache-api.js';
