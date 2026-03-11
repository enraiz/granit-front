// Types
export type {
  SettingScope,
  SettingValueResponse,
  SettingsMap,
  UpdateSettingValueRequest,
} from './types/index.js';

// Constants
export { SETTING_NAMES } from './constants.js';

// API
export { deleteSetting, fetchSetting, fetchSettings, updateSetting } from './api/settings-api.js';

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
