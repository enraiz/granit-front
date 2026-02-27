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
});
