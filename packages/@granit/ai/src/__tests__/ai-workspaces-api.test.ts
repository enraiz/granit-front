import { createMockClient } from '@granit/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  createAIWorkspace,
  deleteAIWorkspace,
  fetchAIWorkspace,
  fetchAIWorkspaces,
  updateAIWorkspace,
} from '../api/ai-workspaces-api.js';

describe('ai-workspaces-api', () => {
  describe('fetchAIWorkspaces', () => {
    it('should GET /ai/workspaces', async () => {
      const client = createMockClient();
      const data = { workspaces: [], totalCount: 0 };
      vi.mocked(client.get).mockResolvedValue({ data });

      const result = await fetchAIWorkspaces(client, '');

      expect(client.get).toHaveBeenCalledWith('/ai/workspaces');
      expect(result).toEqual(data);
    });

    it('should prepend basePath', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: { workspaces: [], totalCount: 0 } });

      await fetchAIWorkspaces(client, '/api/v1');

      expect(client.get).toHaveBeenCalledWith('/api/v1/ai/workspaces');
    });
  });

  describe('fetchAIWorkspace', () => {
    it('should GET /ai/workspaces/{name}', async () => {
      const client = createMockClient();
      const workspace = { name: 'default', provider: 'OpenAI', model: 'gpt-4o' };
      vi.mocked(client.get).mockResolvedValue({ data: workspace });

      const result = await fetchAIWorkspace(client, '', 'default');

      expect(client.get).toHaveBeenCalledWith('/ai/workspaces/default');
      expect(result).toEqual(workspace);
    });

    it('should encode workspace name in URL', async () => {
      const client = createMockClient();
      vi.mocked(client.get).mockResolvedValue({ data: {} });

      await fetchAIWorkspace(client, '/api', 'my workspace');

      expect(client.get).toHaveBeenCalledWith('/api/ai/workspaces/my%20workspace');
    });
  });

  describe('createAIWorkspace', () => {
    it('should POST /ai/workspaces', async () => {
      const client = createMockClient();
      const request = { name: 'test', provider: 'OpenAI', model: 'gpt-4o' };
      const response = { ...request, kind: 'Dynamic', isActive: true };
      vi.mocked(client.post).mockResolvedValue({ data: response });

      const result = await createAIWorkspace(client, '', request);

      expect(client.post).toHaveBeenCalledWith('/ai/workspaces', request);
      expect(result).toEqual(response);
    });
  });

  describe('updateAIWorkspace', () => {
    it('should PUT /ai/workspaces/{name}', async () => {
      const client = createMockClient();
      const request = { provider: 'OpenAI', model: 'gpt-4o-mini', isActive: true };
      vi.mocked(client.put).mockResolvedValue({ data: { name: 'test', ...request } });

      await updateAIWorkspace(client, '', 'test', request);

      expect(client.put).toHaveBeenCalledWith('/ai/workspaces/test', request);
    });
  });

  describe('deleteAIWorkspace', () => {
    it('should DELETE /ai/workspaces/{name}', async () => {
      const client = createMockClient();
      vi.mocked(client.delete).mockResolvedValue({ data: undefined });

      await deleteAIWorkspace(client, '', 'test');

      expect(client.delete).toHaveBeenCalledWith('/ai/workspaces/test');
    });

    it('should encode workspace name in URL', async () => {
      const client = createMockClient();
      vi.mocked(client.delete).mockResolvedValue({ data: undefined });

      await deleteAIWorkspace(client, '/api', 'my workspace');

      expect(client.delete).toHaveBeenCalledWith('/api/ai/workspaces/my%20workspace');
    });
  });
});
