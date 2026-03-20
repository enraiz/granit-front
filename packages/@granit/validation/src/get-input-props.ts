import type { FieldConstraint, InputConstraintProps } from './types/index.js';

const FORMAT_TO_TYPE: Readonly<Record<string, string>> = {
  email: 'email',
};

/**
 * Converts a FieldConstraint to HTML input attributes.
 * Exclusive bounds are adjusted by +1/-1 since HTML min/max are inclusive.
 */
export function getInputProps(constraint: FieldConstraint): InputConstraintProps {
  const props: Record<string, unknown> = {};

  if (constraint.required) {
    props['required'] = true;
  }

  if (constraint.maxLength !== undefined) {
    props['maxLength'] = constraint.maxLength;
  }

  if (constraint.minLength !== undefined) {
    props['minLength'] = constraint.minLength;
  }

  if (constraint.pattern !== undefined) {
    props['pattern'] = constraint.pattern;
  }

  if (constraint.format !== undefined && FORMAT_TO_TYPE[constraint.format]) {
    props['type'] = FORMAT_TO_TYPE[constraint.format];
  }

  if (constraint.minimum !== undefined) {
    props['min'] = constraint.minimum;
  } else if (constraint.exclusiveMinimum !== undefined) {
    props['min'] = constraint.exclusiveMinimum + 1;
  }

  if (constraint.maximum !== undefined) {
    props['max'] = constraint.maximum;
  } else if (constraint.exclusiveMaximum !== undefined) {
    props['max'] = constraint.exclusiveMaximum - 1;
  }

  return props as InputConstraintProps;
}
