# @granit/react-notifications-web-push

React bindings for `@granit/notifications-web-push` -- useWebPush hook.

## Installation

```bash
pnpm add @granit/react-notifications-web-push
```

## API

### Hooks

- `useWebPush(config)` -- manage Web Push VAPID subscription (permission, subscribe, unsubscribe)

### Types

- `WebPushConfig` -- configuration for Web Push (VAPID public key, server endpoint)
- `UseWebPushReturn` -- return type of `useWebPush`

## Usage

```tsx
import { useWebPush } from '@granit/react-notifications-web-push';

function PushSettings() {
  const { permission, subscribe, unsubscribe } = useWebPush({
    vapidPublicKey: 'BExample...',
    basePath: '/api/notifications',
  });

  return (
    <button onClick={permission === 'granted' ? unsubscribe : subscribe}>
      {permission === 'granted' ? 'Disable' : 'Enable'} notifications
    </button>
  );
}
```

## License

Apache-2.0
