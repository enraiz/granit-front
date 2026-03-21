import { requestDeletion } from '@granit/privacy';
import { useMutation } from '@tanstack/react-query';

import { usePrivacyConfig } from '../providers/privacy-provider.js';

import type { PrivacyDeletionRequest } from '@granit/privacy';
import type { UseMutationResult } from '@tanstack/react-query';

/** Request deletion of all personal data (GDPR Art. 17). */
export function useRequestDeletion(): UseMutationResult<void, Error, PrivacyDeletionRequest> {
  const config = usePrivacyConfig();

  return useMutation({
    mutationFn: (request: PrivacyDeletionRequest) =>
      requestDeletion(config.client, config.basePath!, request),
  });
}
