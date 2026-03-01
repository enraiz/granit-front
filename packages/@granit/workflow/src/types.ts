import type { AxiosInstance } from 'axios';

// ── Transition outcome enum ──────────────────────────────────────────

export const TransitionOutcome = {
  Completed: 'Completed',
  ApprovalRequested: 'ApprovalRequested',
  Denied: 'Denied',
  InvalidTransition: 'InvalidTransition',
} as const;

export type TransitionOutcomeValue =
  (typeof TransitionOutcome)[keyof typeof TransitionOutcome];

// ── DTOs (mirror .NET Granit.Workflow.Endpoints) ─────────────────────

/** Single available workflow transition. */
export interface TransitionDto {
  readonly targetState: string;
  readonly name: string;
  readonly allowed: boolean;
  readonly requiresApproval: boolean;
}

/** Current workflow status of an entity. */
export interface WorkflowStatusDto {
  readonly currentState: string;
  readonly availableTransitions: TransitionDto[];
}

/** Result of a transition attempt. */
export interface TransitionResultDto {
  readonly succeeded: boolean;
  readonly resultingState: string;
  readonly outcome: TransitionOutcomeValue;
}

/** Request body to trigger a transition. */
export interface TransitionRequestDto {
  readonly targetState: string;
  readonly comment?: string;
}

/** Single entry in the workflow transition history (HDS audit trail). */
export interface TransitionHistoryDto {
  readonly previousState: string;
  readonly newState: string;
  readonly transitionedAt: string;
  readonly transitionedBy: string;
  readonly comment: string | null;
}

// ── Provider configuration ───────────────────────────────────────────

/** Configuration for the workflow provider context. */
export interface WorkflowConfig {
  readonly apiClient: AxiosInstance;
  readonly basePath: string;
}
