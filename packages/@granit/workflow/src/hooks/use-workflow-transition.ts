import { createLogger } from '@granit/logger';
import { useCallback, useState } from 'react';

import { executeTransition } from '../api/workflow-api.js';
import { useWorkflowConfig } from '../providers/workflow-provider.js';

import type { TransitionResultDto } from '../types/index.js';

const logger = createLogger('workflow:transition');

export interface UseWorkflowTransitionOptions {
  entityType: string;
  entityId: string;
  onSuccess?: (result: TransitionResultDto) => void;
  onError?: (error: Error) => void;
}

export interface UseWorkflowTransitionReturn {
  transition: (targetState: string, comment?: string) => Promise<TransitionResultDto | null>;
  loading: boolean;
  result: TransitionResultDto | null;
  error: Error | null;
}

export function useWorkflowTransition({
  entityType,
  entityId,
  onSuccess,
  onError,
}: UseWorkflowTransitionOptions): UseWorkflowTransitionReturn {
  const { apiClient, basePath } = useWorkflowConfig();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransitionResultDto | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const transition = useCallback(
    async (targetState: string, comment?: string): Promise<TransitionResultDto | null> => {
      setLoading(true);
      setError(null);

      try {
        const data = await executeTransition(apiClient, basePath, entityType, entityId, {
          targetState,
          comment,
        });
        setResult(data);
        onSuccess?.(data);
        return data;
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to execute workflow transition', wrapped);
        setError(wrapped);
        onError?.(wrapped);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, basePath, entityType, entityId, onSuccess, onError]
  );

  return { transition, loading, result, error };
}
