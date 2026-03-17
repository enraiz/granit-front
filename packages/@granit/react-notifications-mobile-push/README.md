# @granit/react-notifications-mobile-push

React bindings for `@granit/notifications-mobile-push` -- useMobilePush hook.

## Installation

```bash
pnpm add @granit/react-notifications-mobile-push
```

## API

### Hooks

- `useMobilePush(config)` -- manage mobile push notification registration via Capacitor (FCM/APNs)

### Types

- `MobilePushConfig` -- configuration for mobile push (server endpoint, device info)
- `UseMobilePushReturn` -- return type of `useMobilePush`

## Usage

```tsx
import { useMobilePush } from '@granit/react-notifications-mobile-push';

function PushSettings() {
  const { isRegistered, register, unregister } = useMobilePush({
    basePath: '/api/notifications',
  });

  return (
    <button onClick={isRegistered ? unregister : register}>
      {isRegistered ? 'Disable' : 'Enable'} push notifications
    </button>
  );
}
```

## License

Apache-2.0
