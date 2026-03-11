import { useQuery } from '@tanstack/react-query';

import { fetchSettings } from '../api/settings-api.js';
import { buildSettingsQueryKey, useSettingsConfig } from '../providers/settings-provider.js';

import type { SettingScope, SettingsMap } from '../types/index.js';
import type { UseQueryResult } from '@tanstack/react-query';

/**
 * Fetch all visible settings for a scope.
 *
 * @example
 * ```tsx
 * const { data: settings } = useSettings('user');
 * const culture = settings?.['Granit.Localization.PreferredCulture'];
 * ```
 */
export function useSettings(
  scope: SettingScope,
  options?: { enabled?: boolean }
): UseQueryResult<SettingsMap> {
  const config = useSettingsConfig();

  return useQuery({
    queryKey: buildSettingsQueryKey(config, scope),
    queryFn: () => fetchSettings(config.client, config.basePath ?? '', scope),
    enabled: options?.enabled ?? true,
  });
}
