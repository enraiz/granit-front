# ADR-004 — Packages headless (hooks-only, UI dans les apps consommatrices)

- **Statut** : Accepte
- **Date** : 2026-03-06

## Contexte

Initialement, le monorepo contenait des packages `@granit/ui` et
`@granit/ui-back` qui exposaient des composants React UI (boutons, modales,
tables, etc.) aux cotes des hooks metier. Cette approche posait plusieurs
problemes :

- **Couplage fort** entre la logique metier et la presentation visuelle
- **Divergence de design** : guava-front et guava-admin utilisent des design
  systems differents (composants, tokens, espacement)
- **Duplication** : chaque application finissait par wrapper les composants
  `@granit/ui` pour les adapter a son design system
- **Dependances UI lourdes** : Tailwind CSS, lucide-react, shadcn/ui devaient
  etre alignes entre le framework et les applications

Le refactoring `rendre les packages headless et supprimer @granit/ui`
(2026-03-06) a elimine cette couche UI du framework.

## Decision

Les packages `@granit/*` sont strictement **headless** : ils exposent
uniquement des hooks, types, providers et fonctions utilitaires. Aucun
composant React (JSX) n'est exporte par le framework.

Les composants UI vivent exclusivement dans les applications consommatrices :

- `guava-front` : composants avec le design system DSFR/HDS
- `guava-admin` : composants avec le design system admin (shadcn/ui)

## Consequences

### Positives

- **Separation nette** entre logique (framework) et presentation (application)
- **Liberte de design** : chaque application choisit son design system sans
  contrainte du framework
- **Moins de dependances** : les packages n'ont plus besoin de Tailwind,
  lucide-react, ni d'aucune bibliotheque de composants
- **Tests simplifies** : tester des hooks est plus simple que tester des
  composants (pas de DOM, pas de styles)
- **API stable** : l'interface publique est un contrat TypeScript (types +
  signatures de hooks), independante du rendu visuel

### Negatives

- **Duplication de composants** : les deux applications implementent leurs
  propres composants de table, modale d'export, etc.
- **Pas de coherence UI inter-apps** : le framework ne garantit pas
  l'homogeneite visuelle entre les applications
- **Effort initial** : chaque nouvelle application doit implementer la couche
  UI pour chaque package `@granit/*` utilise
