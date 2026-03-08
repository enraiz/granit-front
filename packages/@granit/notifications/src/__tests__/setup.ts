// ---------------------------------------------------------------------------
// Test setup for @granit/notifications
// Mocks @microsoft/signalr to prevent real WebSocket connections during tests.
// This file is referenced in vitest.config.ts setupFiles ONLY because
// notification tests need SignalR mocked globally.
// Other packages should NOT depend on this file.
// ---------------------------------------------------------------------------

import '@testing-library/jest-dom';
import { vi } from 'vitest';

function createConnection() {
  return {
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
    onreconnecting: vi.fn(),
    onreconnected: vi.fn(),
    onclose: vi.fn(),
  };
}

// Must be a real function so `new HubConnectionBuilder()` works.
function HubConnectionBuilder() {
  return {
    withUrl: vi.fn().mockReturnThis(),
    withAutomaticReconnect: vi.fn().mockReturnThis(),
    configureLogging: vi.fn().mockReturnThis(),
    build: vi.fn(() => createConnection()),
  };
}

// Global mock for @microsoft/signalr — prevents real connections during tests.
vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder,
  HttpTransportType: { WebSockets: 1, LongPolling: 4 },
  LogLevel: { Warning: 3 },
}));
