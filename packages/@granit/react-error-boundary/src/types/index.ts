import type { Logger } from '@granit/logger';

/** Props for the `GranitErrorBoundary` component. */
export type ErrorBoundaryProps = {
  /** Logger instance for reporting caught errors. */
  logger: Logger;
  /** Render function called when an error is caught. Headless — no built-in UI. */
  renderFallback: (error: Error, resetErrorBoundary: () => void) => React.ReactNode;
  /** Optional callback fired when an error is caught (in addition to logging). */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
  children: React.ReactNode;
};

/** Props for the `GlobalErrorCapture` component. */
export type GlobalErrorCaptureProps = {
  /** Logger instance for reporting uncaught errors. */
  logger: Logger;
  /** Optional callback fired for each captured error. */
  onError?: (error: Error) => void;
};
