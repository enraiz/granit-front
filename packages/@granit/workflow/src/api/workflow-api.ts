import type {
  TransitionHistoryDto,
  TransitionRequestDto,
  TransitionResultDto,
  WorkflowStatusDto,
} from '../types/index.js';
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

/** Fetch the transition history (HDS audit trail) for an entity. */
export async function fetchHistory(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<TransitionHistoryDto[]> {
  const { data } = await client.get<TransitionHistoryDto[]>(
    buildUrl(basePath, entityType, entityId, 'history')
  );
  return data;
}
