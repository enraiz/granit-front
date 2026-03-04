import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import axios from 'axios';
import { describe, expect, it, vi } from 'vitest';

import { useImportReport } from '../../import/hooks/use-import-report.js';
import { ImportProvider } from '../../import/providers/import-provider.js';

import type { ImportConfig } from '../../import/providers/import-provider.js';
import type { ReactNode } from 'react';

const mockClient = axios.create();

const mockConfig: ImportConfig = {
  client: mockClient,
  basePath: '/api/import',
};

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ImportProvider config={mockConfig}>{children}</ImportProvider>
      </QueryClientProvider>
    );
  };
}

describe('useImportReport', () => {
  it('fetches report when jobId is provided', async () => {
    const report = {
      importJobId: 'job-1',
      finalStatus: 'Completed',
      totalRows: 100,
      succeededRows: 95,
      failedRows: 5,
      skippedRows: 0,
      insertedRows: 90,
      updatedRows: 5,
      duration: '00:00:03',
      rowErrors: [],
    };
    vi.spyOn(mockClient, 'get').mockResolvedValueOnce({ data: report });

    const { result } = renderHook(() => useImportReport('job-1'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.report.isSuccess).toBe(true));
    expect(result.current.report.data).toEqual(report);
  });

  it('does not fetch when jobId is undefined', () => {
    const { result } = renderHook(() => useImportReport(undefined), {
      wrapper: createWrapper(),
    });

    expect(result.current.report.fetchStatus).toBe('idle');
  });

  it('exposes downloadCorrection function', () => {
    const { result } = renderHook(() => useImportReport('job-1'), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.downloadCorrection).toBe('function');
  });
});
