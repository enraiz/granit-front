import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { useExportJobs } from '../../export/hooks/use-export-jobs.js';
import { ExportProvider } from '../../export/providers/export-provider.js';

import type { ExportConfig } from '../../export/providers/export-provider.js';
import type { ReactNode } from 'react';

const mockClient = axios.create();

const mockConfig: ExportConfig = {
  client: mockClient,
  basePath: '/api/v1/data-exchange/metadata',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ExportProvider config={mockConfig}>{children}</ExportProvider>
      </QueryClientProvider>
    );
  };
}

describe('useExportJobs', () => {
  it('fetches export jobs without params', async () => {
    const paginatedResponse = {
      items: [
        {
          id: 'job-1',
          definitionName: 'Test',
          format: 'xlsx',
          status: 'Completed',
          rowCount: 100,
          fileName: 'export.xlsx',
          errorMessage: null,
          createdAt: '2026-03-17T10:00:00Z',
          completedAt: '2026-03-17T10:01:00Z',
        },
      ],
      total: 1,
      page: 1,
      pageSize: 20,
    };
    vi.spyOn(mockClient, 'get').mockResolvedValueOnce({ data: paginatedResponse });

    const { result } = renderHook(() => useExportJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.items).toHaveLength(1);
    expect(result.current.data?.total).toBe(1);
    expect(mockClient.get).toHaveBeenCalledWith('/api/v1/data-exchange/metadata/jobs', {
      params: undefined,
    });
  });

  it('passes filtering params to the API', async () => {
    vi.spyOn(mockClient, 'get').mockResolvedValueOnce({
      data: { items: [], total: 0, page: 1, pageSize: 10 },
    });

    const { result } = renderHook(
      () => useExportJobs({ status: 'Failed', page: 2, pageSize: 10 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockClient.get).toHaveBeenCalledWith('/api/v1/data-exchange/metadata/jobs', {
      params: { status: 'Failed', page: 2, pageSize: 10 },
    });
  });

  it('handles fetch error', async () => {
    vi.spyOn(mockClient, 'get').mockRejectedValueOnce(new Error('Server Error'));

    const { result } = renderHook(() => useExportJobs(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('Server Error');
  });
});
