// Types
export type {
  AcceptAgreementRequest,
  AgreementHistoryEntry,
  AgreementStatus,
  DeletionStatusValue,
  LegalDocument,
  PrivacyDeletionRequest,
  PrivacyDeletionResponse,
  PrivacyExportRequestResponse,
  PrivacyExportStatus,
  PrivacyExportStatusResponse,
} from './types/index.js';

// API
export {
  acceptAgreement,
  cancelDeletion,
  getAgreementDocuments,
  getAgreementHistory,
  getAgreementStatuses,
  getDeletionStatus,
  getExportStatus,
  listDeletions,
  listExports,
  requestDeletion,
  requestExport,
} from './api/privacy-api.js';
