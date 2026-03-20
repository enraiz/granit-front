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

// API
export {
  executeStateMachineTransition,
  executeTransition,
  fetchHistory,
  fetchStatus,
  fetchTransitions,
} from './api/workflow-api.js';
export type { WorkflowHistoryPage } from './api/workflow-api.js';
