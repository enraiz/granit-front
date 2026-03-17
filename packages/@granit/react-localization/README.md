# @granit/react-localization

React bindings for `@granit/localization` -- i18next integration with locale persistence.

## Installation

```bash
pnpm add @granit/react-localization
```

## API

### Functions

- `createReactLocalization(options)` -- initializes i18next with Granit conventions

### Hooks

- `useLocale(options?)` -- manage the current locale with storage persistence

### Re-exports from react-i18next

- `I18nextProvider` -- i18next React context provider
- `Trans` -- translation component with interpolation
- `useTranslation()` -- translation hook

### Types

- `UseLocaleOptions` -- options for `useLocale`

## Usage

```tsx
import {
  createReactLocalization,
  I18nextProvider,
  useTranslation,
  useLocale,
} from '@granit/react-localization';

const i18n = createReactLocalization({ defaultLocale: 'fr' });

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <MyApp />
    </I18nextProvider>
  );
}

function MyApp() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return <h1>{t('welcome')}</h1>;
}
```

## License

Apache-2.0
