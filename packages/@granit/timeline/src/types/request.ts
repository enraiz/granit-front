import type { TimelineEntryTypeValue } from './entry-type.js';

// --- API request types ---

export interface CreateTimelineEntryRequest {
  entryType: TimelineEntryTypeValue;
  body: string;
  parentEntryId?: string;
  attachmentBlobIds?: string[];
}

// --- Pagination ---

export interface TimelineQueryParams {
  skip?: number;
  take?: number;
}
