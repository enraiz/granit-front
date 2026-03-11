# @granit/notifications-sse

Transport SSE (Server-Sent Events) pour `@granit/notifications`. Fournit la factory `createSseTransport` qui implémente l'interface `NotificationTransport`.

## Pourquoi

- Léger (~2 kB vs ~40 kB pour SignalR)
- Support natif .NET 10 (pas de hub à configurer côté backend)
- Reconnexion automatique via `@microsoft/fetch-event-source`
- Token d'authentification injecté à chaque reconnexion

## Installation

Le package est une peer dependency — l'app consommatrice installe `@microsoft/fetch-event-source` :

```bash
pnpm add @microsoft/fetch-event-source
```

## Utilisation

```tsx
import { NotificationProvider } from '@granit/notifications';
import { createSseTransport } from '@granit/notifications-sse';

const transport = createSseTransport({
  streamUrl: '/api/v1/notifications/stream',
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

### `createSseTransport(config): NotificationTransport`

Factory qui retourne un objet `NotificationTransport`.

#### `SseTransportConfig`

| Propriété           | Type                            | Défaut            | Description                                               |
| ------------------- | ------------------------------- | ----------------- | --------------------------------------------------------- |
| `streamUrl`         | `string`                        | —                 | URL du endpoint SSE (ex : `/api/v1/notifications/stream`) |
| `tokenGetter`       | `() => Promise<string \| null>` | —                 | Fournit le JWT (optionnel)                                |
| `heartbeatTypeName` | `string`                        | `'__heartbeat__'` | Nom d'événement des heartbeats (filtré automatiquement)   |

### Détails d'implémentation

- Utilise `@microsoft/fetch-event-source` pour la reconnexion automatique
- Authentification via un wrapper `fetch` custom — le `tokenGetter` est appelé à chaque tentative de connexion/reconnexion pour injecter le header `Authorization: Bearer {token}`
- Les messages heartbeat (événement `__heartbeat__` par défaut) sont filtrés
- Les messages JSON malformés sont ignorés silencieusement
- Erreurs HTTP 4xx (sauf 429) → arrêt fatal ; autres erreurs → reconnexion
- `openWhenHidden: true` — la connexion persiste même quand l'onglet est en arrière-plan

### Endpoint SSE backend

| URL           | Content-Type        | Format                   | Heartbeat                 |
| ------------- | ------------------- | ------------------------ | ------------------------- |
| `{streamUrl}` | `text/event-stream` | JSON (`NotificationDto`) | Événement `__heartbeat__` |

## SignalR vs SSE

| Critère        | SignalR              | SSE                               |
| -------------- | -------------------- | --------------------------------- |
| Taille client  | ~40 kB               | ~2 kB                             |
| Bidirectionnel | Oui                  | Non (serveur → client uniquement) |
| Reconnexion    | Intégrée             | Via `fetch-event-source`          |
| Backend .NET   | Hub dédié            | Support natif .NET 10             |
| Protocole      | WebSocket + fallback | HTTP/1.1 ou HTTP/2                |

Les deux transports sont **mutuellement exclusifs** — un seul `transport` par `NotificationProvider`.

## Peer dependencies

- `@granit/notifications` workspace:\* — Package core
- `@microsoft/fetch-event-source` >=2.0.0 — Client SSE avec reconnexion

## Voir aussi

- [notifications.md](notifications.md) — Package core
- [notifications-signalr.md](notifications-signalr.md) — Alternative SignalR (mutuellement exclusif)
