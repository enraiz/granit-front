# @granit/react-cookies

React bindings for `@granit/cookies` -- CookieConsentProvider, useCookieConsent.

## Installation

```bash
pnpm add @granit/react-cookies
```

## API

### Components

- `CookieConsentProvider` -- provides cookie consent state to the component tree

### Hooks

- `useCookieConsent()` -- access cookie consent state and actions

## Usage

```tsx
import { CookieConsentProvider, useCookieConsent } from '@granit/react-cookies';

function App() {
  return (
    <CookieConsentProvider provider={myConsentProvider}>
      <ConsentBanner />
    </CookieConsentProvider>
  );
}

function ConsentBanner() {
  const { consents, acceptAll, rejectAll } = useCookieConsent();

  return (
    <div>
      <button onClick={acceptAll}>Accept</button>
      <button onClick={rejectAll}>Reject</button>
    </div>
  );
}
```

## License

Apache-2.0
