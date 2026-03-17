# @granit/react-error-boundary

React bindings for `@granit/error-boundary` -- GranitErrorBoundary, GlobalErrorCapture,
ErrorContextProvider.

## Installation

```bash
pnpm add @granit/react-error-boundary
```

## API

### Components

- `GranitErrorBoundary` -- React error boundary with structured error capture
- `GlobalErrorCapture` -- captures unhandled window errors and promise rejections
- `ErrorContextProvider` -- provides error context (route, user, breadcrumbs) to error handlers

### Hooks

- `useErrorContext()` -- access error context from within the provider
- `useBreadcrumb()` -- add breadcrumb entries for error debugging

### Types

- `ErrorBoundaryProps` -- props for `GranitErrorBoundary`
- `GlobalErrorCaptureProps` -- props for `GlobalErrorCapture`
- `UseBreadcrumbReturn` -- return type of `useBreadcrumb`

## Usage

```tsx
import {
  ErrorContextProvider,
  GranitErrorBoundary,
  GlobalErrorCapture,
} from '@granit/react-error-boundary';

function App() {
  return (
    <ErrorContextProvider>
      <GlobalErrorCapture />
      <GranitErrorBoundary fallback={<ErrorPage />}>
        <MyApp />
      </GranitErrorBoundary>
    </ErrorContextProvider>
  );
}
```

## License

Apache-2.0
