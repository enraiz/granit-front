# @granit/notifications-web-push

Gestion des abonnements Web Push VAPID pour `@granit/notifications`. Fournit le hook `useWebPush` pour demander la permission, s'abonner et se désabonner des notifications push navigateur.

## Pourquoi

- Notifications push même quand l'onglet est fermé (via Service Worker)
- Standard W3C Push API + VAPID (pas de dépendance propriétaire)
- Gestion complète du cycle de vie : permission → abonnement → synchronisation backend

## Utilisation

```tsx
import { useWebPush } from '@granit/notifications-web-push';

function PushSettings() {
  const { isSupported, permission, isSubscribed, loading, error, subscribe, unsubscribe } =
    useWebPush({
      vapidPublicKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
      apiClient,
      basePath: '/api/v1',
    });

  if (!isSupported) return <p>Notifications push non supportées par ce navigateur.</p>;

  return (
    <button onClick={isSubscribed ? unsubscribe : subscribe} disabled={loading}>
      {isSubscribed ? 'Désactiver' : 'Activer'} les notifications push
    </button>
  );
}
```

## API

### `useWebPush(config): UseWebPushReturn`

#### `WebPushConfig`

| Propriété           | Type            | Défaut      | Description                          |
| ------------------- | --------------- | ----------- | ------------------------------------ |
| `vapidPublicKey`    | `string`        | —           | Clé publique VAPID (URL-safe Base64) |
| `apiClient`         | `AxiosInstance` | —           | Instance Axios pour les appels REST  |
| `basePath`          | `string`        | `'/api/v1'` | Préfixe des endpoints REST           |
| `serviceWorkerPath` | `string`        | `'/sw.js'`  | Chemin du Service Worker             |

#### Résultat

| Propriété      | Type                     | Description                               |
| -------------- | ------------------------ | ----------------------------------------- |
| `isSupported`  | `boolean`                | `true` si le navigateur supporte Web Push |
| `permission`   | `NotificationPermission` | `'default'` \| `'granted'` \| `'denied'`  |
| `isSubscribed` | `boolean`                | `true` si un abonnement push actif existe |
| `loading`      | `boolean`                | `true` pendant subscribe/unsubscribe      |
| `error`        | `Error \| null`          | Dernière erreur                           |
| `subscribe`    | `() => Promise<void>`    | Demande la permission et s'abonne         |
| `unsubscribe`  | `() => Promise<void>`    | Se désabonne                              |

### Cycle de vie `subscribe()`

1. Appelle `Notification.requestPermission()`
2. Enregistre le Service Worker (`navigator.serviceWorker.register`)
3. Attend `navigator.serviceWorker.ready`
4. Appelle `pushManager.subscribe()` avec la clé VAPID
5. Envoie l'objet `PushSubscription` au backend via `POST /notifications/push-subscriptions`

### Cycle de vie `unsubscribe()`

1. Récupère l'abonnement existant via `pushManager.getSubscription()`
2. Notifie le backend via `DELETE /notifications/push-subscriptions`
3. Appelle `subscription.unsubscribe()`

## Service Worker

Le package gère uniquement le cycle de vie de l'abonnement. L'affichage des notifications push (titre, body, icône, action au clic) est du code **applicatif** dans le Service Worker.

Exemple minimal de Service Worker (`public/sw.js`) :

```javascript
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'Notification', {
      body: data.body,
      icon: '/icon-192.png',
      data: { url: data.url },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url;
  if (url) {
    event.waitUntil(clients.openWindow(url));
  }
});
```

## API REST consommée

| Méthode  | Endpoint                            | Description                     |
| -------- | ----------------------------------- | ------------------------------- |
| `POST`   | `/notifications/push-subscriptions` | Enregistrer un abonnement VAPID |
| `DELETE` | `/notifications/push-subscriptions` | Supprimer un abonnement         |

## Sécurité

- Le payload push envoyé par le backend est **wake-up only** — pas de PII dans le payload push (conformité ISO 27001)
- La clé VAPID publique n'est pas un secret — elle peut être exposée dans les variables d'environnement frontend

## Peer dependencies

- `@granit/notifications` workspace:\* — Package core
- `axios` — Instance Axios pour les appels REST
- `react` ^19.0.0

## Voir aussi

- [notifications.md](notifications.md) — Package core
- [notifications-mobile-push.md](notifications-mobile-push.md) — Push natif (Capacitor)
