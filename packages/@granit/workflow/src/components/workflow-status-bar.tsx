import { Badge, Button } from '@granit/ui';

import type { TransitionDto } from '../types/index.js';

export interface WorkflowStatusBarProps {
  currentState: string;
  states: readonly string[];
  transitions: readonly TransitionDto[];
  onTransition?: (targetState: string, comment?: string) => void;
  isLoading?: boolean;
  className?: string;
}

/**
 * Workflow status bar (Odoo-style).
 *
 * Renders the workflow states as badge chips with action buttons for
 * available transitions.
 */
export function WorkflowStatusBar({
  currentState,
  states,
  transitions,
  onTransition,
  isLoading = false,
  className,
}: Readonly<WorkflowStatusBarProps>) {
  const currentIndex = states.indexOf(currentState);

  return (
    <div className={className} data-testid="workflow-status-bar">
      <div data-testid="workflow-states">
        {states.map((state, index) => {
          const isCurrent = state === currentState;
          const isPast = index < currentIndex;
          const variant = isCurrent ? 'default' : isPast ? 'secondary' : 'outline';

          return (
            <Badge
              key={state}
              variant={variant}
              data-state={state}
              data-current={isCurrent}
              data-past={isPast}
              data-testid={`workflow-state-${state}`}
              aria-current={isCurrent ? 'step' : undefined}
            >
              {state}
            </Badge>
          );
        })}
      </div>

      {transitions.length > 0 && (
        <fieldset data-testid="workflow-actions" aria-label="Workflow actions">
          {transitions.map((t) => {
            const label = t.requiresApproval && !t.allowed
              ? `Demander l'approbation`
              : t.name;

            return (
              <Button
                key={t.targetState}
                size="sm"
                disabled={isLoading}
                data-target={t.targetState}
                data-requires-approval={t.requiresApproval}
                data-testid={`workflow-action-${t.targetState}`}
                onClick={() => onTransition?.(t.targetState)}
              >
                {label}
              </Button>
            );
          })}
        </fieldset>
      )}
    </div>
  );
}
