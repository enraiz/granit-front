# CLAUDE.md - Granit Front

## Project

- **Type**: TypeScript/React framework library — packages `@granit/*`
- **Purpose**: Shared framework for Digital Dynamics front-end applications (guava-front, guava-admin)
- **Equivalent**: JavaScript/TypeScript counterpart of `granit-dotnet` (.NET framework)
- **Location**: this repository root
- **Consumers**: guava-front, guava-admin (via pnpm `link:` protocol + Vite aliases)

## GitLab repositories

| ID  | Repo                  | Path                                                              |
| --- | --------------------- | ----------------------------------------------------------------- |
| 5   | governance-compliance | `digital-dynamics/governance-compliance`                          |
| 6   | granit-dotnet         | `digital-dynamics/granit-dotnet`                                  |
| 9   | **granit-front**      | `digital-dynamics/granit-front`                                   |
| 10  | guava-admin           | `digital-dynamics/guava-platform/applications/guava-admin`        |
| 4   | guava-app-template    | `digital-dynamics/guava-platform/applications/guava-app-template` |
| 7   | guava-backend         | `digital-dynamics/guava-platform/applications/guava-backend`      |
| 1   | guava-front           | `digital-dynamics/guava-platform/applications/guava-front`        |
| 3   | gitops                | `digital-dynamics/guava-platform/infrastructure/gitops`           |
| 2   | iac                   | `digital-dynamics/guava-platform/infrastructure/iac`              |
| 8   | project-governance    | `digital-dynamics/guava-platform/project-governance`              |

## Packages

