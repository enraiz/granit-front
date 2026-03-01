import type { TransitionDto } from './types.ts';

export interface WorkflowStatusBarProps {
  readonly currentState: string;
  readonly states: readonly string[];
  readonly transitions: readonly TransitionDto[];
  readonly onTransition?: (targetState: string, comment?: string) => void;
  readonly isLoading?: boolean;
  readonly className?: string;
}

/**
 * Headless workflow status bar (Odoo-style).
 *
 * Renders the workflow states as chips/steps with action buttons for
 * available transitions. Fully headless — uses `data-*` attributes
 * for custom styling.
 */
export function WorkflowStatusBar({
  currentState,
  states,
  transitions,
  onTransition,
  isLoading = false,
  className,
}: WorkflowStatusBarProps) {
  const currentIndex = states.indexOf(currentState);

  return (
    <div className={className} data-testid="workflow-status-bar">
      <div data-testid="workflow-states">
        {states.map((state, index) => {
          const isCurrent = state === currentState;
          const isPast = index < currentIndex;

          return (
            <span
              key={state}
              data-state={state}
              data-current={isCurrent}
              data-past={isPast}
              data-testid={`workflow-state-${state}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {state}
            </span>
          );
        })}
      </div>

      {transitions.length > 0 && (
        <div data-testid="workflow-actions" role="group" aria-label="Workflow actions">
          {transitions.map((t) => {
            const label = t.requiresApproval && !t.allowed
              ? `Demander l'approbation`
              : t.name;

            return (
              <button
                key={t.targetState}
                type="button"
                disabled={isLoading}
                data-target={t.targetState}
                data-requires-approval={t.requiresApproval}
                data-testid={`workflow-action-${t.targetState}`}
                onClick={() => onTransition?.(t.targetState)}
              >
                {label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
