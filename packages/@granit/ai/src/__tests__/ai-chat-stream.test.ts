import { afterEach, describe, expect, it, vi } from 'vitest';

import { chatStream } from '../api/ai-chat-api.js';

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

describe('chatStream', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should yield content chunks from SSE events', async () => {
    const stream = createSSEStream([
      'data: {"content":"Hello"}\n\n',
      'data: {"content":" world"}\n\n',
      'data: [DONE]\n\n',
    ]);
    vi.stubGlobal('fetch', mockFetch(200, stream));

    const chunks: string[] = [];
    for await (const chunk of chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request: { messages: [{ role: 'user', content: 'Hi' }] },
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['Hello', ' world']);
  });

  it('should handle chunks split across reads', async () => {
    const stream = createSSEStream(['data: {"cont', 'ent":"split"}\n\ndata: [DONE]\n\n']);
    vi.stubGlobal('fetch', mockFetch(200, stream));

    const chunks: string[] = [];
    for await (const chunk of chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request: { messages: [{ role: 'user', content: 'Hi' }] },
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['split']);
  });

  it('should throw on non-OK response', async () => {
    vi.stubGlobal('fetch', mockFetch(401, null));

    const generator = chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request: { messages: [{ role: 'user', content: 'Hi' }] },
    });

    await expect(generator.next()).rejects.toThrow('AI chat stream failed: 401');
  });

  it('should skip malformed SSE events', async () => {
    const stream = createSSEStream([
      'data: not-json\n\n',
      'data: {"content":"valid"}\n\n',
      'data: [DONE]\n\n',
    ]);
    vi.stubGlobal('fetch', mockFetch(200, stream));

    const chunks: string[] = [];
    for await (const chunk of chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request: { messages: [{ role: 'user', content: 'Hi' }] },
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual(['valid']);
  });

  it('should pass headers and request body to fetch', async () => {
    const stream = createSSEStream(['data: [DONE]\n\n']);
    const fetchMock = mockFetch(200, stream);
    vi.stubGlobal('fetch', fetchMock);

    const request = { messages: [{ role: 'user' as const, content: 'Hi' }] };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for await (const _ of chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request,
      headers: { Authorization: 'Bearer token', 'X-Tenant-Id': 'tenant-1' },
    })) {
      // consume stream
    }

    expect(fetchMock).toHaveBeenCalledWith('http://localhost/ai/chat/default/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        Authorization: 'Bearer token',
        'X-Tenant-Id': 'tenant-1',
      },
      body: JSON.stringify(request),
      signal: undefined,
    });
  });

  it('should handle empty body gracefully', async () => {
    vi.stubGlobal('fetch', mockFetch(200, null));

    const chunks: string[] = [];
    for await (const chunk of chatStream({
      url: 'http://localhost/ai/chat/default/stream',
      request: { messages: [{ role: 'user', content: 'Hi' }] },
    })) {
      chunks.push(chunk);
    }

    expect(chunks).toEqual([]);
  });
});
