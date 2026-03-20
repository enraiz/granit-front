import { cleanupOrphans } from '@granit/blob-storage';
import { useMutation } from '@tanstack/react-query';

import type { BlobStorageOptions } from './use-blob.js';
import type { BlobCleanupOrphansResponse } from '@granit/blob-storage';
import type { UseMutationResult } from '@tanstack/react-query';

const DEFAULT_BASE_PATH = '/api/v1/blobs';

/**
 * Mutation hook to clean up orphaned blobs stuck in Pending/Uploading state.
 *
 * Sends `POST {basePath}/cleanup-orphans`. Typically used by admin interfaces.
 *
 * @example
 * ```tsx
 * const { mutateAsync: cleanup } = useCleanupOrphans({ client: api });
 * const { cleanedCount } = await cleanup();
 * ```
 */
export function useCleanupOrphans(
  options: BlobStorageOptions
): UseMutationResult<BlobCleanupOrphansResponse, Error, void> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useMutation({
    mutationFn: () => cleanupOrphans(client, basePath),
  });
}
