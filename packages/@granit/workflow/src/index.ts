// ---------------------------------------------------------------------------
// @granit/workflow — public API
// ---------------------------------------------------------------------------

// Types
export { TransitionOutcome } from './types/index.js';
export { WorkflowLifecycleStatus } from './types/index.js';

export type {
  TransitionDto,
  TransitionHistoryDto,
  TransitionOutcomeValue,
  TransitionRequestDto,
  TransitionResultDto,
  WorkflowConfig,
  WorkflowLifecycleStatusValue,
  WorkflowStatusDto,
} from './types/index.js';

export type { WorkflowHistoryPage } from './api/workflow-api.js';

// Provider
export { useWorkflowConfig, WorkflowProvider } from './providers/workflow-provider.js';
export type { WorkflowProviderProps } from './providers/workflow-provider.js';

// Hooks
export { useWorkflowHistory } from './hooks/use-workflow-history.js';
export type {
  UseWorkflowHistoryOptions,
  UseWorkflowHistoryReturn,
} from './hooks/use-workflow-history.js';

export { useWorkflowStatus } from './hooks/use-workflow-status.js';
export type {
  UseWorkflowStatusOptions,
  UseWorkflowStatusReturn,
} from './hooks/use-workflow-status.js';

export { useWorkflowTransition } from './hooks/use-workflow-transition.js';
export type {
  UseWorkflowTransitionOptions,
  UseWorkflowTransitionReturn,
} from './hooks/use-workflow-transition.js';
