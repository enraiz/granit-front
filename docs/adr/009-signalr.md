# ADR-009 — SignalR pour les notifications temps reel

- **Statut** : Accepte
- **Date** : 2026-03-02

## Contexte

Le module de notifications (`@granit/notifications`) necessite une connexion
temps reel bidirectionnelle entre le frontend et le backend .NET pour :

- Recevoir les notifications push instantanement
- Mettre a jour le compteur de notifications non lues
- Synchroniser le flux d'activite d'une entite entre onglets

Les alternatives evaluees :

- **WebSocket brut** : bas niveau, pas de reconnexion automatique, pas de
  fallback (long polling, SSE), protocole de serialisation a definir
- **Socket.IO** : populaire dans l'ecosysteme Node.js, mais necessite un
  serveur Socket.IO cote backend — incompatible avec le backend .NET existant
- **SignalR** : bibliotheque Microsoft integree a ASP.NET Core, reconnexion
  automatique, fallback WebSocket → SSE → long polling, serialisation JSON
  ou MessagePack

## Decision

Utiliser **SignalR** (`@microsoft/signalr >=8.0.0`) dans le package
`@granit/notifications` pour la communication temps reel.

Le package expose :

- Un `SignalRProvider` qui gere le cycle de vie de la connexion
  (`HubConnectionBuilder`)
- Les hooks `useRealTimeNotifications`, `useUnreadCount`,
  `useEntityActivityFeed` qui s'abonnent aux evenements SignalR
- Une prop `enabled` pour desactiver la connexion SignalR (utile en mode
  mock ou dans les tests)

## Consequences

### Positives

- **Compatibilite native** avec le backend ASP.NET Core (hubs SignalR deja
  implementes)
- **Reconnexion automatique** : SignalR gere les deconnexions et les retries
- **Fallback de transport** : WebSocket → SSE → long polling, sans
  configuration supplementaire
- **Protocole structure** : invocation de methodes nommees, pas de messages
  bruts a parser
- **Performance** : support optionnel de MessagePack pour la serialisation
  binaire

### Negatives

- **Ecosysteme Microsoft** : dependance a `@microsoft/signalr`, couplage
  indirect a l'ecosysteme .NET
- **Taille** : ~40 kB gzip pour le client JavaScript
- **Debugging** : les messages SignalR sont plus difficiles a inspecter dans
  les DevTools navigateur qu'un WebSocket brut
