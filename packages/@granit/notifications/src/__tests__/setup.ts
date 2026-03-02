import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Global mock for @microsoft/signalr — prevents real connections during tests.

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

vi.mock('@microsoft/signalr', () => {
  // Must be a real function so `new HubConnectionBuilder()` works.
  function HubConnectionBuilder() {
    return {
      withUrl: vi.fn().mockReturnThis(),
      withAutomaticReconnect: vi.fn().mockReturnThis(),
      configureLogging: vi.fn().mockReturnThis(),
      build: vi.fn(() => createConnection()),
    };
  }

  return {
    HubConnectionBuilder,
    HttpTransportType: { WebSockets: 1, LongPolling: 4 },
    LogLevel: { Warning: 3 },
  };
});
