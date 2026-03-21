import type {
  TransitionHistory,
  WorkflowTransitionRequest,
  WorkflowTransitionResult,
  WorkflowStatus,
} from '../types/index.js';
import type { PagedResult, PaginationParams } from '@granit/querying';
import type { AxiosInstance } from 'axios';

function buildUrl(
  basePath: string,
  entityType: string,
  entityId: string,
  ...segments: string[]
): string {
  const base = `${basePath}/${encodeURIComponent(entityType)}/${encodeURIComponent(entityId)}`;
  return segments.length > 0 ? `${base}/${segments.join('/')}` : base;
}

/** Fetch current status and available transitions for an entity. */
export async function fetchStatus(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<WorkflowStatus> {
  const { data } = await client.get<WorkflowStatus>(
    buildUrl(basePath, entityType, entityId, 'transitions')
  );
  return data;
}

/** Trigger a workflow transition on an entity. */
export async function executeTransition(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  request: WorkflowTransitionRequest
): Promise<WorkflowTransitionResult> {
  const { data } = await client.post<WorkflowTransitionResult>(
    buildUrl(basePath, entityType, entityId, 'transition'),
    request
  );
  return data;
}

/** Fetch available transitions for a given state (state-machine level, no entity context). */
export async function fetchTransitions(
  client: AxiosInstance,
  basePath: string,
  currentState: string
): Promise<WorkflowStatus> {
  const { data } = await client.get<WorkflowStatus>(`${basePath}/transitions`, {
    params: { currentState },
  });
  return data;
}

/** Execute a state-machine transition (no entity context). */
export async function executeStateMachineTransition(
  client: AxiosInstance,
  basePath: string,
  currentState: string,
  request: WorkflowTransitionRequest
): Promise<WorkflowTransitionResult> {
  const { data } = await client.post<WorkflowTransitionResult>(`${basePath}/transitions`, request, {
    params: { currentState },
  });
  return data;
}

/** Response shape for the paginated workflow history endpoint. */
export type WorkflowHistoryPage = PagedResult<TransitionHistory>;

/** Fetch the transition history (HDS audit trail) for an entity. */
export async function fetchHistory(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  params: PaginationParams = {}
): Promise<WorkflowHistoryPage> {
  const { data } = await client.get<WorkflowHistoryPage>(
    buildUrl(basePath, entityType, entityId, 'history'),
    { params }
  );
  return data;
}
