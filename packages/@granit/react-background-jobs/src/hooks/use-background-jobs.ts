import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { BackgroundJobStatus } from '@granit/background-jobs';
import type { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import type { AxiosInstance } from 'axios';

const DEFAULT_BASE_PATH = '/api/v1/background-jobs';

/** Options accepted by all background-jobs hooks. */
export interface BackgroundJobsOptions {
  /** Axios instance used for all requests. */
  readonly client: AxiosInstance;
  /** Base URL for the background-jobs API. Defaults to `/api/v1/background-jobs`. */
  readonly basePath?: string;
}

/** Query key factory for background jobs queries. */
export const backgroundJobKeys = {
  all: ['background-jobs'] as const,
  list: () => [...backgroundJobKeys.all, 'list'] as const,
  job: (name: string) => [...backgroundJobKeys.all, 'job', name] as const,
};

/**
 * Query hook that fetches the list of all background jobs with their current status.
 *
 * Polls every 15 seconds to reflect live scheduler state.
 *
 * @example
 * ```tsx
 * const { data: jobs } = useBackgroundJobs({ client: api });
 * ```
 */
export function useBackgroundJobs(
  options: BackgroundJobsOptions
): UseQueryResult<readonly BackgroundJobStatus[]> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: backgroundJobKeys.list(),
    queryFn: async () => {
      const response = await client.get<readonly BackgroundJobStatus[]>(basePath);
      return response.data;
    },
    refetchInterval: 15_000,
  });
}

/**
 * Query hook that fetches a single background job by name.
 *
 * Polls every 15 seconds to reflect live scheduler state.
 * The query is disabled when the name is empty.
 *
 * @example
 * ```tsx
 * const { data: job } = useBackgroundJob('InvoiceSync', { client: api });
 * ```
 */
export function useBackgroundJob(
  name: string,
  options: BackgroundJobsOptions
): UseQueryResult<BackgroundJobStatus> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;

  return useQuery({
    queryKey: backgroundJobKeys.job(name),
    queryFn: async () => {
      const { data } = await client.get<BackgroundJobStatus>(
        `${basePath}/${encodeURIComponent(name)}`
      );
      return data;
    },
    refetchInterval: 15_000,
    enabled: name.length > 0,
  });
}

/**
 * Mutation hook to pause a background job by name.
 *
 * Sends `POST {basePath}/{name}/pause` and invalidates the jobs list on success.
 *
 * @example
 * ```tsx
 * const { mutate: pause } = usePauseJob({ client: api });
 * pause('InvoiceSync');
 * ```
 */
export function usePauseJob(
  options: BackgroundJobsOptions
): UseMutationResult<void, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobName: string) => {
      await client.post(`${basePath}/${encodeURIComponent(jobName)}/pause`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: backgroundJobKeys.list() });
    },
  });
}

/**
 * Mutation hook to resume a paused background job by name.
 *
 * Sends `POST {basePath}/{name}/resume` and invalidates the jobs list on success.
 *
 * @example
 * ```tsx
 * const { mutate: resume } = useResumeJob({ client: api });
 * resume('InvoiceSync');
 * ```
 */
export function useResumeJob(
  options: BackgroundJobsOptions
): UseMutationResult<void, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobName: string) => {
      await client.post(`${basePath}/${encodeURIComponent(jobName)}/resume`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: backgroundJobKeys.list() });
    },
  });
}

/**
 * Mutation hook to manually trigger a background job by name.
 *
 * Sends `POST {basePath}/{name}/trigger` and invalidates the jobs list on success.
 *
 * @example
 * ```tsx
 * const { mutate: trigger } = useTriggerJob({ client: api });
 * trigger('InvoiceSync');
 * ```
 */
export function useTriggerJob(
  options: BackgroundJobsOptions
): UseMutationResult<void, Error, string> {
  const { client, basePath = DEFAULT_BASE_PATH } = options;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (jobName: string) => {
      await client.post(`${basePath}/${encodeURIComponent(jobName)}/trigger`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: backgroundJobKeys.list() });
    },
  });
}
