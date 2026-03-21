// Provider
export {
  SettingsProvider,
  buildSettingsQueryKey,
  useSettingsConfig,
} from './providers/settings-provider.js';
export type { SettingsConfig, SettingsProviderProps } from './providers/settings-provider.js';

// Hooks
export { useDeleteSetting } from './hooks/use-delete-setting.js';
export type { UseDeleteSettingReturn } from './hooks/use-delete-setting.js';
export { useSetting } from './hooks/use-setting.js';
export { useSettings } from './hooks/use-settings.js';
export { useUpdateSetting } from './hooks/use-update-setting.js';
export type { UseUpdateSettingReturn } from './hooks/use-update-setting.js';

// Hooks — Admin
export { useAdminAppSettings, useSaveAdminAppSettings } from './hooks/use-admin-app-settings.js';
export type { SaveAppSettingsVariables } from './hooks/use-admin-app-settings.js';
