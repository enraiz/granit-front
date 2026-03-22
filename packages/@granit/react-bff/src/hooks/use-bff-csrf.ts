import { useCallback } from 'react';

import { useBffContext } from '../providers/bff-provider.js';

/**
 * Hook to access the current CSRF token and refresh it.
 *
 * @throws Error if used outside of a `<BffProvider>`.
 */
export function useBffCsrf() {
  const { csrfManager } = useBffContext();

  const csrfToken = csrfManager.getToken();

  const refreshCsrf = useCallback(() => csrfManager.fetchToken(), [csrfManager]);

  return { csrfToken, refreshCsrf } as const;
}
