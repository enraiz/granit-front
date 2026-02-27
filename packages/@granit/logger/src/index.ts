const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
} as const;

type LogLevelValue = (typeof LogLevel)[keyof typeof LogLevel];
type LogContext = Record<string, unknown>;

function resolveLogLevel(): LogLevelValue {
  // import.meta.env is provided by Vite and Vitest at runtime.
  // Cast to avoid requiring vite/client types in library tsconfig.
  const viteEnv = (import.meta as unknown as { env?: { DEV?: boolean } }).env;
  return viteEnv?.DEV === false ? LogLevel.WARN : LogLevel.DEBUG;
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
