# ADR-001 — TypeScript source-direct (pas de build step)

- **Statut** : Accepte
- **Date** : 2026-02-27

## Contexte

Les packages `@granit/*` sont consommes exclusivement par des applications Vite
(guava-front, guava-admin). En developpement local, les packages sont lies via
`pnpm link:` et resolus par des alias Vite. Vite transpile nativement le
TypeScript a la volee via esbuild.

Maintenir un build step (`tsc`, `tsup`, `rollup`) pour chaque package
introduirait :

- Un processus `watch` supplementaire pendant le developpement
- Un delai de propagation des modifications vers les applications
- Une complexite de configuration (source maps, declaration files, dual
  CJS/ESM)
- Un risque de desynchronisation entre source et artefacts compiles

## Decision

Les packages `@granit/*` exportent directement leurs fichiers `.ts` source
via le champ `exports` de `package.json` :

```json
{
  "exports": {
    ".": "./src/index.ts"
  }
}
```

Aucun repertoire `dist/` n'est genere ni commite. Les applications
consommatrices resolvent les imports via des alias Vite pointant vers les
sources.

Une configuration `publishConfig` avec des exports `dist/` et un build `tsup`
est neanmoins prevue pour la publication npm sur le registre GitLab prive.

## Consequences

### Positives

- **HMR instantane** : les modifications dans un package sont refletees
  immediatement dans l'application
- **Zero configuration** de build en developpement
- **Source maps directes** vers le code original (pas de couche intermediaire)
- **Refactoring fluide** : les outils TypeScript (rename, find references)
  traversent les packages sans friction
- **CI simplifiee** : `pnpm tsc --noEmit` suffit pour la verification de types

### Negatives

- **Couplage a Vite** : les applications consommatrices doivent utiliser un
  bundler capable de transpiler du TypeScript source (Vite, esbuild, webpack
  avec ts-loader)
- **Publication** : un build step est necessaire avant la publication npm, ce
  qui cree deux modes de consommation (source-direct vs dist)
- **Compatibilite** : les packages ne sont pas directement utilisables par un
  projet Node.js sans transpilation
