import type { AxiosInstance } from 'axios';

// --- Entry types (mirror Granit.Timeline .NET enum) ---

export const TimelineEntryType = {
  Comment: 0,
  InternalNote: 1,
  SystemLog: 2,
} as const;

export type TimelineEntryTypeValue =
  (typeof TimelineEntryType)[keyof typeof TimelineEntryType];

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
}

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

// --- Provider config ---

export interface TimelineConfig {
  apiClient: AxiosInstance;
  basePath: string;
}

// --- Mention suggestion ---

export interface MentionSuggestion {
  id: string;
  displayName: string;
}
