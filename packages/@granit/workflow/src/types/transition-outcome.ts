// ── Transition outcome enum (mirrors .NET Granit.Workflow.TransitionOutcome) ──

export const TransitionOutcome = {
  Completed: 'Completed',
  ApprovalRequested: 'ApprovalRequested',
  Denied: 'Denied',
  InvalidTransition: 'InvalidTransition',
} as const;

export type TransitionOutcomeValue =
  (typeof TransitionOutcome)[keyof typeof TransitionOutcome];
