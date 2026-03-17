# @granit/react-reference-data

React hooks for `@granit/reference-data` -- useCountry, useCountries, useCreateCountry,
useUpdateCountry, useDeactivateCountry, useReactivateCountry.

## Installation

```bash
pnpm add @granit/react-reference-data
```

## API

### Hooks -- queries

- `useCountries(params?)` -- list countries with optional filtering
- `useCountry(id)` -- fetch a single country by ID

### Hooks -- mutations

- `useCreateCountry()` -- create a new country
- `useUpdateCountry()` -- update an existing country
- `useDeactivateCountry()` -- deactivate a country
- `useReactivateCountry()` -- reactivate a country

### Utilities

- `countryKeys` -- React Query key factory

### Types

- `ReferenceDataHookOptions` -- options for query hooks
- `ReferenceDataMutationOptions` -- options for mutation hooks
- `CreateCountryPayload` -- payload for country creation
- `UpdateCountryPayload` -- payload for country update

## Usage

```tsx
import { useCountries, useCreateCountry } from '@granit/react-reference-data';

function CountryList() {
  const { data: countries } = useCountries({ isActive: true });
  const { mutate: create } = useCreateCountry();

  return (
    <ul>
      {countries?.map((country) => (
        <li key={country.id}>{country.name}</li>
      ))}
    </ul>
  );
}
```

## License

Apache-2.0
