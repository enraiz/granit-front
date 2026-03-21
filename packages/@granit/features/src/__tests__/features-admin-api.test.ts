import { createMockClient } from '@granit/testing';
import { describe, expect, it, vi } from 'vitest';

import { fetchAdminFeatureFlags, toggleAdminFeatureFlag } from '../api/features-api.js';

describe('features-admin-api', () => {
  describe('fetchAdminFeatureFlags', () => {
    it('should GET {basePath}/admin/config/flags', async () => {
      const client = createMockClient();
      const data = [
        {
          key: 'dark-mode',
          label: 'Dark Mode',
          description: '',
          enabled: true,
          lastModified: '',
          modifiedBy: '',
        },
      ];
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchAdminFeatureFlags(client, '/api/v1');

      expect(client.get).toHaveBeenCalledWith('/api/v1/admin/config/flags');
      expect(result).toEqual(data);
    });

    it('should work with empty basePath', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: [] });

      await fetchAdminFeatureFlags(client, '');

      expect(client.get).toHaveBeenCalledWith('/admin/config/flags');
    });
  });

  describe('toggleAdminFeatureFlag', () => {
    it('should PATCH {basePath}/admin/config/flags/{key}', async () => {
      const client = createMockClient();
      vi.mocked(client.patch).mockResolvedValue({});

      await toggleAdminFeatureFlag(client, '/api/v1', 'dark-mode', true);

      expect(client.patch).toHaveBeenCalledWith('/api/v1/admin/config/flags/dark-mode', {
        enabled: true,
      });
    });

    it('should encode the key in the URL', async () => {
      const client = createMockClient();
      vi.mocked(client.patch).mockResolvedValue({});

      await toggleAdminFeatureFlag(client, '', 'feature with spaces', false);

      expect(client.patch).toHaveBeenCalledWith('/admin/config/flags/feature%20with%20spaces', {
        enabled: false,
      });
    });
  });
});
