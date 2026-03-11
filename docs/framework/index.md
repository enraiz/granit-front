<p align="center">
  <img src="../images/granit-logo.svg" alt="granit" width="160" />
</p>

# Granit-front — Documentation framework

Documentation de référence de chaque module du framework.

| Document                               | Description                                                                                                         |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [logger.md](logger.md)                 | Factory de loggers configurables, transport OTLP, niveaux par environnement                                         |
| [utils.md](utils.md)                   | Utilitaires : classes CSS Tailwind (`cn`), formatage de dates et nombres                                            |
| [api-client.md](api-client.md)         | Factory Axios, intercepteur Bearer token, gestion 401/403, types de réponse (`PaginatedResponse`, `ProblemDetails`) |
| [storage.md](storage.md)               | Abstraction `localStorage`/`sessionStorage` avec préfixe et accesseurs typés                                        |
| [localization.md](localization.md)     | Résolution de locale, chargement de traductions i18next                                                             |
| [auth.md](auth.md)                     | Authentification Keycloak, hooks de permissions (utilisateur et administration)                                     |
| [tracing.md](tracing.md)               | Tracing distribué OpenTelemetry : provider, spans, corrélation log-trace                                            |
| [error-boundary.md](error-boundary.md) | Capture structurée des erreurs : error boundary, capture globale, breadcrumbs                                       |
| [idempotency.md](idempotency.md)       | Injection automatique du header `Idempotency-Key` sur les requêtes de mutation                                      |
| [timeline.md](timeline.md)             | Flux d'activité unifié : commentaires, notes, threading, @mentions, follow/unfollow                                 |
| [workflow.md](workflow.md)             | Gestion du cycle de vie : barre de statut, transitions, historique d'audit HDS                                      |
| [notifications.md](notifications.md)   | Centre de notifications temps-réel (SignalR), boîte de réception, badge, fil d'activité, préférences                |
| [querying.md](querying.md)             | Grille de données Odoo-like : SmartFilterBar, filtres, presets, tri, pagination, group-by, vues sauvegardées        |
| [data-exchange.md](data-exchange.md)   | Import/export tabulaire : définitions, presets, mapping colonnes, rapports d'erreurs                                |
| [cookies.md](cookies.md)               | Abstraction RGPD de consentement cookies : contexte React, hook, interface CMP-agnostique                           |
| [cookies-klaro.md](cookies-klaro.md)   | Adaptateur Klaro pour `@granit/cookies` : factory, configuration statique/dynamique                                 |
| [orval.md](orval.md)                   | Génération de clients API TypeScript à partir d'OpenAPI                                                             |
