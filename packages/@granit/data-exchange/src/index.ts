// ---------------------------------------------------------------------------
// @granit/data-exchange — public API
// ---------------------------------------------------------------------------

// Export types
export type {
  CreateExportJobRequest,
  ExportDefinitionResponse,
  ExportField,
  ExportJobListParams,
  ExportJobResponse,
  ExportJobStatus,
  ExportPresetResponse,
  SaveExportPresetRequest,
} from './export/index.js';

// Export API
export {
  createExportJob,
  deleteExportPreset,
  downloadExportFile,
  fetchExportDefinitions,
  fetchExportFields,
  fetchExportJobs,
  fetchExportJobStatus,
  fetchExportPresets,
  saveExportPreset,
} from './export/index.js';

// Import types
export type {
  ConfirmMappingsRequest,
  ImportColumnMapping,
  ImportFieldMetadata,
  ImportJobListParams,
  ImportJobResponse,
  ImportJobStatus,
  ImportPreviewResponse,
  ImportReportResponse,
  ImportRowError,
  ImportRowErrorKind,
  MappingConfidence,
} from './import/index.js';

// Import API
export {
  cancelImportJob,
  confirmMappings,
  downloadCorrectionFile,
  dryRunImport,
  executeImport,
  fetchImportJob,
  fetchImportJobs,
  fetchImportReport,
  previewImport,
  uploadImportFile,
} from './import/index.js';
