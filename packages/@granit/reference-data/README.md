# @granit/reference-data

Reference data types -- Country and related types mirroring Granit.ReferenceData .NET.

## Installation

```bash
pnpm add @granit/reference-data
```

## API

### Types

- `Country` -- country reference data (code, name, active status)
- `CountriesListParams` -- query parameters for listing countries

## Usage

```ts
import type { Country, CountriesListParams } from '@granit/reference-data';

const params: CountriesListParams = { isActive: true };
```

## License

Apache-2.0
