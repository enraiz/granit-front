import { createMockClient } from '@granit/api-client/test-utils';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useBackgroundJob } from '../hooks/use-background-jobs.js';

import type { BackgroundJobStatus } from '@granit/background-jobs';

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockJob: BackgroundJobStatus = {
  jobName: 'InvoiceSync',
  cronExpression: '0 */1 * * *',
  isEnabled: true,
  lastExecutedAt: '2026-03-12T10:00:00Z',
  nextExecutionAt: '2026-03-12T11:00:00Z',
  consecutiveFailures: 0,
  deadLetterCount: 0,
  lastError: null,
};

describe('useBackgroundJob', () => {
  it('should fetch a single job by name with default basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValueOnce({ data: mockJob });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useBackgroundJob('InvoiceSync', { client }), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/v1/background-jobs/InvoiceSync');
    expect(result.current.data).toEqual(mockJob);
  });

  it('should fetch a single job with custom basePath', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValueOnce({ data: mockJob });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useBackgroundJob('InvoiceSync', { client, basePath: '/api/v2/jobs' }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/v2/jobs/InvoiceSync');
  });

  it('should not fetch when name is empty', () => {
    const client = createMockClient();

    const wrapper = createWrapper();
    const { result } = renderHook(() => useBackgroundJob('', { client }), { wrapper });

    expect(result.current.fetchStatus).toBe('idle');
    expect(client.get).not.toHaveBeenCalled();
  });

  it('should handle fetch error', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValueOnce(new Error('Not Found'));

    const wrapper = createWrapper();
    const { result } = renderHook(() => useBackgroundJob('MissingJob', { client }), { wrapper });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error?.message).toBe('Not Found');
  });

  it('should encode special characters in job name', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockResolvedValueOnce({ data: mockJob });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useBackgroundJob('job/with spaces', { client }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(client.get).toHaveBeenCalledWith('/api/v1/background-jobs/job%2Fwith%20spaces');
  });
});