| Package                                 | Purpose                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@granit/logger`                        | Configurable logger factory (`createLogger(prefix)`)                                                                                                                                                                                                                                                                                                                                                                                     |
| `@granit/utils`                         | Shared utilities (`cn`, `formatDate`, `formatNumber`, …)                                                                                                                                                                                                                                                                                                                                                                                 |
| `@granit/api-client`                    | Axios factory (`createApiClient`, `setTokenGetter`), shared response types (`PaginatedResponse`, `ProblemDetails`)                                                                                                                                                                                                                                                                                                                       |
| `@granit/authentication`                | Keycloak/OIDC authentication types: `BaseAuthContextType`, `KeycloakUserInfo`, `KeycloakCoreConfig`, `LoginOptions`, `LogoutOptions` — mirrors `Granit.Authentication` .NET                                                                                                                                                                                                                                                              |
| `@granit/react-authentication`          | React bindings for `@granit/authentication`: `useKeycloakInit`, `createAuthContext`, `createMockProvider`                                                                                                                                                                                                                                                                                                                                |
| `@granit/authorization`                 | Permission/role authorization types: `PermissionsResponse`, `PermissionDefinitionDto`, `PermissionGroupDto`, `PermissionGrantDto` — mirrors `Granit.Authorization` .NET                                                                                                                                                                                                                                                                  |
| `@granit/react-authorization`           | React hooks for `@granit/authorization`: `usePermissions`, `usePermissionDefinitions`, `useRolePermissions`, `usePermissionGrant`                                                                                                                                                                                                                                                                                                        |
| `@granit/timeline`                      | Unified activity feed (headless): hooks (`useTimeline`, `useTimelineActions`, `useTimelineFollowers`), types — UI components live in consumer apps                                                                                                                                                                                                                                                                                       |
| `@granit/cookies`                       | Cookie consent abstraction: React context, `useCookieConsent` hook, `CookieConsentProvider` interface                                                                                                                                                                                                                                                                                                                                    |
| `@granit/cookies-klaro`                 | Klaro CMP adapter: `createKlaroCookieConsentProvider` factory                                                                                                                                                                                                                                                                                                                                                                            |
| `@granit/workflow`                      | Workflow lifecycle (headless): hooks (`useWorkflowStatus`, `useWorkflowTransition`, `useWorkflowHistory`), types — UI components live in consumer apps                                                                                                                                                                                                                                                                                   |
| `@granit/notifications`                 | Notification core (headless): transport-agnostic provider, hooks (`useNotifications`, `useUnreadCount`, `useRealTimeNotifications`, `useEntityActivityFeed`, `useNotificationPreferences`), `NotificationTransport` interface, extensible `NotificationChannels` constants — UI components live in consumer apps                                                                                                                         |
| `@granit/notifications-signalr`         | SignalR transport adapter: `createSignalRTransport` factory implementing `NotificationTransport`                                                                                                                                                                                                                                                                                                                                         |
| `@granit/notifications-sse`             | SSE transport adapter: `createSseTransport` factory implementing `NotificationTransport` via `@microsoft/fetch-event-source`                                                                                                                                                                                                                                                                                                             |
| `@granit/notifications-web-push`        | Web Push VAPID subscription management: `useWebPush` hook (permission, subscribe, unsubscribe)                                                                                                                                                                                                                                                                                                                                           |
| `@granit/notifications-mobile-push`     | Mobile Push (FCM/APNs) device token registration via Capacitor: `useMobilePush` hook                                                                                                                                                                                                                                                                                                                                                     |
| `@granit/querying`                      | Headless data grid: hooks (`useQueryMeta`, `useQueryEndpoint`, `useSavedViews`, `useSmartFilter`), types mirroring `Granit.Querying` .NET contract — UI components live in consumer apps                                                                                                                                                                                                                                                 |
| `@granit/data-exchange`                 | Tabular data exchange (headless): **export** — hooks (`useExportJob`, `useExportPresets`, `useExportDefinitions`, `useExportFields`), provider (`ExportProvider`), types mirroring `Granit.DataExchange.Export` .NET contract; **import** — hooks (`useImportJob`, `useImportPreview`, `useImportReport`), provider (`ImportProvider`), types mirroring `Granit.DataExchange.Import` .NET contract — UI components live in consumer apps |
| `@granit/tracing`                       | Distributed tracing: `TracingProvider` (OpenTelemetry WebTracerProvider + OTLP exporter + auto-instrumentations), `useTracer`, `useSpan` (custom spans), `getTraceContext` (non-React, for logger-otlp integration)                                                                                                                                                                                                                      |
| `@granit/identity`                      | Identity provider capabilities: types (`IdentityProviderCapabilities`) and API (`fetchIdentityCapabilities`) mirroring `Granit.Identity` .NET contract                                                                                                                                                                                                                                                                                   |
| `@granit/react-identity`                | React bindings for `@granit/identity`: `IdentityProvider`, `useIdentityCapabilities`                                                                                                                                                                                                                                                                                                                                                     |
| `@granit/multi-tenancy`                 | Multi-tenancy types and tenant resolver abstraction: `TenantInfo`, `CurrentTenant`, `MultiTenancyOptions`, `TenantResolver` interface, `resolveTenant` pipeline, `createJwtClaimTenantResolver` — mirrors `Granit.MultiTenancy` .NET contract                                                                                                                                                                                            |
| `@granit/react-multi-tenancy`           | React bindings for `@granit/multi-tenancy`: `TenantProvider`, `useTenant`, `useKeycloakTenantResolvers` — auto-wires `X-Tenant-Id` header via `@granit/api-client`                                                                                                                                                                                                                                                                       |
| `@granit/error-boundary`                | Structured error capture: `GranitErrorBoundary` (headless class component), `GlobalErrorCapture` (window error/rejection listeners), `ErrorContextProvider` (route, user, breadcrumbs), `useBreadcrumb`                                                                                                                                                                                                                                  |
| `@granit/background-jobs`               | Background job monitoring types: `BackgroundJobStatus` — mirrors `Granit.BackgroundJobs` .NET                                                                                                                                                                                                                                                                                                                                            |
| `@granit/react-background-jobs`         | React hooks for `@granit/background-jobs`: `useBackgroundJobs`, `usePauseJob`, `useResumeJob`, `useTriggerJob`                                                                                                                                                                                                                                                                                                                           |
| `@granit/authentication-api-keys`       | API key management types: `ApiKeyResponse`, `ApiKeyCreateRequest`, `ApiKeyCreateResponse`, `ApiKeyRotateResponse` — mirrors `Granit.Authentication.ApiKeys` .NET                                                                                                                                                                                                                                                                         |
| `@granit/react-authentication-api-keys` | React hooks for `@granit/authentication-api-keys`: `useApiKeys`, `useApiKey`, `useCreateApiKey`, `useRevokeApiKey`, `useRotateApiKey`, `useUpdateApiKeyScopes`                                                                                                                                                                                                                                                                           |
| `@granit/reference-data`                | Reference data types: `Country`, `CountriesListParams` — mirrors `Granit.ReferenceData` .NET                                                                                                                                                                                                                                                                                                                                             |
| `@granit/react-reference-data`          | React hooks for `@granit/reference-data`: `useCountry`, `useCountries`, `useCreateCountry`, `useUpdateCountry`, `useDeactivateCountry`, `useReactivateCountry`                                                                                                                                                                                                                                                                           |

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
pnpm --filter @granit/authentication test
```

