import { createMockClient } from '@granit/testing';
import { describe, expect, it, vi } from 'vitest';

import {
  acceptAgreement,
  getAgreementDocuments,
  getAgreementHistory,
  getAgreementStatuses,
  getExportStatus,
  listExports,
  requestDeletion,
  requestExport,
} from '../api/privacy-api.js';

import type {
  AgreementHistoryEntry,
  AgreementStatus,
  LegalDocument,
  PrivacyExportStatusResponse,
} from '../types/index.js';

const BASE = '/api/v1/privacy';

describe('privacy-api', () => {
  // ── Data Export ──────────────────────────────────────────────────────────

  describe('requestExport', () => {
    it('sends POST to /export', async () => {
      const client = createMockClient();
      const response = { requestId: 'req-1', requestedAt: '2026-03-21T10:00:00Z' };
      vi.mocked(client.post).mockResolvedValueOnce({ data: response });

      const result = await requestExport(client, BASE);

      expect(client.post).toHaveBeenCalledWith(`${BASE}/export`);
      expect(result).toEqual(response);
    });
  });

  describe('getExportStatus', () => {
    it('sends GET to /export/{requestId}', async () => {
      const client = createMockClient();
      const response: PrivacyExportStatusResponse = {
        requestId: 'req-1',
        requestedAt: '2026-03-21T10:00:00Z',
        state: 'Completed',
        archiveBlobReferenceId: 'blob-123',
      };
      vi.mocked(client.get).mockResolvedValueOnce({ data: response });

      const result = await getExportStatus(client, BASE, 'req-1');

      expect(client.get).toHaveBeenCalledWith(`${BASE}/export/req-1`);
      expect(result).toEqual(response);
    });
  });

  describe('listExports', () => {
    it('sends GET to /export', async () => {
      const client = createMockClient();
      const response: PrivacyExportStatusResponse[] = [];
      vi.mocked(client.get).mockResolvedValueOnce({ data: response });

      const result = await listExports(client, BASE);

      expect(client.get).toHaveBeenCalledWith(`${BASE}/export`);
      expect(result).toEqual(response);
    });
  });

  // ── Data Deletion ───────────────────────────────────────────────────────

  describe('requestDeletion', () => {
    it('sends POST to /deletion with reason', async () => {
      const client = createMockClient();
      vi.mocked(client.post).mockResolvedValueOnce({ data: undefined });

      await requestDeletion(client, BASE, { reason: 'User requested account deletion' });

      expect(client.post).toHaveBeenCalledWith(`${BASE}/deletion`, {
        reason: 'User requested account deletion',
      });
    });
  });

  // ── Legal Agreements ────────────────────────────────────────────────────

  describe('getAgreementDocuments', () => {
    it('sends GET to /agreements/documents', async () => {
      const client = createMockClient();
      const response: LegalDocument[] = [
        { documentId: 'tos', currentVersion: '2.0', displayName: 'Terms of Service' },
      ];
      vi.mocked(client.get).mockResolvedValueOnce({ data: response });

      const result = await getAgreementDocuments(client, BASE);

      expect(client.get).toHaveBeenCalledWith(`${BASE}/agreements/documents`);
      expect(result).toEqual(response);
    });
  });

  describe('getAgreementStatuses', () => {
    it('sends GET to /agreements/status', async () => {
      const client = createMockClient();
      const response: AgreementStatus[] = [
        {
          documentId: 'tos',
          currentVersion: '2.0',
          hasAcceptedLatest: false,
          lastAcceptedAt: '2025-01-01T00:00:00Z',
        },
      ];
      vi.mocked(client.get).mockResolvedValueOnce({ data: response });

      const result = await getAgreementStatuses(client, BASE);

      expect(client.get).toHaveBeenCalledWith(`${BASE}/agreements/status`);
      expect(result).toEqual(response);
    });
  });

  describe('getAgreementHistory', () => {
    it('sends GET to /agreements/history', async () => {
      const client = createMockClient();
      const response: AgreementHistoryEntry[] = [
        {
          id: 'h-1',
          documentId: 'tos',
          version: '1.0',
          acceptedAt: '2024-06-01T00:00:00Z',
          isLatest: false,
        },
      ];
      vi.mocked(client.get).mockResolvedValueOnce({ data: response });

      const result = await getAgreementHistory(client, BASE);

      expect(client.get).toHaveBeenCalledWith(`${BASE}/agreements/history`);
      expect(result).toEqual(response);
    });
  });

  describe('acceptAgreement', () => {
    it('sends POST to /agreements/accept', async () => {
      const client = createMockClient();
      vi.mocked(client.post).mockResolvedValueOnce({ data: undefined });

      await acceptAgreement(client, BASE, { documentId: 'tos', version: '2.0' });

      expect(client.post).toHaveBeenCalledWith(`${BASE}/agreements/accept`, {
        documentId: 'tos',
        version: '2.0',
      });
    });
  });
});
