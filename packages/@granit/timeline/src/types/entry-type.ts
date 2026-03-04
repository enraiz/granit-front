// --- Entry types (mirror Granit.Timeline .NET enum) ---

export const TimelineEntryType = {
  Comment: 0,
  InternalNote: 1,
  SystemLog: 2,
} as const;

export type TimelineEntryTypeValue =
  (typeof TimelineEntryType)[keyof typeof TimelineEntryType];
