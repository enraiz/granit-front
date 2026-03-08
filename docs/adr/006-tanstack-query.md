# ADR-006 — TanStack Query pour le data fetching

- **Statut** : Accepte
- **Date** : 2026-03-04

## Contexte

Les packages `@granit/querying` et `@granit/data-exchange` necessitent une
couche de data fetching avec :

- **Cache intelligent** : eviter les requetes dupliquees, invalidation ciblee
- **Pagination** : support natif de la pagination curseur et page/pageSize
- **Mutations** : gestion optimiste des mises a jour
- **Retry et refetch** : resilience aux erreurs reseau
- **DevTools** : inspection du cache en developpement

Les alternatives evaluees :

- **SWR** (Vercel) : plus simple mais moins riche — pas de mutations
  structurees, pas de query keys typees, DevTools limites
- **Solution custom** (hooks maison + `useState`/`useEffect`) : maintenable
  pour des cas simples, mais reinventer le cache, la deduplication, la
  pagination et l'invalidation est un effort considerable avec des risques
  de bugs subtils
- **TanStack Query** (ex React Query) : API riche, query keys typees,
  mutations avec invalidation, DevTools complets, large adoption

## Decision

Utiliser **TanStack Query v5** (`@tanstack/react-query ^5.0.0`) comme couche
de data fetching dans les packages qui en ont besoin. La dependance est
declaree en `peerDependencies` :

```json
{
  "peerDependencies": {
    "@tanstack/react-query": "^5.0.0"
  }
}
```

Les hooks publics (`useQueryEndpoint`, `useSavedViews`, `useExportJob`, etc.)
encapsulent les appels `useQuery` et `useMutation` de TanStack Query.

## Consequences

### Positives

- **Cache partage** : toutes les queries de l'application partagent le meme
  `QueryClient`, permettant l'invalidation croisee
- **Query keys structurees** : les factories de cles (`queryKeyFactory`)
  garantissent la coherence des cles entre hooks
- **Mutations typees** : `useMutation` avec `onSuccess` / `onError` / `onSettled`
  pour les flux metier (export, import, transition workflow)
- **DevTools** : inspection du cache, replay de queries en developpement
- **Ecosysteme** : compatible avec Orval pour la generation automatique de hooks

### Negatives

- **Peer dependency** : les applications doivent installer et configurer
  `@tanstack/react-query` (QueryClientProvider)
- **Taille du bundle** : ~13 kB gzip (acceptable pour une application SPA)
- **Courbe d'apprentissage** : les concepts de stale time, gc time, invalidation
  et query keys peuvent etre complexes pour les nouveaux contributeurs
