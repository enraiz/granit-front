import { useFeatureValues } from './use-feature-values.js';

export interface UseFeatureFlagReturn {
  readonly isEnabled: boolean;
  readonly isLoading: boolean;
}

/**
 * Boolean shortcut for Toggle features.
 *
 * Reads from the bulk `useFeatureValues()` query to avoid N+1 HTTP requests.
 * Returns `isEnabled: true` only when the resolved value is exactly `"true"`.
 *
 * @example
 * ```tsx
 * const { isEnabled } = useFeatureFlag('Acme.VideoConsultation');
 * if (isEnabled) return <VideoWidget />;
 * ```
 */
export function useFeatureFlag(name: string): UseFeatureFlagReturn {
  const { data, isLoading } = useFeatureValues();
  const rawValue = data?.[name];
  return {
    isEnabled: rawValue === 'true',
    isLoading,
  };
}
