import { describe, expect, it, vi } from 'vitest';

import { deleteSetting, fetchSetting, fetchSettings, updateSetting } from '../api/settings-api.js';

import type { AxiosInstance } from 'axios';

function createMockClient(): AxiosInstance {
  return {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  } as unknown as AxiosInstance;
}

describe('settings-api', () => {
  describe('fetchSettings', () => {
    it('should GET /settings/{scope}', async () => {
      const client = createMockClient();
      const data = { 'Granit.Localization.PreferredCulture': 'fr' };
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchSettings(client, '', 'user');

      expect(client.get).toHaveBeenCalledWith('/settings/user');
      expect(result).toEqual(data);
    });

    it('should prepend basePath', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: {} });

      await fetchSettings(client, '/api/v1', 'global');

      expect(client.get).toHaveBeenCalledWith('/api/v1/settings/global');
    });
  });

  describe('fetchSetting', () => {
    it('should GET /settings/{scope}/{name}', async () => {
      const client = createMockClient();
      const data = { name: 'Granit.Localization.PreferredCulture', value: 'fr' };
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchSetting(client, '', 'user', 'Granit.Localization.PreferredCulture');

      expect(client.get).toHaveBeenCalledWith(
        '/settings/user/Granit.Localization.PreferredCulture'
      );
      expect(result).toEqual(data);
    });
  });

  describe('updateSetting', () => {
    it('should PUT /settings/{scope}/{name}', async () => {
      const client = createMockClient();
      vi.mocked(client.put).mockResolvedValue({});

      await updateSetting(client, '', 'user', 'Granit.Localization.PreferredCulture', {
        value: 'en',
      });

      expect(client.put).toHaveBeenCalledWith(
        '/settings/user/Granit.Localization.PreferredCulture',
        { value: 'en' }
      );
    });
  });

  describe('deleteSetting', () => {
    it('should DELETE /settings/{scope}/{name}', async () => {
      const client = createMockClient();
      vi.mocked(client.delete).mockResolvedValue({});

      await deleteSetting(client, '', 'user', 'Granit.Localization.PreferredCulture');

      expect(client.delete).toHaveBeenCalledWith(
        '/settings/user/Granit.Localization.PreferredCulture'
      );
    });
  });
});
