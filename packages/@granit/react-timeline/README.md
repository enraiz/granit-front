# @granit/react-timeline

React bindings for `@granit/timeline` -- TimelineProvider, useTimeline, useTimelineActions,
useTimelineFollowers.

## Installation

```bash
pnpm add @granit/react-timeline
```

## API

### Components

- `TimelineProvider` -- provides timeline configuration to the component tree

### Hooks

- `useTimelineConfig()` -- access timeline configuration from context
- `useTimeline(options)` -- fetch timeline entries for an entity
- `useTimelineActions(options)` -- manage timeline actions (add comment, add note)
- `useTimelineFollowers(options)` -- manage entity followers (follow, unfollow, list)

### Types

- `TimelineProviderProps` -- props for `TimelineProvider`
- `UseTimelineOptions`, `UseTimelineReturn` -- timeline hook types
- `UseTimelineActionsOptions`, `UseTimelineActionsReturn` -- actions hook types
- `UseTimelineFollowersOptions`, `UseTimelineFollowersReturn` -- followers hook types

## Usage

```tsx
import { TimelineProvider, useTimeline, useTimelineActions } from '@granit/react-timeline';

function App() {
  return (
    <TimelineProvider config={{ basePath: '/api/timeline' }}>
      <EntityTimeline entityId="123" />
    </TimelineProvider>
  );
}

function EntityTimeline({ entityId }: { entityId: string }) {
  const { data: entries } = useTimeline({ entityId });
  const { addComment } = useTimelineActions({ entityId });

  return (
    <div>
      {entries?.map((entry) => (
        <div key={entry.id}>{entry.content}</div>
      ))}
    </div>
  );
}
```

## License

Apache-2.0
