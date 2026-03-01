import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';


import { useTimelineConfig } from '../timeline-provider.tsx';

import { createMockClient, createWrapper } from './test-utils.tsx';

describe('TimelineProvider', () => {
  it('provides config to child hooks', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useTimelineConfig(), {
      wrapper: createWrapper(client, '/custom/path'),
    });

    expect(result.current.apiClient).toBe(client);
    expect(result.current.basePath).toBe('/custom/path');
  });

  it('uses default basePath', () => {
    const client = createMockClient();

    const { result } = renderHook(() => useTimelineConfig(), {
      wrapper: createWrapper(client),
    });

    expect(result.current.basePath).toBe('/api/timeline');
  });

  it('throws when used outside provider', () => {
    expect(() => {
      renderHook(() => useTimelineConfig());
    }).toThrow('useTimelineConfig must be used within a <TimelineProvider>');
  });
});
