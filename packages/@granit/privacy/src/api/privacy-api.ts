import type {
  AcceptAgreementRequest,
  AgreementHistoryEntry,
  AgreementStatus,
  LegalDocument,
  PrivacyDeletionRequest,
  PrivacyExportRequestResponse,
  PrivacyExportStatusResponse,
} from '../types/index.js';
import type { AxiosInstance } from 'axios';

// ── Data Export (GDPR Art. 15/20) ────────────────────────────────────────────

/**
 * Request a GDPR data export. Returns 202 with the request ID.
 *
 * `POST {basePath}/export`
 */
export async function requestExport(
  client: AxiosInstance,
  basePath: string
): Promise<PrivacyExportRequestResponse> {
  const { data } = await client.post<PrivacyExportRequestResponse>(`${basePath}/export`);
  return data;
}

/**
 * Get the status of a data export request.
 *
 * `GET {basePath}/export/{requestId}`
 */
export async function getExportStatus(
  client: AxiosInstance,
  basePath: string,
  requestId: string
): Promise<PrivacyExportStatusResponse> {
  const { data } = await client.get<PrivacyExportStatusResponse>(
    `${basePath}/export/${encodeURIComponent(requestId)}`
  );
  return data;
}

/**
 * List all data export requests for the current user.
 *
 * `GET {basePath}/export`
 */
export async function listExports(
  client: AxiosInstance,
  basePath: string
): Promise<PrivacyExportStatusResponse[]> {
  const { data } = await client.get<PrivacyExportStatusResponse[]>(`${basePath}/export`);
  return data;
}

// ── Data Deletion (GDPR Art. 17) ─────────────────────────────────────────────

/**
 * Request deletion of all personal data. Returns 202 (fire-and-forget).
 *
 * `POST {basePath}/deletion`
 */
export async function requestDeletion(
  client: AxiosInstance,
  basePath: string,
  request: PrivacyDeletionRequest
): Promise<void> {
  await client.post(`${basePath}/deletion`, request);
}

// ── Legal Agreements (GDPR Art. 7) ───────────────────────────────────────────

/**
 * List all legal documents.
 *
 * `GET {basePath}/agreements/documents`
 */
export async function getAgreementDocuments(
  client: AxiosInstance,
  basePath: string
): Promise<LegalDocument[]> {
  const { data } = await client.get<LegalDocument[]>(`${basePath}/agreements/documents`);
  return data;
}

/**
 * Get the acceptance status for each legal document.
 *
 * `GET {basePath}/agreements/status`
 */
export async function getAgreementStatuses(
  client: AxiosInstance,
  basePath: string
): Promise<AgreementStatus[]> {
  const { data } = await client.get<AgreementStatus[]>(`${basePath}/agreements/status`);
  return data;
}

/**
 * Get the full acceptance history.
 *
 * `GET {basePath}/agreements/history`
 */
export async function getAgreementHistory(
  client: AxiosInstance,
  basePath: string
): Promise<AgreementHistoryEntry[]> {
  const { data } = await client.get<AgreementHistoryEntry[]>(`${basePath}/agreements/history`);
  return data;
}

/**
 * Accept a legal document version.
 *
 * `POST {basePath}/agreements/accept`
 *
 * Returns 201 on success, 404 if document unknown, 409 if already accepted,
 * 422 if version mismatch.
 */
export async function acceptAgreement(
  client: AxiosInstance,
  basePath: string,
  request: AcceptAgreementRequest
): Promise<void> {
  await client.post(`${basePath}/agreements/accept`, request);
}
