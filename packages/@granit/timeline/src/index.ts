// Types
export {
  TimelineEntryType,
  type TimelineEntryTypeValue,
  type TimelineStreamEntry,
  type TimelineStreamPage,
  type CreateTimelineEntryRequest,
  type TimelineQueryParams,
  type TimelineConfig,
  type MentionSuggestion,
} from './types/index.js';

// Provider
export { TimelineProvider, useTimelineConfig } from './providers/timeline-provider.js';
export type { TimelineProviderProps } from './providers/timeline-provider.js';

// Hooks
export { useTimeline } from './hooks/use-timeline.js';
export type { UseTimelineOptions, UseTimelineResult } from './hooks/use-timeline.js';

export { useTimelineActions } from './hooks/use-timeline-actions.js';
export type { UseTimelineActionsOptions, UseTimelineActionsResult } from './hooks/use-timeline-actions.js';

export { useTimelineFollowers } from './hooks/use-timeline-followers.js';
export type { UseTimelineFollowersOptions, UseTimelineFollowersResult } from './hooks/use-timeline-followers.js';

// Components
export { TimelineStream } from './components/timeline-stream.js';
export type { TimelineStreamProps } from './components/timeline-stream.js';

export { TimelineEntry } from './components/timeline-entry.js';
export type { TimelineEntryProps } from './components/timeline-entry.js';

export { TimelineComposer } from './components/timeline-composer.js';
export type { TimelineComposerProps } from './components/timeline-composer.js';
