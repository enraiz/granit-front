import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Hoisted so that the mock factory (also hoisted) can reference them.
const { HubConnectionBuilder } = vi.hoisted(() => {
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

  return { createConnection, HubConnectionBuilder };
});

// Global mock for @microsoft/signalr — prevents real connections during tests.
vi.mock('@microsoft/signalr', () => ({
  HubConnectionBuilder,
  HttpTransportType: { WebSockets: 1, LongPolling: 4 },
  LogLevel: { Warning: 3 },
}));
