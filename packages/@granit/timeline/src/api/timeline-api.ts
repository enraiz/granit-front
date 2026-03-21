import type {
  CreateTimelineEntryRequest,
  TimelineQueryParams,
  TimelineStreamEntry,
  TimelineStreamPage,
} from '../types/index.js';
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

export async function fetchStream(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  params?: TimelineQueryParams
): Promise<TimelineStreamPage> {
  const { data } = await client.get<TimelineStreamPage>(buildUrl(basePath, entityType, entityId), {
    params,
  });
  return data;
}

export async function createEntry(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  request: CreateTimelineEntryRequest
): Promise<TimelineStreamEntry> {
  const { data } = await client.post<TimelineStreamEntry>(
    buildUrl(basePath, entityType, entityId, 'entries'),
    request
  );
  return data;
}

export async function deleteEntry(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string,
  entryId: string
): Promise<void> {
  await client.delete(buildUrl(basePath, entityType, entityId, 'entries', entryId));
}

export async function followEntity(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<void> {
  await client.post(buildUrl(basePath, entityType, entityId, 'follow'));
}

export async function unfollowEntity(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<void> {
  await client.delete(buildUrl(basePath, entityType, entityId, 'follow'));
}

export async function fetchFollowers(
  client: AxiosInstance,
  basePath: string,
  entityType: string,
  entityId: string
): Promise<string[]> {
  const { data } = await client.get<string[]>(
    buildUrl(basePath, entityType, entityId, 'followers')
  );
  return data;
}
