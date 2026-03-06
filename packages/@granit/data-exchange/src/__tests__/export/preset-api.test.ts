import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import {
  deleteExportPreset,
  fetchExportPresets,
  saveExportPreset,
} from '../../export/api/preset-api.js';

import type { AxiosInstance } from 'axios';

function createMockClient(): AxiosInstance {
  const client = axios.create();
  vi.spyOn(client, 'get').mockResolvedValue({ data: {} });
  vi.spyOn(client, 'post').mockResolvedValue({ data: {} });
  vi.spyOn(client, 'delete').mockResolvedValue({ data: {} });
  return client;
}

const BASE = '/api/data-exchange/export';

describe('preset-api', () => {
  it('fetchExportPresets calls GET /presets/{definitionName}', async () => {
    const client = createMockClient();
    const presets = [
      {
        definitionName: 'Test',
        presetName: 'Monthly',
        selectedFields: ['Email'],
        format: 'xlsx',
        includeIdForImport: false,
      },
    ];
    vi.mocked(client.get).mockResolvedValueOnce({ data: presets });
    const result = await fetchExportPresets(client, BASE, 'Test');
    expect(client.get).toHaveBeenCalledWith(`${BASE}/presets/Test`);
    expect(result).toEqual(presets);
  });

  it('saveExportPreset calls POST /presets', async () => {
    const client = createMockClient();
    const request = {
      definitionName: 'Test',
      presetName: 'Monthly',
      selectedFields: ['Email', 'Name'],
      format: 'csv',
      includeIdForImport: true,
    };
    await saveExportPreset(client, BASE, request);
    expect(client.post).toHaveBeenCalledWith(`${BASE}/presets`, request);
  });

  it('deleteExportPreset calls DELETE /presets/{definitionName}/{presetName}', async () => {
    const client = createMockClient();
    await deleteExportPreset(client, BASE, 'Test', 'Monthly');
    expect(client.delete).toHaveBeenCalledWith(`${BASE}/presets/Test/Monthly`);
  });

  it('deleteExportPreset encodes names', async () => {
    const client = createMockClient();
    await deleteExportPreset(client, BASE, 'My Export', 'Monthly Report');
    expect(client.delete).toHaveBeenCalledWith(`${BASE}/presets/My%20Export/Monthly%20Report`);
  });
});
