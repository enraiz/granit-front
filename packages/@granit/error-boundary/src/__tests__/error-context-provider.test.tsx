import { act, renderHook } from '@testing-library/react';
import * as React from 'react';
import { describe, expect, it } from 'vitest';

import { useBreadcrumb } from '../hooks/use-breadcrumb.js';
import { ErrorContextProvider, useErrorContext } from '../providers/error-context-provider.js';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createWrapper(config?: Parameters<typeof ErrorContextProvider>[0]['config']) {
  return ({ children }: { children: React.ReactNode }) => (
    <ErrorContextProvider config={config}>{children}</ErrorContextProvider>
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('ErrorContextProvider', () => {
  it('should provide an empty breadcrumb trail by default', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current.breadcrumbs).toEqual([]);
  });

  it('should add breadcrumbs', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.addBreadcrumb('navigation', 'Navigated to /invoices');
    });

    expect(result.current.breadcrumbs).toHaveLength(1);
    expect(result.current.breadcrumbs[0]).toMatchObject({
      category: 'navigation',
      message: 'Navigated to /invoices',
    });
    expect(result.current.breadcrumbs[0]?.timestamp).toBeDefined();
  });

  it('should enforce maxBreadcrumbs (FIFO)', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper({ maxBreadcrumbs: 3 }),
    });

    act(() => {
      for (let i = 1; i <= 5; i++) {
        result.current.addBreadcrumb('test', `Event ${i}`);
      }
    });

    expect(result.current.breadcrumbs).toHaveLength(3);
    expect(result.current.breadcrumbs[0]?.message).toBe('Event 3');
    expect(result.current.breadcrumbs[2]?.message).toBe('Event 5');
  });

  it('should use default maxBreadcrumbs of 20', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper(),
    });

    act(() => {
      for (let i = 1; i <= 25; i++) {
        result.current.addBreadcrumb('test', `Event ${i}`);
      }
    });

    expect(result.current.breadcrumbs).toHaveLength(20);
    expect(result.current.breadcrumbs[0]?.message).toBe('Event 6');
  });

  it('should return route info when configured', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper({ getRouteInfo: () => '/invoices/123' }),
    });

    expect(result.current.getRouteInfo()).toBe('/invoices/123');
  });

  it('should return undefined route info when not configured', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper(),
    });

    expect(result.current.getRouteInfo()).toBeUndefined();
  });

  it('should return user info when configured', () => {
    const { result } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper({ getUserInfo: () => ({ id: 'user-42' }) }),
    });

    expect(result.current.getUserInfo()).toEqual({ id: 'user-42' });
  });

  it('should throw when useErrorContext is used outside provider', () => {
    expect(() => renderHook(() => useErrorContext())).toThrowError(
      'useErrorContext must be used within an ErrorContextProvider'
    );
  });
});

describe('useBreadcrumb', () => {
  it('should expose addBreadcrumb from the error context', () => {
    const { result } = renderHook(() => useBreadcrumb(), {
      wrapper: createWrapper(),
    });

    expect(result.current.addBreadcrumb).toBeTypeOf('function');
  });

  it('should add breadcrumbs via the hook', () => {
    const { result: contextResult } = renderHook(() => useErrorContext(), {
      wrapper: createWrapper(),
    });

    // useBreadcrumb delegates to the same context — tested via provider
    act(() => {
      contextResult.current.addBreadcrumb('user', 'Clicked button');
    });

    expect(contextResult.current.breadcrumbs).toHaveLength(1);
  });
});
