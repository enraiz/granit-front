# @granit/notifications-mobile-push

Gestion des tokens FCM/APNs pour les notifications push natives via Capacitor. Fournit le hook `useMobilePush` pour enregistrer et désenregistrer le token de l'appareil auprès du backend.

## Pourquoi

- Notifications push natives (Android via FCM, iOS via APNs)
- Gestion du cycle de vie du token : permission → enregistrement → rafraîchissement automatique
- Synchronisation token ↔ backend REST

## Installation

Le package est une peer dependency — l'app consommatrice installe `@capacitor/push-notifications` :

```bash
pnpm add @capacitor/push-notifications
npx cap sync
```

> Ce package est destiné uniquement aux apps Capacitor (ex : guava-front). Les apps web pures (ex : guava-admin) ne l'installent pas.

## Utilisation

```tsx
import { useMobilePush } from '@granit/notifications-mobile-push';

function PushSettings() {
  const { isRegistered, loading, error, register, unregister } = useMobilePush({
    apiClient,
    platform: 'android', // ou 'ios'
    basePath: '/api/v1',
  });

  return (
    <button onClick={isRegistered ? unregister : register} disabled={loading}>
      {isRegistered ? 'Désactiver' : 'Activer'} les notifications push
    </button>
  );
}
```

## API

### `useMobilePush(config): UseMobilePushReturn`

#### `MobilePushConfig`

| Propriété   | Type                 | Défaut      | Description                         |
| ----------- | -------------------- | ----------- | ----------------------------------- |
| `apiClient` | `AxiosInstance`      | —           | Instance Axios pour les appels REST |
| `basePath`  | `string`             | `'/api/v1'` | Préfixe des endpoints REST          |
| `platform`  | `'android' \| 'ios'` | —           | Plateforme native                   |

#### Résultat

| Propriété      | Type                  | Description                                         |
| -------------- | --------------------- | --------------------------------------------------- |
| `isRegistered` | `boolean`             | `true` si le token est enregistré auprès du backend |
| `loading`      | `boolean`             | `true` pendant register/unregister                  |
| `error`        | `Error \| null`       | Dernière erreur                                     |
| `register`     | `() => Promise<void>` | Demande la permission et enregistre le token        |
| `unregister`   | `() => Promise<void>` | Supprime le token du backend                        |

### Cycle de vie `register()`

1. Vérifie les permissions via `PushNotifications.checkPermissions()`
2. Demande la permission si nécessaire via `PushNotifications.requestPermissions()`
3. Appelle `PushNotifications.register()` pour obtenir le token FCM/APNs
4. Envoie le token au backend via `POST /notifications/push-tokens`

### Rafraîchissement de token

Quand l'appareil reçoit un nouveau token (événement `registration` Capacitor), le hook :

1. Supprime l'ancien token du backend
2. Enregistre le nouveau token

Ce mécanisme est automatique tant que le hook est monté avec `isRegistered === true`.

## API REST consommée

| Méthode  | Endpoint                             | Description                 |
| -------- | ------------------------------------ | --------------------------- |
| `POST`   | `/notifications/push-tokens`         | Enregistrer un token device |
| `DELETE` | `/notifications/push-tokens/{token}` | Supprimer un token device   |

### `DeviceTokenDto`

```typescript
interface DeviceTokenDto {
  readonly token: string;
  readonly platform: 'android' | 'ios';
  readonly deviceId?: string;
}
```

## Sécurité

- Le payload push envoyé par le backend est **wake-up only** — pas de PII dans le payload push (conformité ISO 27001)
- Le token FCM/APNs est transmis uniquement au backend Granit, pas à des tiers

## Peer dependencies

- `@granit/notifications` workspace:\* — Package core
- `@capacitor/push-notifications` >=6.0.0 — Plugin Capacitor
- `axios` — Instance Axios pour les appels REST
- `react` ^19.0.0

## Voir aussi

- [notifications.md](notifications.md) — Package core
- [notifications-web-push.md](notifications-web-push.md) — Push navigateur (VAPID)
