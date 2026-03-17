# @granit/react-settings

React bindings for `@granit/settings` -- SettingsProvider, useSetting, useSettings,
useUpdateSetting, useDeleteSetting.

## Installation

```bash
pnpm add @granit/react-settings
```

## API

### Components

- `SettingsProvider` -- provides settings configuration to the component tree

### Hooks

- `useSetting(key)` -- fetch a single setting by key
- `useSettings()` -- fetch all settings
- `useUpdateSetting()` -- update a setting value
- `useDeleteSetting()` -- delete a setting

### Utilities

- `useSettingsConfig()` -- access settings configuration from context
- `buildSettingsQueryKey(...)` -- React Query key factory

### Types

- `SettingsConfig` -- settings provider configuration
- `SettingsProviderProps` -- props for `SettingsProvider`
- `UseUpdateSettingReturn` -- return type of `useUpdateSetting`
- `UseDeleteSettingReturn` -- return type of `useDeleteSetting`

## Usage

```tsx
import { SettingsProvider, useSetting, useUpdateSetting } from '@granit/react-settings';

function App() {
  return (
    <SettingsProvider config={{ basePath: '/api/settings' }}>
      <ThemeToggle />
    </SettingsProvider>
  );
}

function ThemeToggle() {
  const { data: theme } = useSetting('ui.theme');
  const { mutate: update } = useUpdateSetting();

  return (
    <button onClick={() => update({ key: 'ui.theme', value: 'dark' })}>Current: {theme}</button>
  );
}
```

## License

Apache-2.0
