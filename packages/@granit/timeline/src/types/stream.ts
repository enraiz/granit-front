import type { TimelineEntryTypeValue } from './entry-type.js';

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

export interface TimelineStreamPage {
  items: TimelineStreamEntry[];
  totalCount: number;
  /** Opaque cursor for next page (always null for offset pagination). */
  nextCursor: string | null;
}