## Package conventions

- **Source-direct**: packages export `.ts` source files — no build step, no `dist/`
- **Exports**: `"exports": { ".": "./src/index.ts" }` in each `package.json`
- **Entry point**: single `src/index.ts` per package (re-exports public API)
- **Tests**: co-located with source `src/**/*.test.ts` or `src/__tests__/`
- **Coverage**: ≥ 80% on all new code — flagged as top priority if below
- **pnpm only** — never npm or yarn

## Coding conventions

Full frontend conventions: `../granit-dotnet/docs/guide/conventions/frontend/`

**Read these files before any structural or convention question:**

- `../granit-dotnet/docs/guide/conventions/frontend/style-et-nommage.md` — TypeScript strict, naming, `type` vs `interface`, exports, imports, ESLint, feature-based organization, **`@granit/*` package subdirectory structure**
- `../granit-dotnet/docs/guide/conventions/frontend/composants.md` — React, TS patterns, shadcn/ui, CVA, Storybook, WCAG, design tokens, performance, HDS security
- `../granit-dotnet/docs/guide/conventions/frontend/etat-et-api.md` — React Query, Query Factory, Orval, auth, routing, logging, i18n, Zod forms, tests

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
- **`@granit/authentication` base interface**: `BaseAuthContextType` is the shared base
  — apps extend it with their own fields (`register` in front, `hasAdminRole` in admin)
- **Peer dep matrix**:
  - `@granit/utils` → `clsx`, `tailwind-merge`, `date-fns`
  - `@granit/api-client` → `axios`
  - `@granit/authentication` → `keycloak-js`
  - `@granit/react-authentication` → `react`, `keycloak-js`, `@granit/api-client`, `@granit/authentication`
  - `@granit/authorization` → `axios`
  - `@granit/react-authorization` → `react`, `axios`, `@tanstack/react-query`, `@granit/authorization`
  - `@granit/cookies` → `react`
  - `@granit/cookies-klaro` → `react`, `klaro`, `@granit/cookies`
  - `@granit/timeline` → `react`, `axios`, `@granit/querying`
  - `@granit/workflow` → `react`, `axios`
  - `@granit/notifications` → `react`, `axios`, `@granit/querying`
  - `@granit/notifications-signalr` → `@granit/notifications`, `@microsoft/signalr`
  - `@granit/notifications-sse` → `@granit/notifications`, `@microsoft/fetch-event-source`
  - `@granit/notifications-web-push` → `react`, `axios`, `@granit/notifications`
  - `@granit/notifications-mobile-push` → `react`, `axios`, `@granit/notifications`, `@capacitor/push-notifications`
  - `@granit/querying` → `react`, `react-dom`, `axios`, `@tanstack/react-query`, `@granit/utils`
  - `@granit/data-exchange` → `react`, `react-dom`, `axios`, `@tanstack/react-query`, `@granit/utils`
  - `@granit/tracing` → `react`, `@opentelemetry/api`, `@opentelemetry/sdk-trace-web`, `@opentelemetry/exporter-trace-otlp-http`, `@opentelemetry/instrumentation-fetch`, `@opentelemetry/instrumentation-xml-http-request`, `@opentelemetry/instrumentation-document-load`, `@opentelemetry/resources`, `@opentelemetry/semantic-conventions`, `@opentelemetry/context-zone`
  - `@granit/identity` → `axios`
  - `@granit/react-identity` → `react`, `axios`, `@tanstack/react-query`, `@granit/identity`
  - `@granit/multi-tenancy` → _(no peer dependencies)_
  - `@granit/react-multi-tenancy` → `react`, `@granit/multi-tenancy`, `@granit/api-client`
  - `@granit/error-boundary` → `react`, `@granit/logger`
  - `@granit/background-jobs` → _(no peer dependencies)_
  - `@granit/react-background-jobs` → `react`, `axios`, `@tanstack/react-query`, `@granit/background-jobs`
  - `@granit/authentication-api-keys` → _(no peer dependencies)_
  - `@granit/react-authentication-api-keys` → `react`, `axios`, `@tanstack/react-query`, `@granit/authentication-api-keys`
  - `@granit/reference-data` → _(no peer dependencies)_
  - `@granit/react-reference-data` → `react`, `axios`, `@tanstack/react-query`, `@granit/reference-data`

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

