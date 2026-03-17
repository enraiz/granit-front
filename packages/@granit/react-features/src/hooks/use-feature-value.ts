import { useFeatureValues } from './use-feature-values.js';

export interface UseFeatureValueReturn {
  readonly value: string | undefined;
  readonly isLoading: boolean;
}

/**
 * Returns the raw resolved string value for a feature.
 *
 * Reads from the bulk `useFeatureValues()` query to avoid N+1 HTTP requests.
 * Useful for Numeric and Selection features where a boolean is not enough.
 *
 * @example
 * ```tsx
 * const { value } = useFeatureValue('Acme.MaxUsers');
 * const limit = value ? Number(value) : 0;
 * ```
 */
export function useFeatureValue(name: string): UseFeatureValueReturn {
  const { data, isLoading } = useFeatureValues();
  return {
    value: data?.[name],
    isLoading,
  };
}
