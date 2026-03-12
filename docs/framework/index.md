<p align="center">
  <img src="../images/granit-logo.svg" alt="granit" width="160" />
</p>

# Granit-front — Documentation framework

Documentation de référence de chaque module du framework.

| Document                                                     | Description                                                                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| [logger.md](logger.md)                                       | Factory de loggers configurables, transport OTLP, niveaux par environnement                                         |
| [utils.md](utils.md)                                         | Utilitaires : classes CSS Tailwind (`cn`), formatage de dates et nombres                                            |
| [api-client.md](api-client.md)                               | Factory Axios, intercepteur Bearer token, gestion 401/403, types de réponse (`PaginatedResponse`, `ProblemDetails`) |
| [storage.md](storage.md)                                     | Abstraction `localStorage`/`sessionStorage` avec préfixe et accesseurs typés                                        |
| [localization.md](localization.md)                           | Résolution de locale, chargement de traductions i18next                                                             |
| [auth.md](auth.md)                                           | Authentification Keycloak, hooks de permissions (utilisateur et administration)                                     |
| [tracing.md](tracing.md)                                     | Tracing distribué OpenTelemetry : provider, spans, corrélation log-trace                                            |
| [error-boundary.md](error-boundary.md)                       | Capture structurée des erreurs : error boundary, capture globale, breadcrumbs                                       |
| [idempotency.md](idempotency.md)                             | Injection automatique du header `Idempotency-Key` sur les requêtes de mutation                                      |
| [timeline.md](timeline.md)                                   | Flux d'activité unifié : commentaires, notes, threading, @mentions, follow/unfollow                                 |
| [workflow.md](workflow.md)                                   | Gestion du cycle de vie : barre de statut, transitions, historique d'audit ISO 27001                                |
| [notifications.md](notifications.md)                         | Centre de notifications transport-agnostique, boîte de réception, badge, fil d'activité, préférences                |
| [notifications-signalr.md](notifications-signalr.md)         | Transport SignalR pour les notifications temps-réel                                                                 |
| [notifications-sse.md](notifications-sse.md)                 | Transport SSE pour les notifications temps-réel                                                                     |
| [notifications-web-push.md](notifications-web-push.md)       | Abonnement Web Push VAPID (permission, subscribe, unsubscribe)                                                      |
| [notifications-mobile-push.md](notifications-mobile-push.md) | Enregistrement token FCM/APNs via Capacitor                                                                         |
| [querying.md](querying.md)                                   | Grille de données headless : SmartFilterBar, filtres, presets, tri, pagination, group-by, vues sauvegardées         |
| [data-exchange.md](data-exchange.md)                         | Import/export tabulaire : définitions, presets, mapping colonnes, rapports d'erreurs                                |
| [cookies.md](cookies.md)                                     | Abstraction RGPD de consentement cookies : contexte React, hook, interface CMP-agnostique                           |
| [cookies-klaro.md](cookies-klaro.md)                         | Adaptateur Klaro pour `@granit/cookies` : factory, configuration statique/dynamique                                 |
| [orval.md](orval.md)                                         | Génération de clients API TypeScript à partir d'OpenAPI                                                             |
