import { createLogger } from '@granit/logger';
import { useCallback, useState } from 'react';


import { createEntry, deleteEntry } from './api.ts';
import { useTimelineConfig } from './timeline-provider.tsx';

import type { CreateTimelineEntryRequest, TimelineStreamEntry } from './types.ts';

const logger = createLogger('timeline:actions');

export interface UseTimelineActionsOptions {
  entityType: string;
  entityId: string;
  onEntryCreated?: (entry: TimelineStreamEntry) => void;
  onEntryDeleted?: (entryId: string) => void;
}

export interface UseTimelineActionsResult {
  postEntry: (request: CreateTimelineEntryRequest) => Promise<TimelineStreamEntry>;
  removeEntry: (entryId: string) => Promise<void>;
  posting: boolean;
  deleting: boolean;
  error: Error | null;
}

export function useTimelineActions({
  entityType,
  entityId,
  onEntryCreated,
  onEntryDeleted,
}: UseTimelineActionsOptions): UseTimelineActionsResult {
  const { apiClient, basePath } = useTimelineConfig();

  const [posting, setPosting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const postEntry = useCallback(
    async (request: CreateTimelineEntryRequest): Promise<TimelineStreamEntry> => {
      setPosting(true);
      setError(null);

      try {
        const entry = await createEntry(apiClient, basePath, entityType, entityId, request);
        onEntryCreated?.(entry);
        return entry;
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to post timeline entry', wrapped);
        setError(wrapped);
        throw wrapped;
      } finally {
        setPosting(false);
      }
    },
    [apiClient, basePath, entityType, entityId, onEntryCreated],
  );

  const removeEntry = useCallback(
    async (entryId: string): Promise<void> => {
      setDeleting(true);
      setError(null);

      try {
        await deleteEntry(apiClient, basePath, entityType, entityId, entryId);
        onEntryDeleted?.(entryId);
      } catch (err) {
        const wrapped = err instanceof Error ? err : new Error(String(err));
        logger.error('Failed to delete timeline entry', wrapped);
        setError(wrapped);
        throw wrapped;
      } finally {
        setDeleting(false);
      }
    },
    [apiClient, basePath, entityType, entityId, onEntryDeleted],
  );

  return { postEntry, removeEntry, posting, deleting, error };
}
