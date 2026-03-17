# @granit/react-authentication-api-keys

React hooks for `@granit/authentication-api-keys` -- useApiKeys, useApiKey, useCreateApiKey,
useRevokeApiKey, useRotateApiKey, useUpdateApiKeyScopes.

## Installation

```bash
pnpm add @granit/react-authentication-api-keys
```

## API

### Hooks -- queries

- `useApiKeys(params?, options?)` -- list API keys with optional filtering
- `useApiKey(id)` -- fetch a single API key by ID

### Hooks -- mutations

- `useCreateApiKey()` -- create a new API key
- `useRevokeApiKey()` -- revoke an existing API key
- `useRotateApiKey()` -- rotate an API key secret
- `useUpdateApiKeyScopes()` -- update scopes on an API key

### Utilities

- `apiKeyKeys` -- React Query key factory

### Types

- `ApiKeyHookOptions` -- options for API key query hooks
- `UseApiKeysParams` -- parameters for listing API keys
- `UpdateApiKeyScopesVariables` -- variables for the update scopes mutation

## Usage

```tsx
import { useApiKeys, useCreateApiKey } from '@granit/react-authentication-api-keys';

function ApiKeyList() {
  const { data: keys } = useApiKeys();
  const { mutate: createKey } = useCreateApiKey();

  return (
    <ul>
      {keys?.map((key) => (
        <li key={key.id}>{key.name}</li>
      ))}
    </ul>
  );
}
```

## License

Apache-2.0
