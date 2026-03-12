import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useWorkflowConfig, WorkflowProvider } from '../providers/workflow-provider.js';

import { createMockClient } from './test-utils.tsx';

describe('WorkflowProvider', () => {
  it('should provide config to children', () => {
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

  it('should use default basePath', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useWorkflowConfig(), {
      wrapper: ({ children }) => <WorkflowProvider apiClient={client}>{children}</WorkflowProvider>,
    });

    expect(result.current.basePath).toBe('/api/v1/workflow');
  });

  it('should throw when used outside provider', () => {
    expect(() => {
      renderHook(() => useWorkflowConfig());
    }).toThrow('useWorkflowConfig must be used within a <WorkflowProvider>');
  });

  it('should render children', () => {
    const client = createMockClient();

    render(
      <WorkflowProvider apiClient={client}>
        <div data-testid="child">Hello</div>
      </WorkflowProvider>
    );

    expect(screen.getByTestId('child')).toBeTruthy();
  });
});
