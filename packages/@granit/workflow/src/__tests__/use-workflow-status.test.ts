import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkflowStatus } from '../use-workflow-status.ts';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.tsx';

import type { WorkflowStatusDto } from '../types.ts';

describe('useWorkflowStatus', () => {
  it('should load status on mount', async () => {
    const client = createMockClient();
    const status: WorkflowStatusDto = {
      currentState: 'Draft',
      availableTransitions: [
        { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: false },
      ],
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(status));

    const { result } = renderHook(
      () => useWorkflowStatus({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.currentState).toBe('Draft');
    expect(result.current.transitions).toHaveLength(1);
    expect(result.current.transitions[0].name).toBe('Publier');
  });

  it('should set error state on failure', async () => {
    const client = createMockClient();
    vi.mocked(client.get).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(
      () => useWorkflowStatus({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error?.message).toBe('Network error');
    expect(result.current.currentState).toBeNull();
    expect(result.current.transitions).toHaveLength(0);
  });

  it('should refetch when refetch is called', async () => {
    const client = createMockClient();
    const status1: WorkflowStatusDto = {
      currentState: 'Draft',
      availableTransitions: [],
    };
    const status2: WorkflowStatusDto = {
      currentState: 'Published',
      availableTransitions: [],
    };
    vi.mocked(client.get)
      .mockResolvedValueOnce(axiosResponse(status1))
      .mockResolvedValueOnce(axiosResponse(status2));

    const { result } = renderHook(
      () => useWorkflowStatus({ entityType: 'Document', entityId: 'doc-1' }),
      { wrapper: createWrapper(client) },
    );

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.currentState).toBe('Draft');

    await result.current.refetch();

    await waitFor(() => expect(result.current.currentState).toBe('Published'));
  });
});
