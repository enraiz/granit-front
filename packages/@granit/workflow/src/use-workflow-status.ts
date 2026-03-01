import { createLogger } from '@granit/logger';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchStatus } from './api.ts';
import { useWorkflowConfig } from './workflow-provider.tsx';

import type { TransitionDto } from './types.ts';

const logger = createLogger('workflow:status');

export interface UseWorkflowStatusOptions {
  entityType: string;
  entityId: string;
}

export interface UseWorkflowStatusResult {
  currentState: string | null;
  transitions: TransitionDto[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useWorkflowStatus({
  entityType,
  entityId,
}: UseWorkflowStatusOptions): UseWorkflowStatusResult {
  const { apiClient, basePath } = useWorkflowConfig();

  const [currentState, setCurrentState] = useState<string | null>(null);
  const [transitions, setTransitions] = useState<TransitionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const status = await fetchStatus(apiClient, basePath, entityType, entityId);

      if (!controller.signal.aborted) {
        setCurrentState(status.currentState);
        setTransitions(status.availableTransitions);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to fetch workflow status', wrapped);
        setError(wrapped);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiClient, basePath, entityType, entityId]);

  useEffect(() => {
    refetch().catch(() => {});
    return () => {
      abortRef.current?.abort();
    };
  }, [refetch]);

  return { currentState, transitions, loading, error, refetch };
}
