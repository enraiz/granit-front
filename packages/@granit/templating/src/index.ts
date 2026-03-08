// ---------------------------------------------------------------------------
// @granit/templating — public API
// ---------------------------------------------------------------------------

// Types
export { DocumentFormat, TemplateLifecycleStatus } from './types/index.js';

export type {
  CreateTemplateCategoryRequest,
  DocumentFormatValue,
  SaveTemplateRequest,
  TemplateCategory,
  TemplateDetail,
  TemplateHistory,
  TemplateKey,
  TemplateLifecycleInfo,
  TemplateLifecycleStatusValue,
  TemplateListItem,
  TemplateListParams,
  TemplateParseError,
  TemplatePreviewRequest,
  TemplatePreviewResponse,
  TemplateRevision,
  TemplateRevisionSummary,
  TemplateVariable,
  TemplateVariables,
  TemplatingConfig,
  UpdateTemplateCategoryRequest,
} from './types/index.js';

// Provider
export { TemplatingProvider, useTemplatingConfig } from './providers/templating-provider.js';
export type { TemplatingProviderProps } from './providers/templating-provider.js';

// Hooks
export { useTemplate } from './hooks/use-template.js';
export {
  useTemplateCategories,
  useTemplateCategoryMutations,
} from './hooks/use-template-categories.js';
export { useTemplateHistory, useTemplateRevision } from './hooks/use-template-history.js';
export { useTemplateMutations } from './hooks/use-template-mutations.js';
export { useTemplateBinaryPreview, useTemplatePreview } from './hooks/use-template-preview.js';
export { useTemplateVariables } from './hooks/use-template-variables.js';
export { useTemplates } from './hooks/use-templates.js';

// Query keys (for advanced usage / custom queries)
export { templateKeys } from './hooks/query-keys.js';

// API (for advanced usage)
export {
  createCategory,
  deleteCategory,
  deleteDraft,
  getCategories,
  getHistory,
  getLifecycleInfo,
  getRevision,
  getTemplate,
  getTemplates,
  getVariables,
  previewTemplate,
  previewTemplateBinary,
  publishTemplate,
  saveDraft,
  unpublishTemplate,
  updateCategory,
  updateDraft,
} from './api/templates-api.js';
