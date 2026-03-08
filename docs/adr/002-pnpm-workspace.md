# ADR-002 — pnpm workspace monorepo

- **Statut** : Accepte
- **Date** : 2026-02-27

## Contexte

Le framework `granit-front` est compose de 16 packages avec des dependances
inter-packages. Il faut un gestionnaire de paquets capable de :

- Gerer un workspace multi-packages avec liens symboliques locaux
- Resoudre efficacement les dependances partagees (hoisting)
- Offrir des performances de resolution et d'installation rapides
- Supporter le protocole `workspace:*` pour les dependances internes

Les alternatives evaluees :

- **npm workspaces** : hoisting agressif pouvant creer des dependances
  fantomes, pas de `workspace:*`, performances inferieures
- **yarn (berry)** : Plug'n'Play (PnP) complexifie l'integration avec Vite et
  les outils TypeScript, zero-installs alourdissent le depot
- **pnpm** : store content-addressable, `node_modules` isoles par defaut,
  protocole `workspace:*` natif

## Decision

Utiliser **pnpm** comme gestionnaire de paquets exclusif pour le monorepo.

Configuration `pnpm-workspace.yaml` :

```yaml
packages:
  - 'packages/@granit/*'
```

Les dependances inter-packages utilisent `workspace:*` dans `peerDependencies` :

```json
{
  "peerDependencies": {
    "@granit/api-client": "workspace:*"
  }
}
```

## Consequences

### Positives

- **Isolation stricte** : pas de dependances fantomes grace au
  `node_modules` non-flat de pnpm
- **Performance** : store content-addressable partage entre projets, installation
  quasi-instantanee apres le premier run
- **`workspace:*`** : resolution automatique des packages locaux avec
  remplacement par la version reelle a la publication
- **`pnpm -r exec`** : execution de commandes sur tous les packages (lint, tsc)
- **`--filter`** : execution ciblee sur un package specifique
- **Compatibilite Vite** : fonctionne sans configuration supplementaire

### Negatives

- **Adoption** : pnpm est moins repandu que npm, ce qui peut surprendre les
  nouveaux contributeurs
- **Lock file** : `pnpm-lock.yaml` est incompatible avec les autres
  gestionnaires, imposant pnpm a tous les contributeurs
- **Overrides** : syntaxe propre a pnpm dans `package.json` (champ `pnpm.overrides`)
