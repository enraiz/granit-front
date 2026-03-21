import type { WorkflowTransition } from './transition.js';

/** Current workflow status of an entity. */
export interface WorkflowStatus {
  readonly currentState: string;
  readonly availableTransitions: readonly WorkflowTransition[];
}
