import type { TimelineEntryTypeValue } from './entry-type.js';
import type { PaginationParams } from '@granit/querying';

// --- API request types ---

export interface CreateTimelineEntryRequest {
  entryType: TimelineEntryTypeValue;
  body: string;
  parentEntryId?: string;
  attachmentBlobIds?: string[];
}

// --- Pagination ---

export type TimelineQueryParams = PaginationParams;
