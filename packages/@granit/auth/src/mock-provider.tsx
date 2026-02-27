import * as React from 'react';

import type { BaseAuthContextType } from './types.ts';

/**
 * Create a mock auth provider for development and Storybook.
 *
 * @example
 * const MockAuthProvider = createMockProvider(AuthContext, {
 *   keycloak: null, authenticated: true, loading: false,
 *   user: MOCK_USER, login: () => {}, logout: () => {},
 *   register: () => {},  // guava-front specific
 * });
 */
export function createMockProvider<T extends BaseAuthContextType>(
  AuthContext: React.Context<T | undefined>,
  value: T
): React.FC<{ children: React.ReactNode }> {
  function MockAuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }
  MockAuthProvider.displayName = 'MockAuthProvider';
  return MockAuthProvider;
}
