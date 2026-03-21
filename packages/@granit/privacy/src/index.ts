// Types
export type {
  AcceptAgreementRequest,
  AgreementHistoryEntry,
  AgreementStatus,
  LegalDocument,
  PrivacyDeletionRequest,
  PrivacyExportRequestResponse,
  PrivacyExportStatus,
  PrivacyExportStatusResponse,
} from './types/index.js';

// API
export {
  acceptAgreement,
  getAgreementDocuments,
  getAgreementHistory,
  getAgreementStatuses,
  getExportStatus,
  listExports,
  requestDeletion,
  requestExport,
} from './api/privacy-api.js';
