import { createLogger } from '@granit/logger';
import { executeStateMachineTransition } from '@granit/workflow';
import { useCallback, useState } from 'react';

import { useWorkflowConfig } from '../providers/workflow-provider.js';

import type { TransitionResultDto } from '@granit/workflow';

const logger = createLogger('workflow:execute-transition');

export interface UseExecuteTransitionOptions {
  onSuccess?: (result: TransitionResultDto) => void;
  onError?: (error: Error) => void;
}

export interface UseExecuteTransitionReturn {
  transition: (
    currentState: string,
    targetState: string,
    comment?: string
  ) => Promise<TransitionResultDto | null>;
  loading: boolean;
  result: TransitionResultDto | null;
  error: Error | null;
}

export function useExecuteTransition(
  options?: UseExecuteTransitionOptions
): UseExecuteTransitionReturn {
  const { apiClient, basePath } = useWorkflowConfig();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TransitionResultDto | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const transition = useCallback(
    async (
      currentState: string,
      targetState: string,
      comment?: string
    ): Promise<TransitionResultDto | null> => {
      setLoading(true);
      setError(null);

      try {
        const data = await executeStateMachineTransition(apiClient, basePath, currentState, {
          targetState,
          comment,
        });
        setResult(data);
        options?.onSuccess?.(data);
        return data;
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to execute transition', wrapped);
        setError(wrapped);
        options?.onError?.(wrapped);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiClient, basePath, options?.onSuccess, options?.onError]
  );

  return { transition, loading, result, error };
}
