import { vi } from 'vitest';

import type { Mock } from 'vitest';

export interface MockLogger {
  debug: Mock;
  info: Mock;
  warn: Mock;
  error: Mock;
  child: Mock;
}

/**
 * Create a mock logger that structurally satisfies the {@link @granit/logger#Logger}
 * interface. All methods are `vi.fn()` spies. The `child()` method returns the
 * same instance for easy assertion without deep nesting.
 */
export function createMockLogger(): MockLogger {
  const logger: MockLogger = {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn(),
  };
  logger.child.mockReturnValue(logger);
  return logger;
}
