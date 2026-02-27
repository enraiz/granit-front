/* eslint-disable no-console */

const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];
type LogContext = Record<string, unknown>;

function resolveLogLevel(): LogLevelValue {
  // import.meta.env.DEV is true in Vite dev mode and in Vitest
  const isDev = import.meta.env.DEV !== false;
  return isDev ? LogLevel.DEBUG : LogLevel.WARN;
}

export interface Logger {
  debug(message: string, context?: LogContext): void;
  info(message: string, context?: LogContext): void;
  warn(message: string, context?: LogContext): void;
  error(message: string, error?: unknown, context?: LogContext): void;
}

export function createLogger(prefix: string): Logger {
  const logLevel = resolveLogLevel();

  return {
    debug(message: string, context?: LogContext) {
      if (logLevel <= LogLevel.DEBUG) {
        console.log(
          `%c debug %c ${message}`,
          'background: #71717a; color: #fff; border-radius: 3px; font-weight: bold;',
          'color: inherit;',
          context ?? ''
        );
      }
    },

    info(message: string, context?: LogContext) {
      if (logLevel <= LogLevel.INFO) {
        console.info(
          `%c info  %c ${message}`,
          'background: #0ea5e9; color: #fff; border-radius: 3px; font-weight: bold;',
          'color: inherit;',
          context ?? ''
        );
      }
    },

    warn(message: string, context?: LogContext) {
      if (logLevel <= LogLevel.WARN) {
        console.warn(`${prefix} ${message}`, context ?? '');
      }
    },

    error(message: string, error?: unknown, context?: LogContext) {
      if (logLevel <= LogLevel.ERROR) {
        console.error(`${prefix} ${message}`, error, context);
      }
    },
  };
}
