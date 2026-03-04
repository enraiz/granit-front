import { createLogger } from '@granit/logger';
import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchHistory } from '../api/workflow-api.js';
import { useWorkflowConfig } from '../providers/workflow-provider.js';

import type { TransitionHistoryDto } from '../types/index.js';

const logger = createLogger('workflow:history');

export interface UseWorkflowHistoryOptions {
  entityType: string;
  entityId: string;
  enabled?: boolean;
}

export interface UseWorkflowHistoryResult {
  history: TransitionHistoryDto[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useWorkflowHistory({
  entityType,
  entityId,
  enabled = true,
}: UseWorkflowHistoryOptions): UseWorkflowHistoryResult {
  const { apiClient, basePath } = useWorkflowConfig();

  const [history, setHistory] = useState<TransitionHistoryDto[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const refetch = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await fetchHistory(apiClient, basePath, entityType, entityId);

      if (!controller.signal.aborted) {
        setHistory(data);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to fetch workflow history', wrapped);
        setError(wrapped);
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apiClient, basePath, entityType, entityId]);

  useEffect(() => {
    if (enabled) {
      refetch().catch(() => {});
    }
    return () => {
      abortRef.current?.abort();
    };
  }, [enabled, refetch]);

  return { history, loading, error, refetch };
}
