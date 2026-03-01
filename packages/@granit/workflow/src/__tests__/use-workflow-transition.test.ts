import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useWorkflowTransition } from '../use-workflow-transition.ts';

import { axiosResponse, createMockClient, createWrapper } from './test-utils.tsx';

import type { TransitionResultDto } from '../types.ts';

describe('useWorkflowTransition', () => {
  it('executes a transition successfully', async () => {
    const client = createMockClient();
    const transitionResult: TransitionResultDto = {
      succeeded: true,
      resultingState: 'Published',
      outcome: 'Completed',
    };
    vi.mocked(client.post).mockResolvedValue(axiosResponse(transitionResult));
    const onSuccess = vi.fn();

    const { result } = renderHook(
      () => useWorkflowTransition({
        entityType: 'Document',
        entityId: 'doc-1',
        onSuccess,
      }),
      { wrapper: createWrapper(client) },
    );

    let returned: TransitionResultDto | null = null;
    await act(async () => {
      returned = await result.current.transition('Published', 'Validated');
    });

    expect(client.post).toHaveBeenCalledWith(
      '/api/workflow/Document/doc-1/transition',
      { targetState: 'Published', comment: 'Validated' },
    );
    expect(returned).toEqual(transitionResult);
    expect(result.current.result).toEqual(transitionResult);
    expect(onSuccess).toHaveBeenCalledWith(transitionResult);
    expect(result.current.loading).toBe(false);
  });

  it('handles transition error', async () => {
    const client = createMockClient();
    vi.mocked(client.post).mockRejectedValue(new Error('Forbidden'));
    const onError = vi.fn();

    const { result } = renderHook(
      () => useWorkflowTransition({
        entityType: 'Document',
        entityId: 'doc-1',
        onError,
      }),
      { wrapper: createWrapper(client) },
    );

    let returned: TransitionResultDto | null = null;
    await act(async () => {
      returned = await result.current.transition('Published');
    });

    expect(returned).toBeNull();
    expect(result.current.error?.message).toBe('Forbidden');
    expect(onError).toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('sets loading state during transition', async () => {
    const client = createMockClient();
    let resolvePost!: (value: unknown) => void;
    vi.mocked(client.post).mockReturnValue(
      new Promise((resolve) => { resolvePost = resolve; }),
    );

    const { result } = renderHook(
      () => useWorkflowTransition({
        entityType: 'Document',
        entityId: 'doc-1',
      }),
      { wrapper: createWrapper(client) },
    );

    expect(result.current.loading).toBe(false);

    let promise: Promise<unknown>;
    act(() => {
      promise = result.current.transition('Published');
    });

    await waitFor(() => expect(result.current.loading).toBe(true));

    await act(async () => {
      resolvePost(axiosResponse({
        succeeded: true,
        resultingState: 'Published',
        outcome: 'Completed',
      }));
      await promise!;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles approval-requested outcome', async () => {
    const client = createMockClient();
    const transitionResult: TransitionResultDto = {
      succeeded: true,
      resultingState: 'PendingReview',
      outcome: 'ApprovalRequested',
    };
    vi.mocked(client.post).mockResolvedValue(axiosResponse(transitionResult));

    const { result } = renderHook(
      () => useWorkflowTransition({
        entityType: 'Document',
        entityId: 'doc-1',
      }),
      { wrapper: createWrapper(client) },
    );

    let returned: TransitionResultDto | null = null;
    await act(async () => {
      returned = await result.current.transition('Published');
    });

    expect(returned!.outcome).toBe('ApprovalRequested');
    expect(returned!.resultingState).toBe('PendingReview');
  });
});
