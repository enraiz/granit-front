# @granit/react-notifications

React bindings for `@granit/notifications` -- NotificationProvider, hooks.

## Installation

```bash
pnpm add @granit/react-notifications
```

## API

### Components

- `NotificationProvider` -- provides notification configuration and transport to the component tree

### Hooks

- `useNotificationContext()` -- access notification configuration from context
- `useNotifications(options?)` -- fetch paginated notifications
- `useUnreadCount(options?)` -- fetch unread notification count
- `useRealTimeNotifications()` -- subscribe to real-time notifications via configured transport
- `useEntityActivityFeed(options)` -- fetch activity feed for a specific entity
- `useNotificationPreferences()` -- manage user notification preferences

### Types

- `UseNotificationsOptions`, `UseNotificationsReturn` -- notification list hook types
- `UseUnreadCountOptions`, `UseUnreadCountReturn` -- unread count hook types
- `UseRealTimeNotificationsReturn` -- real-time hook return type
- `UseEntityActivityFeedOptions`, `UseEntityActivityFeedReturn` -- activity feed hook types
- `UseNotificationPreferencesReturn` -- preferences hook return type

## Usage

```tsx
import {
  NotificationProvider,
  useNotifications,
  useUnreadCount,
} from '@granit/react-notifications';

function App() {
  return (
    <NotificationProvider transport={signalRTransport}>
      <NotificationBell />
    </NotificationProvider>
  );
}

function NotificationBell() {
  const { data: count } = useUnreadCount();
  const { data: notifications } = useNotifications();

  return <span>Notifications ({count})</span>;
}
```

## License

Apache-2.0
