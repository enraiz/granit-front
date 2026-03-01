import { describe, expect, it, vi } from 'vitest';

import { executeTransition, fetchHistory, fetchStatus } from '../api.ts';

import { axiosResponse, createMockClient } from './test-utils.tsx';

import type { TransitionHistoryDto, TransitionResultDto, WorkflowStatusDto } from '../types.ts';

describe('workflow api', () => {
  const basePath = '/api/workflow';
  const entityType = 'Document';
  const entityId = 'doc-1';

  it('fetchStatus calls GET with correct URL', async () => {
    const client = createMockClient();
    const status: WorkflowStatusDto = {
      currentState: 'Draft',
      availableTransitions: [
        { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: false },
      ],
    };
    vi.mocked(client.get).mockResolvedValue(axiosResponse(status));

    const result = await fetchStatus(client, basePath, entityType, entityId);

    expect(client.get).toHaveBeenCalledWith('/api/workflow/Document/doc-1/transitions');
    expect(result).toEqual(status);
  });

  it('executeTransition calls POST with correct URL and body', async () => {
    const client = createMockClient();
    const transitionResult: TransitionResultDto = {
      succeeded: true,
      resultingState: 'Published',
      outcome: 'Completed',
    };
    vi.mocked(client.post).mockResolvedValue(axiosResponse(transitionResult));

    const result = await executeTransition(client, basePath, entityType, entityId, {
      targetState: 'Published',
      comment: 'Ready to publish',
    });

    expect(client.post).toHaveBeenCalledWith(
      '/api/workflow/Document/doc-1/transition',
      { targetState: 'Published', comment: 'Ready to publish' },
    );
    expect(result).toEqual(transitionResult);
  });

  it('fetchHistory calls GET with correct URL', async () => {
    const client = createMockClient();
    const history: TransitionHistoryDto[] = [
      {
        previousState: 'Draft',
        newState: 'Published',
        transitionedAt: '2026-01-15T10:00:00Z',
        transitionedBy: 'Dr. Martin',
        comment: null,
      },
    ];
    vi.mocked(client.get).mockResolvedValue(axiosResponse(history));

    const result = await fetchHistory(client, basePath, entityType, entityId);

    expect(client.get).toHaveBeenCalledWith('/api/workflow/Document/doc-1/history');
    expect(result).toEqual(history);
  });
});
