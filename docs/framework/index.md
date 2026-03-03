<p align="center">
  <img src="../images/granit-logo.svg" alt="granit" width="160" />
</p>

# Granit-front — Documentation framework

Documentation de référence de chaque module du framework.

| Document | Description |
| --- | --- |
| [logger.md](logger.md) | Factory de loggers configurables, niveaux par environnement |
| [utils.md](utils.md) | Utilitaires : classes CSS Tailwind (`cn`), formatage de dates et nombres |
| [api-client.md](api-client.md) | Factory Axios, intercepteur Bearer token, gestion 401/403, types de réponse (`PaginatedResponse`, `ProblemDetails`) |
| [auth.md](auth.md) | Authentification Keycloak : hook d'init, factory de contexte React typé, mock provider, type `KeycloakUserInfo` |
| [timeline.md](timeline.md) | Flux d'activité unifié : commentaires, notes, threading, @mentions, follow/unfollow |
| [workflow.md](workflow.md) | Gestion du cycle de vie : barre de statut, transitions, historique d'audit HDS |
| [notifications.md](notifications.md) | Centre de notifications temps-réel (SignalR), boîte de réception, badge, fil d'activité, préférences |
| [querying.md](querying.md) | Grille de données Odoo-like : SmartFilterBar, filtres, presets, tri, pagination, group-by, vues sauvegardées |
