/**
 * Maps constraint types to i18next-compatible localization keys.
 * These keys mirror the .NET Granit.Validation error code convention.
 */
export const VALIDATION_ERROR_CODES = {
  required: 'Granit:Validation:NotEmptyValidator',
  maxLength: 'Granit:Validation:MaximumLengthValidator',
  minLength: 'Granit:Validation:MinimumLengthValidator',
  pattern: 'Granit:Validation:RegularExpressionValidator',
  formatEmail: 'Granit:Validation:EmailValidator',
  minimum: 'Granit:Validation:GreaterThanOrEqualValidator',
  maximum: 'Granit:Validation:LessThanOrEqualValidator',
  exclusiveMinimum: 'Granit:Validation:GreaterThanValidator',
  exclusiveMaximum: 'Granit:Validation:LessThanValidator',
} as const;

export type ValidationErrorCode =
  (typeof VALIDATION_ERROR_CODES)[keyof typeof VALIDATION_ERROR_CODES];
