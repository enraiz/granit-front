# @granit/error-boundary

Capture structurée des erreurs : error boundary React headless, capture globale
des erreurs fenêtre, et contexte d'enrichissement (route, utilisateur, breadcrumbs).

## Architecture

```text
ErrorContextProvider (route, user, breadcrumbs)
  └── GranitErrorBoundary (erreurs de rendu React)
        └── GlobalErrorCapture (window.onerror, unhandledrejection)
              └── App
```

Les trois composants sont indépendants et composables. Ils partagent le même
logger `@granit/logger` pour une sortie structurée cohérente.

## API

### `GranitErrorBoundary`

Class component React qui intercepte les erreurs de rendu via `componentDidCatch`.
Headless — aucun style intégré, l'UI est déléguée à `renderFallback`.

```tsx
import { GranitErrorBoundary } from '@granit/error-boundary';
import { createLogger } from '@granit/logger';

const logger = createLogger('[App]');

<GranitErrorBoundary
  logger={logger}
  renderFallback={(error, resetErrorBoundary) => (
    <div>
      <h2>Une erreur est survenue</h2>
      <p>{error.message}</p>
      <button onClick={resetErrorBoundary}>Réessayer</button>
    </div>
  )}
  onError={(error, errorInfo) => {
    // Callback optionnel (en plus du log automatique)
    analytics.track('error', { message: error.message });
  }}
>
  <App />
</GranitErrorBoundary>
```

Le fallback est enveloppé dans un `<div data-testid="error-boundary-fallback">`
pour faciliter les tests.

#### Props

| Prop | Type | Description |
| --- | --- | --- |
| `logger` | `Logger` | Instance `@granit/logger` pour le log structuré |
| `renderFallback` | `(error, reset) => ReactNode` | Fonction de rendu du fallback |
| `onError?` | `(error, errorInfo) => void` | Callback additionnel |
| `children` | `ReactNode` | Arbre de composants protégé |

### `GlobalErrorCapture`

Composant invisible qui écoute `window.error` et `window.unhandledrejection`.
Déduplication des erreurs identiques dans une fenêtre d'1 seconde.

```tsx
import { GlobalErrorCapture } from '@granit/error-boundary';

<GlobalErrorCapture
  logger={logger}
  onError={(error) => {
    // Callback optionnel pour chaque erreur capturée
  }}
/>
```

Nettoyage automatique des listeners au unmount.

#### Props

| Prop | Type | Description |
| --- | --- | --- |
| `logger` | `Logger` | Instance `@granit/logger` |
| `onError?` | `(error: Error) => void` | Callback par erreur capturée |

### `ErrorContextProvider`

Contexte React fournissant des informations enrichies attachées aux erreurs :
route courante, identité utilisateur, et fil de breadcrumbs.

```tsx
import { ErrorContextProvider } from '@granit/error-boundary';

<ErrorContextProvider config={{
  getRouteInfo: () => location.pathname,
  getUserInfo: () => ({ id: currentUser.id }),
  maxBreadcrumbs: 20, // défaut
}}>
  <App />
</ErrorContextProvider>
```

#### `ErrorContextConfig`

| Option | Type | Défaut | Description |
| --- | --- | --- | --- |
| `getRouteInfo?` | `() => string` | — | Fournit la route courante |
| `getUserInfo?` | `() => { id: string }` | — | Fournit l'identité utilisateur |
| `maxBreadcrumbs?` | `number` | `20` | Taille max du buffer circulaire (FIFO) |

### `useErrorContext(): ErrorContextValue`

Accède au contexte d'erreur. Lève une erreur si appelé hors d'un
`ErrorContextProvider`.

```typescript
const { breadcrumbs, addBreadcrumb, getRouteInfo, getUserInfo } = useErrorContext();
```

### `useBreadcrumb(): UseBreadcrumbReturn`

Hook simplifié pour ajouter des breadcrumbs au contexte d'erreur.

```typescript
import { useBreadcrumb } from '@granit/error-boundary';

const { addBreadcrumb } = useBreadcrumb();

const handleSave = () => {
  addBreadcrumb('user', 'Clicked save button');
  save();
};
```

#### Breadcrumb

```typescript
type Breadcrumb = {
  category: string;   // ex : 'navigation', 'user', 'api'
  message: string;    // description lisible
  timestamp: string;  // ISO 8601
};
```

## Composition recommandée

```tsx
import { createLogger } from '@granit/logger';
import {
  ErrorContextProvider,
  GranitErrorBoundary,
  GlobalErrorCapture,
} from '@granit/error-boundary';

const logger = createLogger('[Guava]');

function AppShell() {
  return (
    <ErrorContextProvider config={{
      getRouteInfo: () => location.pathname,
      getUserInfo: () => ({ id: user.sub }),
    }}>
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(error, reset) => <ErrorPage error={error} onRetry={reset} />}
      >
        <GlobalErrorCapture logger={logger} />
        <RouterOutlet />
      </GranitErrorBoundary>
    </ErrorContextProvider>
  );
}
```

## Types exportés

| Export | Type | Description |
| --- | --- | --- |
| `GranitErrorBoundary` | `class component` | Error boundary headless |
| `GlobalErrorCapture` | `component` | Capture window.onerror/rejection |
| `ErrorContextProvider` | `component` | Contexte d'enrichissement |
| `useErrorContext` | `hook` | Accès au contexte d'erreur |
| `useBreadcrumb` | `hook` | Ajout de breadcrumbs |
| `Breadcrumb` | `type` | Structure d'un breadcrumb |
| `ErrorBoundaryProps` | `type` | Props de l'error boundary |
| `ErrorContextConfig` | `type` | Configuration du contexte |
| `ErrorContextValue` | `type` | Valeur du contexte |
| `GlobalErrorCaptureProps` | `type` | Props de GlobalErrorCapture |
| `UseBreadcrumbReturn` | `type` | Retour du hook useBreadcrumb |

## Peer dependencies

| Dépendance | Version |
| --- | --- |
| `react` | `^19.0.0` |
| `@granit/logger` | `workspace:*` |
