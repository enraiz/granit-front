import { createMockClient } from '@granit/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  deleteFeatureOverride,
  fetchFeatureDefinitions,
  fetchFeatureValue,
  fetchFeatureValues,
  setFeatureOverride,
} from '../api/features-api.js';

describe('features-api', () => {
  describe('fetchFeatureDefinitions', () => {
    it('should GET /features/definitions', async () => {
      const client = createMockClient();
      const data = [{ name: 'Acme', displayName: 'Acme Features', features: [] }];
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchFeatureDefinitions(client, '');

      expect(client.get).toHaveBeenCalledWith('/features/definitions');
      expect(result).toEqual(data);
    });

    it('should prepend basePath', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: [] });

      await fetchFeatureDefinitions(client, '/api/v1');

      expect(client.get).toHaveBeenCalledWith('/api/v1/features/definitions');
    });
  });

  describe('fetchFeatureValues', () => {
    it('should GET /features/values', async () => {
      const client = createMockClient();
      const data = { 'Acme.Video': 'true', 'Acme.MaxUsers': '50' };
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchFeatureValues(client, '');

      expect(client.get).toHaveBeenCalledWith('/features/values');
      expect(result).toEqual(data);
    });

    it('should prepend basePath', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: {} });

      await fetchFeatureValues(client, '/api/v1');

      expect(client.get).toHaveBeenCalledWith('/api/v1/features/values');
    });
  });

  describe('fetchFeatureValue', () => {
    it('should GET /features/values/{name}', async () => {
      const client = createMockClient();
      const data = { name: 'Acme.Video', value: 'true' };
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchFeatureValue(client, '', 'Acme.Video');

      expect(client.get).toHaveBeenCalledWith('/features/values/Acme.Video');
      expect(result).toEqual(data);
    });

    it('should encode feature name in URL', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: { name: 'a b', value: 'x' } });

      await fetchFeatureValue(client, '/api', 'a b');

      expect(client.get).toHaveBeenCalledWith('/api/features/values/a%20b');
    });
  });

  describe('setFeatureOverride', () => {
    it('should PUT /features/overrides/{name}', async () => {
      const client = createMockClient();
      vi.mocked(client.put).mockResolvedValue({});

      await setFeatureOverride(client, '', 'Acme.MaxUsers', { value: '100' });

      expect(client.put).toHaveBeenCalledWith('/features/overrides/Acme.MaxUsers', {
        value: '100',
      });
    });

    it('should prepend basePath and encode name', async () => {
      const client = createMockClient();
      vi.mocked(client.put).mockResolvedValue({});

      await setFeatureOverride(client, '/api', 'a b', { value: 'true' });

      expect(client.put).toHaveBeenCalledWith('/api/features/overrides/a%20b', {
        value: 'true',
      });
    });
  });

  describe('deleteFeatureOverride', () => {
    it('should DELETE /features/overrides/{name}', async () => {
      const client = createMockClient();
      vi.mocked(client.delete).mockResolvedValue({});

      await deleteFeatureOverride(client, '', 'Acme.Video');

      expect(client.delete).toHaveBeenCalledWith('/features/overrides/Acme.Video');
    });

    it('should prepend basePath and encode name', async () => {
      const client = createMockClient();
      vi.mocked(client.delete).mockResolvedValue({});

      await deleteFeatureOverride(client, '/api', 'a b');

      expect(client.delete).toHaveBeenCalledWith('/api/features/overrides/a%20b');
    });
  });
});
