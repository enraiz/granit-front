import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { WorkflowHistory } from '../workflow-history.tsx';

import type { TransitionHistoryDto } from '../types.ts';

const sampleHistory: TransitionHistoryDto[] = [
  {
    previousState: 'Draft',
    newState: 'PendingReview',
    transitionedAt: '2026-01-10T09:00:00Z',
    transitionedBy: 'Dr. Martin',
    comment: 'Submitted for review',
  },
  {
    previousState: 'PendingReview',
    newState: 'Published',
    transitionedAt: '2026-01-11T14:00:00Z',
    transitionedBy: 'Dr. Marchand',
    comment: null,
  },
];

describe('WorkflowHistory', () => {
  it('shows loading state', () => {
    render(<WorkflowHistory history={[]} loading />);

    expect(screen.getByTestId('workflow-history-loading')).toBeTruthy();
    expect(screen.getByTestId('workflow-history-loading').textContent).toContain('Loading');
  });

  it('shows empty message when no history', () => {
    render(<WorkflowHistory history={[]} />);

    expect(screen.getByTestId('workflow-history-empty')).toBeTruthy();
    expect(screen.getByTestId('workflow-history-empty').textContent).toBe('No transitions yet.');
  });

  it('shows custom empty message', () => {
    render(<WorkflowHistory history={[]} emptyMessage="Aucune transition." />);

    expect(screen.getByTestId('workflow-history-empty').textContent).toBe('Aucune transition.');
  });

  it('renders history entries', () => {
    render(<WorkflowHistory history={sampleHistory} />);

    const entries = screen.getAllByTestId('workflow-history-entry');
    expect(entries).toHaveLength(2);
  });

  it('displays state transition', () => {
    render(<WorkflowHistory history={sampleHistory} />);

    const states = screen.getAllByTestId('workflow-history-states');
    expect(states[0].textContent).toContain('Draft');
    expect(states[0].textContent).toContain('PendingReview');
  });

  it('displays author', () => {
    render(<WorkflowHistory history={sampleHistory} />);

    const authors = screen.getAllByTestId('workflow-history-author');
    expect(authors[0].textContent).toBe('Dr. Martin');
    expect(authors[1].textContent).toBe('Dr. Marchand');
  });

  it('displays date with datetime attribute', () => {
    render(<WorkflowHistory history={sampleHistory} />);

    const dates = screen.getAllByTestId('workflow-history-date');
    expect(dates[0].getAttribute('datetime')).toBe('2026-01-10T09:00:00Z');
  });

  it('displays comment when present', () => {
    render(<WorkflowHistory history={sampleHistory} />);

    const comments = screen.getAllByTestId('workflow-history-comment');
    expect(comments).toHaveLength(1);
    expect(comments[0].textContent).toBe('Submitted for review');
  });

  it('does not render comment element when null', () => {
    render(<WorkflowHistory history={[sampleHistory[1]]} />);

    expect(screen.queryByTestId('workflow-history-comment')).toBeNull();
  });

  it('applies custom className', () => {
    render(<WorkflowHistory history={sampleHistory} className="custom-history" />);

    expect(screen.getByTestId('workflow-history').className).toBe('custom-history');
  });
});
