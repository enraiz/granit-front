import type { TransitionDto } from './transition.js';

/** Current workflow status of an entity. */
export interface WorkflowStatusDto {
  readonly currentState: string;
  readonly availableTransitions: readonly TransitionDto[];
}
