import { getInputProps } from '@granit/validation';
import { useMemo } from 'react';

import type { TranslateFunction } from './create-constraints-resolver.js';
import type { InputConstraintProps, SchemaConstraints } from '@granit/validation';

export interface FieldPropsResult {
  readonly inputProps: InputConstraintProps;
  readonly serverHint?: string;
}

/**
 * Returns HTML input props and an optional server-only hint for a constrained field.
 * Memoized — the returned object is referentially stable when inputs are unchanged.
 */
export function useFieldProps(
  constraints: SchemaConstraints,
  fieldName: string,
  t: TranslateFunction
): FieldPropsResult {
  return useMemo(() => {
    const constraint = constraints[fieldName];
    if (!constraint) {
      return { inputProps: {} };
    }

    const inputProps = getInputProps(constraint);
    const serverHint = constraint.granitValidator ? t(constraint.granitValidator) : undefined;

    return serverHint !== undefined ? { inputProps, serverHint } : { inputProps };
  }, [constraints, fieldName, t]);
}
