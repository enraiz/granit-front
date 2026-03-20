import type { TimelineEntryTypeValue } from './entry-type.js';
import type { PagedResult } from '@granit/querying';

// --- API response types ---

export interface TimelineStreamEntry {
  id: string;
  entityType: string;
  entityId: string;
  entryType: TimelineEntryTypeValue;
  body: string;
  authorId: string;
  authorDisplayName: string;
  parentEntryId: string | null;
  createdAt: string;
  attachmentBlobIds: string[];
}

export type TimelineStreamPage = PagedResult<TimelineStreamEntry>;
