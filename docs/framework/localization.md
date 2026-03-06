# @granit/localization

Factory i18next avec traductions dynamiques depuis le backend Granit.

## Architecture

Les traductions ne sont **pas embarquées** dans l'application. Elles proviennent du backend
via l'API `GET /api/v1/localization?cultureName={locale}` et sont appliquées au runtime.

Les langues disponibles sont également dynamiques — pas de liste codée en dur.

### Flow de bootstrap

```text
1. resolveInitialLocale()  → détecte la locale (localStorage → navigator → isDefault → 'fr')
2. GET /api/v1/localization?cultureName=fr  → via hook orval
3. applyTranslations(i18n, response)  → merge les traductions dans i18next
4. Rendu de l'application
```

### Changement de langue

```text
1. setLocale('en')  → persiste dans localStorage (dd:locale)
2. Re-fetch GET /api/v1/localization?cultureName=en
3. applyTranslations(i18n, response)
4. L'UI se met à jour via react-i18next
```

## API

### `createLocalization(config?): i18n`

Crée une instance i18next isolée (pas le singleton global).

L'instance est initialisée **sans** option `lng` — la locale est résolue par
`resolveInitialLocale()` et appliquée via `applyTranslations()`.

```typescript
// src/lib/i18n.ts
import { createLocalization } from '@granit/localization';

export const i18n = createLocalization();
```

#### Options

| Option       | Type     | Défaut          | Description                      |
| ------------ | -------- | --------------- | -------------------------------- |
| `storageKey` | `string` | `'locale'`      | Clé localStorage (→ `dd:locale`) |
| `defaultNS`  | `string` | `'translation'` | Namespace i18next par défaut     |

### `resolveInitialLocale(languages?, storageKey?): string`

Détecte la locale initiale avant que les données backend ne soient disponibles.

Cascade de détection :

1. `localStorage` (`dd:locale`) → si présent, retourner
2. `navigator.language` (ex: `"fr-FR"` → `"fr"`) → si dans les langues disponibles, retourner
3. Si `languages` fourni → retourner celui avec `isDefault === true`
4. Fallback → `'fr'`

```typescript
import { resolveInitialLocale } from '@granit/localization';

const initialLocale = resolveInitialLocale();
// Utilisé pour le premier appel API : ?cultureName=fr
```

### `applyTranslations(instance, data): void`

Applique la réponse du backend à l'instance i18next.

Le backend retourne les ressources groupées par module (ex: `{ "Granit": {...}, "Guava": {...} }`).
Cette fonction les fusionne dans le namespace unique `translation`, puis change la langue active
si elle diffère.

```typescript
import { applyTranslations } from '@granit/localization';
import { i18n } from '@/lib/i18n';

// Dans un useEffect, après réception des données du backend
applyTranslations(i18n, data);
```

### `useLocale(): { locale, setLocale }`

Hook simplifié pour la gestion de la locale (sélecteurs de langue).

```tsx
import { useLocale } from '@granit/localization';

function LanguageSwitcher({ languages }) {
  const { locale, setLocale } = useLocale();

  return (
    <select value={locale} onChange={(e) => setLocale(e.target.value)}>
      {languages.map((lang) => (
        <option key={lang.cultureName} value={lang.cultureName}>
          {lang.displayName}
        </option>
      ))}
    </select>
  );
}
```

### Re-exports

Le package re-exporte les utilitaires de `react-i18next` pour que les apps n'aient
qu'une seule source d'import :

```typescript
import { useTranslation, Trans, I18nextProvider } from '@granit/localization';
```

### Constante `LOCALE_STORAGE_KEY`

Clé par défaut pour la persistence de la locale : `'locale'` (→ `dd:locale` via `@granit/storage`).

## Types

### `LanguageInfo`

Correspond au backend `Granit.Localization.LanguageInfo`.

```typescript
interface LanguageInfo {
  cultureName: string; // ex: 'fr', 'en'
  displayName: string; // ex: 'Français', 'English'
  flagIcon?: string; // ex: 'fr', 'gb'
  isDefault: boolean; // true pour la langue par défaut
}
```

### `ApplicationLocalizationDto`

Correspond au backend `ApplicationLocalizationDto`.

```typescript
interface ApplicationLocalizationDto {
  cultureName: string;
  resources: Record<string, Record<string, string>>;
  languages: LanguageInfo[];
}
```

## Pattern d'intégration côté app

```typescript
// src/providers/localization-provider.tsx
import { useEffect } from 'react';
import { I18nextProvider, applyTranslations, useLocale } from '@granit/localization';
import { useGetLocalization } from '@/api/generated/localization/localization';
import { i18n } from '@/lib/i18n';

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const { locale } = useLocale();
  const { data, isLoading } = useGetLocalization({ cultureName: locale });

  useEffect(() => {
    if (data) {
      applyTranslations(i18n, data);
    }
  }, [data]);

  if (isLoading) return <Spinner />;

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
```

## Peer dependencies

- `@granit/storage` (workspace)
- `i18next` ^25.0.0
- `react` ^19.0.0
- `react-i18next` ^16.0.0
