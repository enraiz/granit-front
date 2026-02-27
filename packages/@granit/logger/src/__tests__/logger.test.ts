import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createLogger } from '../index.ts';

describe('createLogger', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'info').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns an object with all log methods', () => {
    const logger = createLogger('[Test]');
    expect(typeof logger.debug).toBe('function');
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('warn includes the prefix in the message', () => {
    const logger = createLogger('[MyApp]');
    logger.warn('something is wrong');
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[MyApp]'),
      ''
    );
  });

  it('warn passes context when provided', () => {
    const logger = createLogger('[MyApp]');
    const ctx = { userId: 'abc' };
    logger.warn('with context', ctx);
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('[MyApp]'),
      ctx
    );
  });

  it('error calls console.error with prefix and error', () => {
    const logger = createLogger('[MyApp]');
    const err = new Error('test error');
    logger.error('fatal', err);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[MyApp]'),
      err,
      undefined
    );
  });

  it('different prefixes produce independent loggers', () => {
    const logger1 = createLogger('[App1]');
    const logger2 = createLogger('[App2]');
    logger1.warn('msg1');
    logger2.warn('msg2');
    expect(console.warn).toHaveBeenNthCalledWith(
      1,
      expect.stringContaining('[App1]'),
      ''
    );
    expect(console.warn).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining('[App2]'),
      ''
    );
  });

  it('debug calls console.log with styled format', () => {
    const logger = createLogger('[Test]');
    logger.debug('debug message');
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('debug message'),
      expect.any(String),
      expect.any(String),
      ''
    );
  });

  it('debug passes context when provided', () => {
    const logger = createLogger('[Test]');
    const ctx = { requestId: '123' };
    logger.debug('debug with context', ctx);
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('debug with context'),
      expect.any(String),
      expect.any(String),
      ctx
    );
  });

  it('info calls console.info with styled format', () => {
    const logger = createLogger('[Test]');
    logger.info('info message');
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('info message'),
      expect.any(String),
      expect.any(String),
      ''
    );
  });

  it('info passes context when provided', () => {
    const logger = createLogger('[Test]');
    const ctx = { userId: 'u-42' };
    logger.info('info with context', ctx);
    expect(console.info).toHaveBeenCalledWith(
      expect.stringContaining('info with context'),
      expect.any(String),
      expect.any(String),
      ctx
    );
  });

  it('error passes context when provided', () => {
    const logger = createLogger('[Test]');
    const err = new Error('boom');
    const ctx = { traceId: 'abc' };
    logger.error('with context', err, ctx);
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('[Test]'),
      err,
      ctx
    );
  });
});
