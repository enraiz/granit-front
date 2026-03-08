# ADR-010 — Pagination centralisee dans @granit/querying

- **Statut** : Accepte
- **Date** : 2026-03-08

## Contexte

Avant cette decision, la pagination etait implementee de maniere heterogene
dans les differents packages :

- `@granit/querying` utilisait `skip`/`take` dans certains hooks
- `@granit/notifications` et `@granit/timeline` implementaient leur propre
  logique de pagination
- Le backend .NET avait standardise sur `PagedResult<T>` avec `page`/`pageSize`

Cette heterogeneite causait :

- Des conversions `skip`/`take` ↔ `page`/`pageSize` a chaque couche
- Des bugs subtils de pagination (off-by-one, pages vides)
- Une duplication de logique entre packages

## Decision

Centraliser la pagination dans `@granit/querying` en adoptant le modele
`page`/`pageSize` aligne avec le `PagedResult<T>` du backend .NET.

Le type `PagedResult<T>` dans `@granit/api-client` definit le contrat :

```typescript
type PagedResult<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
};
```

Les packages `@granit/notifications` et `@granit/timeline` dependent de
`@granit/querying` pour la pagination, plutot que de reimplementer leur
propre logique.

## Consequences

### Positives

- **Coherence** : un seul modele de pagination dans tout le framework,
  aligne avec le backend
- **Moins de conversions** : les DTOs frontend et backend utilisent les
  memes noms de champs (`page`, `pageSize`, `totalCount`, `totalPages`)
- **Reutilisation** : les hooks de pagination de `@granit/querying` sont
  reutilises par `@granit/notifications` et `@granit/timeline`
- **Maintenabilite** : un seul endroit a corriger en cas de bug de pagination

### Negatives

- **Dependance supplementaire** : `@granit/notifications` et
  `@granit/timeline` dependent desormais de `@granit/querying`
- **Breaking change** : la migration de `skip`/`take` vers `page`/`pageSize`
  necessite des mises a jour dans les applications consommatrices
- **Couplage** : les packages metier sont couples a l'implementation de
  pagination de `@granit/querying`
