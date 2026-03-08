# ADR-007 — Vitest comme runner de tests

- **Statut** : Accepte
- **Date** : 2026-02-27

## Contexte

Le monorepo a besoin d'un framework de tests unitaires capable de :

- Executer les tests TypeScript sans transpilation prealable
- Supporter les modules ESM (`"type": "module"` dans `package.json`)
- Offrir un mode watch performant pour le developpement
- Generer des rapports de couverture (lcov, html)
- Fonctionner dans un workspace pnpm multi-packages

Les alternatives evaluees :

- **Jest** : historiquement le standard, mais la compatibilite ESM est
  experimentale et instable. La configuration pour TypeScript source-direct
  necessite `ts-jest` ou `@swc/jest`, ajoutant de la complexite. Le mode
  watch est lent sur les grands workspaces
- **Vitest** : utilise le meme pipeline de transformation que Vite (esbuild),
  supporte nativement ESM et TypeScript, API compatible Jest, mode watch
  base sur le file system

## Decision

Utiliser **Vitest** (v4) comme framework de tests pour tous les packages
du monorepo :

```bash
pnpm test              # mode watch (developpement)
pnpm test:coverage     # couverture v8 (CI)
```

Les tests sont co-localises avec le code source :

- `src/**/*.test.ts` pour les tests unitaires simples
- `src/__tests__/` pour les suites de tests plus complexes

La couverture minimale cible est de 80% sur tout nouveau code.

## Consequences

### Positives

- **Zero configuration de transpilation** : Vitest utilise esbuild, comme
  Vite — les fichiers `.ts` sont transpiles a la volee
- **ESM natif** : pas de probleme avec `import`/`export`, `import.meta`, etc.
- **Performance** : execution parallele, mode watch base sur le file system
  (pas de polling)
- **API Jest-compatible** : `describe`, `it`, `expect`, `vi.fn()` — courbe
  d'apprentissage minimale pour les developpeurs venant de Jest
- **Coverage v8** : rapports lcov et html sans dependance supplementaire
- **Workspace-aware** : `vitest.workspace.ts` pour la configuration multi-packages

### Negatives

- **Ecosysteme** : certains plugins Jest n'ont pas d'equivalent Vitest
  (risque marginal)
- **Maturite** : Vitest est plus recent que Jest (risque mitige par l'adoption
  massive dans l'ecosysteme Vite)
