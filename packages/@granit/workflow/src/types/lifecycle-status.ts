// ── Workflow lifecycle status (mirrors .NET Granit.Workflow.Domain.WorkflowLifecycleStatus) ──

export const WorkflowLifecycleStatus = {
  Draft: 0,
  PendingReview: 1,
  Published: 2,
  Archived: 3,
} as const;

export type WorkflowLifecycleStatusValue =
  (typeof WorkflowLifecycleStatus)[keyof typeof WorkflowLifecycleStatus];
