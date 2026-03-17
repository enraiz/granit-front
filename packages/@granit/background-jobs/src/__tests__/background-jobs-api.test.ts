import { describe, expect, it, vi } from 'vitest';

import { fetchBackgroundJob } from '../api/background-jobs-api.js';

import type { BackgroundJobStatus } from '../types/index.js';
import type { AxiosInstance } from 'axios';

function createMockClient(): AxiosInstance {
  return {
    get: vi.fn().mockResolvedValue({ data: {} }),
  } as unknown as AxiosInstance;
}

const BASE = '/api/v1/background-jobs';

describe('background-jobs-api', () => {
  it('fetchBackgroundJob calls GET /{name}', async () => {
    const client = createMockClient();
    const job: BackgroundJobStatus = {
      jobName: 'SendEmails',
      cronExpression: '0 */5 * * *',
      isEnabled: true,
      lastExecutedAt: '2026-03-17T10:00:00Z',
      nextExecutionAt: '2026-03-17T10:05:00Z',
      consecutiveFailures: 0,
      deadLetterCount: 0,
      lastError: null,
    };
    vi.mocked(client.get).mockResolvedValueOnce({ data: job });

    const result = await fetchBackgroundJob(client, BASE, 'SendEmails');
    expect(client.get).toHaveBeenCalledWith(`${BASE}/SendEmails`);
    expect(result).toEqual(job);
  });

  it('encodes job name with special characters', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValueOnce({ data: {} });

    await fetchBackgroundJob(client, BASE, 'Send Emails');
    expect(client.get).toHaveBeenCalledWith(`${BASE}/Send%20Emails`);
  });

  it('returns the response data directly', async () => {
    const client = createMockClient();
    const job: BackgroundJobStatus = {
      jobName: 'CleanUp',
      cronExpression: '0 0 * * *',
      isEnabled: false,
      lastExecutedAt: null,
      nextExecutionAt: null,
      consecutiveFailures: 3,
      deadLetterCount: 1,
      lastError: 'Timeout',
    };
    vi.mocked(client.get).mockResolvedValueOnce({ data: job });

    const result = await fetchBackgroundJob(client, BASE, 'CleanUp');
    expect(result.isEnabled).toBe(false);
    expect(result.lastError).toBe('Timeout');
    expect(result.consecutiveFailures).toBe(3);
  });
});
