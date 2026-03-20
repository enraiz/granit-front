import { createTestQueryClient } from '@granit/react-testing';
import { createMockClient } from '@granit/testing';
import { QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import * as React from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAIChatStream } from '../hooks/use-ai-chat-stream.js';
import { AIProvider } from '../providers/ai-provider.js';

import type { AIConfig } from '../providers/ai-provider.js';
import type { AxiosInstance } from 'axios';
import type { ReactNode } from 'react';

function createSSEStream(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(chunk));
      }
      controller.close();
    },
  });
}

function mockFetch(status: number, body: ReadableStream<Uint8Array> | null) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    body,
  });
}

function createWrapper(client: AxiosInstance) {
  return function Wrapper({ children }: { children: ReactNode }) {
    const queryClient = createTestQueryClient();
    const config: AIConfig = {
      client,
      basePath: '/api',
      streamBaseUrl: 'http://localhost:5000',
    };
    return React.createElement(
      QueryClientProvider,
      { client: queryClient },
      <AIProvider config={config}>{children}</AIProvider>
    );
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('useAIChatStream', () => {
  it('should accumulate content from SSE chunks', async () => {
    const client = createMockClient();
    const stream = createSSEStream([
      'data: {"content":"Hello"}\n\n',
      'data: {"content":" world"}\n\n',
      'data: [DONE]\n\n',
    ]);
    vi.stubGlobal('fetch', mockFetch(200, stream));

    const { result } = renderHook(() => useAIChatStream(), {
      wrapper: createWrapper(client),
    });

    expect(result.current.isStreaming).toBe(false);
    expect(result.current.content).toBe('');

    act(() => {
      result.current.send('default', { messages: [{ role: 'user', content: 'Hi' }] });
    });

    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    expect(result.current.content).toBe('Hello world');
    expect(result.current.error).toBeNull();
  });

  it('should set error on fetch failure', async () => {
    const client = createMockClient();
    vi.stubGlobal('fetch', mockFetch(500, null));

    const { result } = renderHook(() => useAIChatStream(), {
      wrapper: createWrapper(client),
    });

    act(() => {
      result.current.send('default', { messages: [{ role: 'user', content: 'Hi' }] });
    });

    await waitFor(() => expect(result.current.error).not.toBeNull());

    expect(result.current.error?.message).toContain('500');
    expect(result.current.isStreaming).toBe(false);
  });

  it('should reset content on new send()', async () => {
    const client = createMockClient();

    const stream1 = createSSEStream(['data: {"content":"First"}\n\ndata: [DONE]\n\n']);
    const stream2 = createSSEStream(['data: {"content":"Second"}\n\ndata: [DONE]\n\n']);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, status: 200, statusText: 'OK', body: stream1 })
      .mockResolvedValueOnce({ ok: true, status: 200, statusText: 'OK', body: stream2 });
    vi.stubGlobal('fetch', fetchMock);

    const { result } = renderHook(() => useAIChatStream(), {
      wrapper: createWrapper(client),
    });

    act(() => {
      result.current.send('default', { messages: [{ role: 'user', content: 'A' }] });
    });
    await waitFor(() => expect(result.current.isStreaming).toBe(false));
    expect(result.current.content).toBe('First');

    act(() => {
      result.current.send('default', { messages: [{ role: 'user', content: 'B' }] });
    });
    await waitFor(() => expect(result.current.content).toBe('Second'));
  });

  it('should pass tenant and auth headers', async () => {
    const client = createMockClient();
    const stream = createSSEStream(['data: [DONE]\n\n']);
    const fetchMock = mockFetch(200, stream);
    vi.stubGlobal('fetch', fetchMock);

    const tokenGetter = vi.fn().mockResolvedValue('my-token');

    const config: AIConfig = {
      client,
      basePath: '/api',
      streamBaseUrl: 'http://localhost:5000',
      tokenGetter,
      tenantId: 'tenant-1',
    };

    const wrapper = ({ children }: { children: ReactNode }) => {
      const queryClient = createTestQueryClient();
      return React.createElement(
        QueryClientProvider,
        { client: queryClient },
        <AIProvider config={config}>{children}</AIProvider>
      );
    };

    const { result } = renderHook(() => useAIChatStream(), { wrapper });

    act(() => {
      result.current.send('default', { messages: [{ role: 'user', content: 'Hi' }] });
    });

    await waitFor(() => expect(result.current.isStreaming).toBe(false));

    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:5000/api/ai/chat/default/stream',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer my-token',
          'X-Tenant-Id': 'tenant-1',
        }),
      })
    );
  });
});
