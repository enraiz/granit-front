import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useWorkflowConfig, WorkflowProvider } from '../workflow-provider.tsx';

import { createMockClient } from './test-utils.tsx';

describe('WorkflowProvider', () => {
  it('provides config to children', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useWorkflowConfig(), {
      wrapper: ({ children }) => (
        <WorkflowProvider apiClient={client} basePath="/api/wf">
          {children}
        </WorkflowProvider>
      ),
    });

    expect(result.current.apiClient).toBe(client);
    expect(result.current.basePath).toBe('/api/wf');
  });

  it('uses default basePath', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useWorkflowConfig(), {
      wrapper: ({ children }) => (
        <WorkflowProvider apiClient={client}>
          {children}
        </WorkflowProvider>
      ),
    });

    expect(result.current.basePath).toBe('/api/workflow');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useWorkflowConfig());
    }).toThrow('useWorkflowConfig must be used within a <WorkflowProvider>');
  });

  it('renders children', () => {
    const client = createMockClient();

    render(
      <WorkflowProvider apiClient={client}>
        <div data-testid="child">Hello</div>
      </WorkflowProvider>,
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
