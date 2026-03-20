import { VALIDATION_ERROR_CODES } from './constants/error-codes.js';

import type { FieldConstraint, FieldValidationError } from './types/index.js';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEmpty(value: unknown): boolean {
  return (
    value === undefined || value === null || (typeof value === 'string' && value.trim() === '')
  );
}

/**
 * Validates a field value against a FieldConstraint.
 * Returns an array of validation errors (empty if valid).
 * Server-only `granitValidator` constraints are intentionally skipped.
 */
export function validateField(
  value: unknown,
  constraint: FieldConstraint
): readonly FieldValidationError[] {
  const errors: FieldValidationError[] = [];

  if (constraint.required && isEmpty(value)) {
    errors.push({ code: VALIDATION_ERROR_CODES.required });
  }

  // Skip remaining checks for empty non-required fields
  if (isEmpty(value)) {
    return errors;
  }

  const strValue = String(value);

  if (constraint.minLength !== undefined && strValue.length < constraint.minLength) {
    errors.push({
      code: VALIDATION_ERROR_CODES.minLength,
      params: { minLength: constraint.minLength },
    });
  }

  if (constraint.maxLength !== undefined && strValue.length > constraint.maxLength) {
    errors.push({
      code: VALIDATION_ERROR_CODES.maxLength,
      params: { maxLength: constraint.maxLength },
    });
  }

  if (constraint.pattern !== undefined && !new RegExp(constraint.pattern).test(strValue)) {
    errors.push({
      code: VALIDATION_ERROR_CODES.pattern,
      params: { pattern: constraint.pattern },
    });
  }

  if (constraint.format === 'email' && !EMAIL_REGEX.test(strValue)) {
    errors.push({ code: VALIDATION_ERROR_CODES.formatEmail });
  }

  const numValue = Number(value);

  if (constraint.minimum !== undefined && numValue < constraint.minimum) {
    errors.push({
      code: VALIDATION_ERROR_CODES.minimum,
      params: { minimum: constraint.minimum },
    });
  }

  if (constraint.maximum !== undefined && numValue > constraint.maximum) {
    errors.push({
      code: VALIDATION_ERROR_CODES.maximum,
      params: { maximum: constraint.maximum },
    });
  }

  if (constraint.exclusiveMinimum !== undefined && numValue <= constraint.exclusiveMinimum) {
    errors.push({
      code: VALIDATION_ERROR_CODES.exclusiveMinimum,
      params: { exclusiveMinimum: constraint.exclusiveMinimum },
    });
  }

  if (constraint.exclusiveMaximum !== undefined && numValue >= constraint.exclusiveMaximum) {
    errors.push({
      code: VALIDATION_ERROR_CODES.exclusiveMaximum,
      params: { exclusiveMaximum: constraint.exclusiveMaximum },
    });
  }

  return errors;
}
