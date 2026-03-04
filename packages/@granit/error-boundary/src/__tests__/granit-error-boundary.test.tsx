import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { GranitErrorBoundary } from '../components/granit-error-boundary.js';

import type { Logger } from '@granit/logger';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createMockLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    child: vi.fn(),
  } as unknown as Logger;
}

function ThrowingComponent({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) throw new Error('Test render error');
  return <div>No error</div>;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('GranitErrorBoundary', () => {
  it('should render children when no error occurs', () => {
    const logger = createMockLogger();

    render(
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(error) => <p>{error.message}</p>}
      >
        <div>child content</div>
      </GranitErrorBoundary>,
    );

    expect(screen.getByText('child content')).toBeInTheDocument();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should render fallback when a child throws during render', () => {
    const logger = createMockLogger();

    render(
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(error) => <p>Fallback: {error.message}</p>}
      >
        <ThrowingComponent shouldThrow />
      </GranitErrorBoundary>,
    );

    expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
    expect(screen.getByText('Fallback: Test render error')).toBeInTheDocument();
  });

  it('should log the error via logger', () => {
    const logger = createMockLogger();

    render(
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(error) => <p>{error.message}</p>}
      >
        <ThrowingComponent shouldThrow />
      </GranitErrorBoundary>,
    );

    expect(logger.error).toHaveBeenCalledWith(
      'Uncaught render error',
      expect.objectContaining({
        error: 'Test render error',
      }),
    );
  });

  it('should call onError callback when provided', () => {
    const logger = createMockLogger();
    const onError = vi.fn();

    render(
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(error) => <p>{error.message}</p>}
        onError={onError}
      >
        <ThrowingComponent shouldThrow />
      </GranitErrorBoundary>,
    );

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({ message: 'Test render error' }),
      expect.objectContaining({ componentStack: expect.any(String) }),
    );
  });

  it('should reset the error boundary and re-render children', async () => {
    const logger = createMockLogger();
    const user = userEvent.setup();

    let shouldThrow = true;

    function ConditionalThrow() {
      if (shouldThrow) throw new Error('Boom');
      return <div>Recovered</div>;
    }

    render(
      <GranitErrorBoundary
        logger={logger}
        renderFallback={(_error, reset) => (
          <button type="button" onClick={reset}>Reset</button>
        )}
      >
        <ConditionalThrow />
      </GranitErrorBoundary>,
    );

    expect(screen.getByText('Reset')).toBeInTheDocument();

    shouldThrow = false;
    await user.click(screen.getByText('Reset'));

    expect(screen.getByText('Recovered')).toBeInTheDocument();
  });
});
