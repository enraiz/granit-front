import { describe, expect, it } from 'vitest';

import { getInputProps } from '../get-input-props.js';

describe('getInputProps', () => {
  it('returns empty object for empty constraint', () => {
    expect(getInputProps({})).toEqual({});
  });

  it('sets required: true when constraint.required is true', () => {
    expect(getInputProps({ required: true })).toEqual({ required: true });
  });

  it('omits required when constraint.required is false', () => {
    expect(getInputProps({ required: false })).toEqual({});
  });

  it('maps maxLength directly', () => {
    expect(getInputProps({ maxLength: 255 })).toEqual({ maxLength: 255 });
  });

  it('maps minLength directly', () => {
    expect(getInputProps({ minLength: 3 })).toEqual({ minLength: 3 });
  });

  it('maps pattern directly', () => {
    expect(getInputProps({ pattern: '^\\d{5}$' })).toEqual({ pattern: '^\\d{5}$' });
  });

  it('maps format email to type email', () => {
    expect(getInputProps({ format: 'email' })).toEqual({ type: 'email' });
  });

  it('omits type for unknown format', () => {
    expect(getInputProps({ format: 'uuid' })).toEqual({});
  });

  it('maps minimum to min', () => {
    expect(getInputProps({ minimum: 0 })).toEqual({ min: 0 });
  });

  it('maps maximum to max', () => {
    expect(getInputProps({ maximum: 100 })).toEqual({ max: 100 });
  });

  it('adjusts exclusiveMinimum to min + 1 for integer bounds', () => {
    expect(getInputProps({ exclusiveMinimum: 0 })).toEqual({ min: 1 });
  });

  it('adjusts exclusiveMaximum to max - 1 for integer bounds', () => {
    expect(getInputProps({ exclusiveMaximum: 100 })).toEqual({ max: 99 });
  });

  it('prefers minimum over exclusiveMinimum when both present', () => {
    expect(getInputProps({ minimum: 5, exclusiveMinimum: 0 })).toEqual({ min: 5 });
  });

  it('prefers maximum over exclusiveMaximum when both present', () => {
    expect(getInputProps({ maximum: 50, exclusiveMaximum: 100 })).toEqual({ max: 50 });
  });

  it('combines all constraint properties into a single props object', () => {
    expect(
      getInputProps({
        required: true,
        maxLength: 255,
        minLength: 1,
        pattern: '^[a-z]+$',
        format: 'email',
        minimum: 0,
        maximum: 100,
      })
    ).toEqual({
      required: true,
      maxLength: 255,
      minLength: 1,
      pattern: '^[a-z]+$',
      type: 'email',
      min: 0,
      max: 100,
    });
  });
});
