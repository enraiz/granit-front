export type { BackgroundJobListParams } from './background-job-list-params.js';

/** Status of a background job. Mirrors Granit.BackgroundJobs.BackgroundJobStatus .NET. */
export interface BackgroundJobStatus {
  readonly jobName: string;
  readonly cronExpression: string;
  readonly isEnabled: boolean;
  readonly lastExecutedAt: string | null;
  readonly nextExecutionAt: string | null;
  readonly consecutiveFailures: number;
  readonly deadLetterCount: number;
  readonly lastError: string | null;
}
