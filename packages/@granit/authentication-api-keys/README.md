# @granit/authentication-api-keys

API key types -- TypeScript mirror of Granit.Authentication.ApiKeys .NET.

## Installation

```bash
pnpm add @granit/authentication-api-keys
```

## API

### Types

- `ApiKeyType` -- API key type discriminator
- `CacheBehavior` -- cache behavior configuration
- `ApiKeyResponse` -- API key data returned by the server
- `ApiKeyCreateRequest` -- payload for creating a new API key
- `ApiKeyCreateResponse` -- response after API key creation (includes secret)
- `ApiKeyRotateResponse` -- response after rotating an API key
- `ApiKeyUpdateScopesRequest` -- payload for updating API key scopes

## Usage

```ts
import type { ApiKeyResponse, ApiKeyCreateRequest } from '@granit/authentication-api-keys';

const request: ApiKeyCreateRequest = {
  name: 'my-service-key',
  scopes: ['read:data', 'write:data'],
};
```

## License

Apache-2.0
