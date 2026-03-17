import { renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import {
  SettingsProvider,
  buildSettingsQueryKey,
  useSettingsConfig,
} from '../providers/settings-provider.js';

import type { SettingsConfig } from '../providers/settings-provider.js';
import type { AxiosInstance } from 'axios';

const mockConfig: SettingsConfig = {
  client: {} as AxiosInstance,
  basePath: '/api',
};

function createWrapper(config: SettingsConfig) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <SettingsProvider config={config}>{children}</SettingsProvider>;
  };
}

describe('SettingsProvider', () => {
  it('should provide config via useSettingsConfig', () => {
    const { result } = renderHook(() => useSettingsConfig(), {
      wrapper: createWrapper(mockConfig),
    });

    expect(result.current.client).toBe(mockConfig.client);
    expect(result.current.basePath).toBe('/api');
  });

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useSettingsConfig());
    }).toThrow('useSettingsConfig must be used within a SettingsProvider');
  });
});

describe('buildSettingsQueryKey', () => {
  it('should build key with default prefix', () => {
    const key = buildSettingsQueryKey(mockConfig, 'user');
    expect(key).toEqual(['settings', 'user']);
  });

  it('should build key with custom prefix', () => {
    const config: SettingsConfig = { ...mockConfig, queryKeyPrefix: ['custom'] };
    const key = buildSettingsQueryKey(config, 'user', 'Granit.Localization.PreferredCulture');
    expect(key).toEqual(['custom', 'user', 'Granit.Localization.PreferredCulture']);
  });
});
