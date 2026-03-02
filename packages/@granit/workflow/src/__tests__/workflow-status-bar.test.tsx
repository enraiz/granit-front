import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { WorkflowStatusBar } from '../workflow-status-bar.tsx';

import type { TransitionDto } from '../types.ts';

const STATES = ['Draft', 'PendingReview', 'Published', 'Archived'];

describe('WorkflowStatusBar', () => {
  it('should render all states', () => {
    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={[]}
      />,
    );

    expect(screen.getByTestId('workflow-states')).toBeTruthy();
    expect(screen.getByTestId('workflow-state-Draft')).toBeTruthy();
    expect(screen.getByTestId('workflow-state-PendingReview')).toBeTruthy();
    expect(screen.getByTestId('workflow-state-Published')).toBeTruthy();
    expect(screen.getByTestId('workflow-state-Archived')).toBeTruthy();
  });

  it('should mark current state with data-current', () => {
    render(
      <WorkflowStatusBar
        currentState="Published"
        states={STATES}
        transitions={[]}
      />,
    );

    expect(screen.getByTestId('workflow-state-Published').getAttribute('data-current')).toBe('true');
    expect(screen.getByTestId('workflow-state-Draft').getAttribute('data-current')).toBe('false');
  });

  it('should mark past states with data-past', () => {
    render(
      <WorkflowStatusBar
        currentState="Published"
        states={STATES}
        transitions={[]}
      />,
    );

    expect(screen.getByTestId('workflow-state-Draft').getAttribute('data-past')).toBe('true');
    expect(screen.getByTestId('workflow-state-PendingReview').getAttribute('data-past')).toBe('true');
    expect(screen.getByTestId('workflow-state-Published').getAttribute('data-past')).toBe('false');
    expect(screen.getByTestId('workflow-state-Archived').getAttribute('data-past')).toBe('false');
  });

  it('should set aria-current on active state', () => {
    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={[]}
      />,
    );

    expect(screen.getByTestId('workflow-state-Draft').getAttribute('aria-current')).toBe('step');
    expect(screen.getByTestId('workflow-state-Published').getAttribute('aria-current')).toBeNull();
  });

  it('should render transition action buttons', () => {
    const transitions: TransitionDto[] = [
      { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: false },
      { targetState: 'Archived', name: 'Archiver', allowed: true, requiresApproval: false },
    ];

    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={transitions}
      />,
    );

    expect(screen.getByTestId('workflow-actions')).toBeTruthy();
    expect(screen.getByTestId('workflow-action-Published').textContent).toBe('Publier');
    expect(screen.getByTestId('workflow-action-Archived').textContent).toBe('Archiver');
  });

  it('should call onTransition when clicking an action', () => {
    const onTransition = vi.fn();
    const transitions: TransitionDto[] = [
      { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: false },
    ];

    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={transitions}
        onTransition={onTransition}
      />,
    );

    fireEvent.click(screen.getByTestId('workflow-action-Published'));

    expect(onTransition).toHaveBeenCalledWith('Published');
  });

  it('should disable buttons when isLoading is true', () => {
    const transitions: TransitionDto[] = [
      { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: false },
    ];

    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={transitions}
        isLoading
      />,
    );

    expect(
      (screen.getByTestId('workflow-action-Published') as HTMLButtonElement).disabled,
    ).toBe(true);
  });

  it('should show approval label when requiresApproval is true and not allowed', () => {
    const transitions: TransitionDto[] = [
      { targetState: 'Published', name: 'Publier', allowed: false, requiresApproval: true },
    ];

    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={transitions}
      />,
    );

    expect(screen.getByTestId('workflow-action-Published').textContent).toBe(
      "Demander l'approbation",
    );
  });

  it('should show normal label when requiresApproval but allowed', () => {
    const transitions: TransitionDto[] = [
      { targetState: 'Published', name: 'Publier', allowed: true, requiresApproval: true },
    ];

    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={transitions}
      />,
    );

    expect(screen.getByTestId('workflow-action-Published').textContent).toBe('Publier');
  });

  it('should hide actions div when no transitions', () => {
    render(
      <WorkflowStatusBar
        currentState="Archived"
        states={STATES}
        transitions={[]}
      />,
    );

    expect(screen.queryByTestId('workflow-actions')).toBeNull();
  });

  it('should apply custom className', () => {
    render(
      <WorkflowStatusBar
        currentState="Draft"
        states={STATES}
        transitions={[]}
        className="custom-bar"
      />,
    );

    expect(screen.getByTestId('workflow-status-bar').className).toBe('custom-bar');
  });
});
