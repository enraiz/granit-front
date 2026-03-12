# ADR-005 — Keycloak comme provider d'authentification

- **Statut** : Accepte
- **Date** : 2026-02-27

## Contexte

La plateforme Guava opere dans un contexte d'hebergement de donnees de sante
(HDS) qui impose des exigences strictes en matiere d'authentification :

- **OpenID Connect / OAuth 2.0** : protocoles standards requis
- **Audit complet** : traçabilite des connexions et des sessions
- **Multi-tenant** : isolation des realms par tenant
- **Conformite HDS** : le provider doit pouvoir etre heberge en France, sur
  infrastructure privee (pas de cloud US)
- **Open source** : pas de lock-in commercial

Les alternatives evaluees :

- **Auth0** : SaaS heberge aux US, non conforme HDS
- **Azure AD B2C** : cloud Microsoft, dependance Azure
- **Keycloak** : open source (Apache 2.0), auto-heberge, protocoles standards,
  large communaute

## Decision

Utiliser **Keycloak** comme provider d'authentification via les packages
`@granit/authentication` (types), `@granit/react-authentication` (hooks React)
et `@granit/react-authorization` (permissions RBAC). Les packages encapsulent
`keycloak-js` et exposent :

- Un contexte React d'authentification (`BaseAuthContextType` dans `@granit/authentication`)
- Des hooks d'integration (`useAuth`, `useKeycloakInit` dans `@granit/react-authentication` ;
  `usePermissions`, `usePermissionDefinitions`, `useRolePermissions` dans `@granit/react-authorization`)
- Un mock provider pour les tests et le developpement local (`@granit/react-authentication`)
- Un intercepteur 401 pour la gestion des sessions revoquees

Le `BaseAuthContextType` est une interface extensible : les applications
ajoutent leurs propres champs (`register` pour guava-front, `hasAdminRole`
pour guava-admin).

## Consequences

### Positives

- **Conformite HDS** : Keycloak est auto-heberge sur infrastructure privee
  europeenne
- **Standards** : OpenID Connect, OAuth 2.0, SAML 2.0 supportes nativement
- **Extensibilite** : themes, SPIs, federation d'identite
- **Communaute** : projet CNCF, maintenance active (Red Hat)
- **Isolation** : un realm par tenant, pas de donnees partagees

### Negatives

- **Operations** : Keycloak doit etre deploye et maintenu (mises a jour,
  backup des realms, monitoring)
- **Complexite** : la configuration des realms, clients et roles est non
  triviale
- **`keycloak-js`** : la bibliotheque client officielle a des API parfois
  instables entre versions majeures
