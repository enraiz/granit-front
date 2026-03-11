# @granit/notifications-signalr

Transport SignalR pour `@granit/notifications`. Fournit la factory `createSignalRTransport` qui implémente l'interface `NotificationTransport`.

## Pourquoi

- Compatibilité native avec le backend ASP.NET Core (hubs SignalR)
- Reconnexion automatique intégrée
- Fallback de transport : WebSocket → LongPolling
- Protocole structuré : invocation de méthodes nommées

## Installation

Le package est une peer dependency — l'app consommatrice installe `@microsoft/signalr` :

```bash
pnpm add @microsoft/signalr
```

## Utilisation

```tsx
import { NotificationProvider } from '@granit/notifications';
import { createSignalRTransport } from '@granit/notifications-signalr';

const transport = createSignalRTransport({
  hubUrl: '/hubs/notifications',
  tokenGetter: async () => keycloak.token ?? null,
});

function App() {
  return (
    <NotificationProvider config={{ apiClient }} transport={transport}>
      <Dashboard />
    </NotificationProvider>
  );
}
```

## API

### `createSignalRTransport(config): NotificationTransport`

Factory qui retourne un objet `NotificationTransport`.

#### `SignalRTransportConfig`

| Propriété     | Type                            | Description                                        |
| ------------- | ------------------------------- | -------------------------------------------------- |
| `hubUrl`      | `string`                        | URL du hub SignalR (ex : `/hubs/notifications`)    |
| `tokenGetter` | `() => Promise<string \| null>` | Fournit le JWT pour l'authentification (optionnel) |

### Détails d'implémentation

- Transport : WebSockets (prioritaire) avec fallback LongPolling
- Écoute l'événement `ReceiveNotification` sur le hub
- Gère les états `reconnecting`, `reconnected`, `onclose` automatiquement
- Le `tokenGetter` est appelé via `accessTokenFactory` de SignalR — le token est rafraîchi à chaque reconnexion

### Hub SignalR

| URL        | Événement             | Direction        | Payload           |
| ---------- | --------------------- | ---------------- | ----------------- |
| `{hubUrl}` | `ReceiveNotification` | Serveur → Client | `NotificationDto` |

## Peer dependencies

- `@granit/notifications` workspace:\* — Package core
- `@microsoft/signalr` >=8.0.0 — Client SignalR

## Voir aussi

- [notifications.md](notifications.md) — Package core
- [notifications-sse.md](notifications-sse.md) — Alternative SSE (mutuellement exclusif)
- ADR-006 — Déplacé vers guava-front (ADR-001) : le choix du transport est une décision applicative
