// ---------------------------------------------------------------------------
// Chat completion API functions.
// Mirrors Granit.AI.Endpoints chat endpoints (sync + SSE stream).
// ---------------------------------------------------------------------------

import { AI_STREAM_DONE_MARKER } from '../constants.js';

import type { AIChatRequest, AIChatResponse, AIChatStreamChunk } from '../types/index.js';
import type { AxiosInstance } from 'axios';

/**
 * Send a chat completion request and return the full response.
 *
 * `POST /ai/chat/{workspaceName}`
 */
export async function chatComplete(
  client: AxiosInstance,
  basePath: string,
  workspaceName: string,
  request: AIChatRequest
): Promise<AIChatResponse> {
  const response = await client.post<AIChatResponse>(
    `${basePath}/ai/chat/${encodeURIComponent(workspaceName)}`,
    request
  );
  return response.data;
}

/**
 * Options for opening a streaming chat connection.
 *
 * Uses native `fetch` (not Axios) because Axios does not support
 * reading a `ReadableStream` incrementally.
 */
export interface ChatStreamOptions {
  /** Full URL to the stream endpoint (use {@link buildChatStreamUrl} to construct). */
  readonly url: string;
  /** Chat request payload. */
  readonly request: AIChatRequest;
  /** Extra headers (Authorization, X-Tenant-Id, etc.). */
  readonly headers?: Readonly<Record<string, string>>;
  /** Abort signal to cancel the stream. */
  readonly signal?: AbortSignal;
}

/**
 * Builds the full URL for the chat stream endpoint.
 *
 * @example
 * ```ts
 * const url = buildChatStreamUrl('http://localhost:5000', '', 'default');
 * // → "http://localhost:5000/ai/chat/default/stream"
 * ```
 */
export function buildChatStreamUrl(
  baseUrl: string,
  basePath: string,
  workspaceName: string
): string {
  const clean = baseUrl.replace(/\/+$/, '');
  return `${clean}${basePath}/ai/chat/${encodeURIComponent(workspaceName)}/stream`;
}

/**
 * Opens an SSE stream for chat completion.
 *
 * Yields content string chunks as they arrive. The stream ends when the
 * server sends `data: [DONE]` or closes the connection.
 *
 * `POST /ai/chat/{workspaceName}/stream`
 *
 * @example
 * ```ts
 * const url = buildChatStreamUrl(baseUrl, basePath, 'default');
 * const controller = new AbortController();
 *
 * for await (const chunk of chatStream({ url, request, signal: controller.signal })) {
 *   process.stdout.write(chunk);
 * }
 * ```
 */
export async function* chatStream(
  options: ChatStreamOptions
): AsyncGenerator<string, void, undefined> {
  const response = await fetch(options.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...options.headers,
    },
    body: JSON.stringify(options.request),
    signal: options.signal,
  });

  if (!response.ok) {
    throw new Error(`AI chat stream failed: ${response.status} ${response.statusText}`);
  }

  const body = response.body;
  if (!body) {
    return;
  }

  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop()!;

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6).trim();
        if (data === AI_STREAM_DONE_MARKER) return;

        try {
          const parsed = JSON.parse(data) as AIChatStreamChunk;
          yield parsed.content;
        } catch {
          // Skip malformed SSE events.
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
