import type {
  TransitionHistoryDto,
  TransitionRequestDto,
  TransitionResultDto,
  WorkflowStatusDto,
} from '../types/index.js';
import type { PagedResult, PaginationParams } from '@granit/querying';
import type { AxiosInstance } from 'axios';

function buildUrl(
  basePath: string,
  entityType: string,
  entityId: string,
  ...segments: string[]
): string {
  const base = `${basePath}/${entityType}/${entityId}`;
  return segments.length > 0 ? `${base}/${segments.join('/')}` : base;
}

/** Fetch current status and available transitions for an entity. */
export async function fetchStatus(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<WorkflowStatusDto> {
  const { data } = await client.get<WorkflowStatusDto>(
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
  request: TransitionRequestDto
): Promise<TransitionResultDto> {
  const { data } = await client.post<TransitionResultDto>(
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
): Promise<WorkflowStatusDto> {
  const { data } = await client.get<WorkflowStatusDto>(`${basePath}/transitions`, {
    params: { currentState },
  });
  return data;
}

/** Execute a state-machine transition (no entity context). */
export async function executeStateMachineTransition(
  client: AxiosInstance,
  basePath: string,
  currentState: string,
  request: TransitionRequestDto
): Promise<TransitionResultDto> {
  const { data } = await client.post<TransitionResultDto>(`${basePath}/transitions`, request, {
    params: { currentState },
  });
  return data;
}

/** Response shape for the paginated workflow history endpoint. */
export type WorkflowHistoryPage = PagedResult<TransitionHistoryDto>;

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