## Definition of Done — mandatory before any push

**NEVER push or create an MR** without: tests passing, lint clean (`pnpm lint`),
TypeScript clean (`pnpm tsc`), markdownlint clean on modified `.md` files.
These checks are **blocking**. If the user asks to push without them, remind them
and refuse until the DoD is satisfied or the user explicitly overrides each item.

## Git workflow

- **Branching**: GitFlow (main + develop + `feature/*` + `release/*` + `hotfix/*`)
- **Direct push to `main` FORBIDDEN**
- **Releases**: Semantic tags on main (vMAJOR.MINOR.PATCH), `release/*` branches
- **Commits**: Conventional Commits (feat:, fix:, docs:, chore:) enforced by commitlint
- **MR**: 1 approval minimum for main
- **Pre-commit hooks**: `pnpm lint && pnpm tsc`
- **Commit-msg hook**: `pnpm exec commitlint --edit`

**MR target — STRICT RULE:**

| Branch type | Default target     | Exception                                  |
| ----------- | ------------------ | ------------------------------------------ |
| `feature/*` | `develop`          | Only if user explicitly says "target main" |
| `hotfix/*`  | `main` + `develop` | Both, always                               |
| `release/*` | `main` + `develop` | Both, always                               |
| `fix/*`     | `develop`          | Only if user explicitly says "target main" |

NEVER target `main` for a `feature/*` or `fix/*` branch unless the user explicitly
requests it. When in doubt, ask before creating the MR.

## Security

See `../granit-dotnet/docs/guide/conventions/securite.md` for code-level security rules.

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

See `../granit-dotnet/docs/guide/conventions/langues.md` for full language and localization rules.

- **Code** (identifiers, JSDoc, comments): **English**
- **Docs, issues, commits**: **French** (with correct diacritics: é, è, ê, à, â, ù, û, ô, î, ï, ç, œ)
- **`CLAUDE.md`, skills**: **English**

## Personas (user stories)

Two persona registries:

- **Infrastructure & governance (15 personas)**: `../governance-compliance/docs/03-organization/ORG-05-PERSONAS.md`
- **Application-level (5 personas)**: `../granit-dotnet/docs/guide/personas-applicatifs.md`

**STRICT RULES:**

- **ALWAYS** use a canonical persona in user stories (`As a [persona]`)
- **NEVER** introduce a new persona without user validation and registry update
- **NEVER** use hybrid roles (`SRE / DevOps`) — choose the primary persona
- Context (on-call, audit, incident) belongs in the story body, not in the persona

**Infra/governance personas:** SRE, Ingénieur DevOps, Développeur, Architecte, DBA,
RSSI, DPO, CTO, Direction, Directeur juridique, Auditeur interne, Auditeur externe,
Utilisateur, Professionnel de santé, Product Owner

**Application personas:** Visiteur, Utilisateur authentifié, Administrateur d'application,
Approbateur, Gestionnaire de contenu
