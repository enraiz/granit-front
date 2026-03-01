# CLAUDE.md - Granit Front

## Project

- **Type**: TypeScript/React framework library — packages `@granit/*`
- **Purpose**: Shared framework for Digital Dynamics front-end applications (guava-front, guava-admin)
- **Equivalent**: JavaScript/TypeScript counterpart of `granit-dotnet` (.NET framework)
- **Location**: `/home/jf/dev/digital-dynamics/granit-front/`
- **Consumers**: guava-front, guava-admin (via pnpm `link:` protocol + Vite aliases)

## Packages

| Package | Purpose |
| ------- | ------- |
| `@granit/logger` | Configurable logger factory (`createLogger(prefix)`) |
| `@granit/types` | Shared TypeScript types (`KeycloakUserInfo`, `PaginatedResponse`) |
| `@granit/utils` | Shared utilities (`cn`, `formatDate`, `formatNumber`, …) |
| `@granit/api-client` | Axios factory (`createApiClient`, `setTokenGetter`) |
| `@granit/auth` | Keycloak hooks, auth context factory, mock provider |
| `@granit/timeline` | Unified activity feed: hooks (`useTimeline`, `useTimelineActions`, `useTimelineFollowers`), components (`TimelineStream`, `TimelineComposer`) |
| `@granit/cookies` | Cookie consent abstraction: React context, `useCookieConsent` hook, `CookieConsentProvider` interface |
| `@granit/cookies-klaro` | Klaro CMP adapter: `createKlaroCookieConsentProvider` factory |
| `@granit/workflow` | Workflow lifecycle: hooks (`useWorkflowStatus`, `useWorkflowTransition`, `useWorkflowHistory`), components (`WorkflowStatusBar`, `WorkflowHistory`) |

## Stack & versions

TypeScript 5 (strict) | React 19 | Vitest 3 | ESLint 9 | pnpm workspace | Node 24

## Commands

```bash
# Root workspace — runs across all packages
pnpm lint               # ESLint (--max-warnings 0)
pnpm tsc                # TypeScript check (pnpm -r exec tsc --noEmit)
pnpm test               # Vitest (all packages, watch mode)
pnpm test:coverage      # Vitest coverage (v8, lcov + html)

# Per package
pnpm --filter @granit/utils lint
pnpm --filter @granit/auth test
```

## Package conventions

- **Source-direct**: packages export `.ts` source files — no build step, no `dist/`
- **Exports**: `"exports": { ".": "./src/index.ts" }` in each `package.json`
- **Entry point**: single `src/index.ts` per package (re-exports public API)
- **Tests**: co-located with source `src/**/*.test.ts` or `src/__tests__/`
- **Coverage**: ≥ 80% on all new code — flagged as top priority if below
- **pnpm only** — never npm or yarn

## Tech rules

- **TypeScript strict** on all `.ts`/`.tsx` files — no implicit `any`
- **Logging**: use `@granit/logger` (`createLogger`), never `console.log`
- **Imports**: `import type` for type-only imports
- **Peer dependencies**: declare in `peerDependencies`, not `dependencies`
- **No bundling**: consumed directly as TypeScript source via Vite path aliases

## API design rules

- **API stability**: exported types/function signatures are consumed by multiple apps
  — breaking changes require coordinating updates to both guava-front and guava-admin
- **No app-specific code**: packages must remain app-agnostic
  (no FHIR, no Capacitor, no admin roles, no HDS-specific behavior)
- **`@granit/auth` base interface**: `BaseAuthContextType` is the shared base
  — apps extend it with their own fields (`register` in front, `hasAdminRole` in admin)
- **Peer dep matrix**:
  - `@granit/utils` → `clsx`, `tailwind-merge`, `date-fns`
  - `@granit/api-client` → `axios`
  - `@granit/auth` → `react`, `keycloak-js`, `@granit/types`
  - `@granit/cookies` → `react`
  - `@granit/cookies-klaro` → `react`, `klaro`, `@granit/cookies`
  - `@granit/timeline` → `react`, `axios`
  - `@granit/workflow` → `react`, `axios`

## GitLab issues

Before any GitLab operation, **invoke skill `/gitlab`** to load commands and conventions.

- **Types**: Epic (`[EPIC]`), Feature (`[FEATURE]`), Story (`[STORY]`) — no emoji in titles
- **Hierarchy**: GitLab Free — `relates_to` links via API + references in parent description
- **Templates**: `.gitlab/issue_templates/`

## Third-party license notices

The file `THIRD-PARTY-NOTICES.md` at the repository root lists every external
dependency with its license type and copyright. This file is a legal obligation
for MIT, Apache-2.0, BSD, ISC, and similar permissive licenses.

**When adding, removing, or upgrading an external dependency:**

1. Update `THIRD-PARTY-NOTICES.md` — add/remove/update the package entry with
   its name, version, license (SPDX identifier), and copyright holder.
2. Update the summary table at the top of the file if license counts change.
3. Update the `Dernière mise à jour` date.
4. If the new dependency uses a **non-permissive license** (GPL, LGPL, AGPL,
   SSPL, or any commercial/non-commercial restriction), **flag it immediately**
   to the user before proceeding. HDS/commercial context requires careful review.

**NEVER** add a dependency without updating `THIRD-PARTY-NOTICES.md`.

## Git workflow

- **Branching**: GitFlow (main + develop + `feature/*` + `release/*` + `hotfix/*`)
- **Direct push to `main` FORBIDDEN**
- **Releases**: Semantic tags on main (vMAJOR.MINOR.PATCH), `release/*` branches
- **Commits**: Conventional Commits (feat:, fix:, docs:, chore:) enforced by commitlint
- **MR**: 1 approval minimum for main
- **Pre-commit hooks**: `pnpm lint && pnpm tsc`
- **Commit-msg hook**: `pnpm exec commitlint --edit`

## Security

**ALWAYS:**

- No hardcoded secrets (not even in examples or test fixtures)
- No PII propagation through framework utilities
- No US cloud dependencies

**NEVER:**

- Add app-specific constraints (HDS, FHIR) to shared packages
- Introduce side effects at module import time
- Silently swallow errors in library code

## Refactoring — mandatory rules

Any change to a public API (`src/index.ts` exports) may break consumers.

**Before any refactoring:**

1. Check which guava apps import the symbol to be changed
2. Update both apps in the same MR or coordinate in a dedicated issue
3. Never rename exported symbols without a deprecation notice

## Expected behavior

- Understand that this is a framework library — changes affect multiple apps
- Prefer backward-compatible changes; breaking changes need explicit coordination
- Provide production-ready code (no TODOs, no obvious comments)
- Explain the "why" behind architectural choices

## Language

| Content | Language |
| ------- | -------- |
| Code — identifiers, inline comments (`//`), JSDoc | **English** |
| `docs/**/*.md` | **French** |
| GitLab issues (title, description, comments) | **French** |
| Commits (Conventional Commits messages) | **French** |
| `CLAUDE.md`, skills | **English** |

**Diacritics**: ALWAYS use correct French accents (é, è, ê, à, â, ù, û, ô, î, ï, ç, œ)
in all French content. Never in code.

## Personas (user stories)

Persona registry: `governance-compliance/docs/03-organization/ORG-05-PERSONAS.md`.

**Available personas:** SRE, Ingénieur DevOps, Développeur, Architecte, DBA, RSSI,
DPO, CTO, Direction, Directeur juridique, Auditeur interne, Auditeur externe,
Utilisateur, Professionnel de santé, Product Owner

**NEVER** introduce a new persona without updating the registry.

# currentDate
Today's date is 2026-02-27.
