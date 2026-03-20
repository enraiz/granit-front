/** Status returned by the server validation endpoint. */
export type ValidationStatus = 'Valid' | 'Invalid' | 'ValidatorNotFound';

/** Request payload for single field server validation. */
export interface ServerValidationRequest {
  readonly errorCode: string;
  readonly value: unknown;
}

/** Result from single field server validation. */
export interface ServerValidationResult {
  readonly errorCode: string;
  readonly status: ValidationStatus;
}

/** Request payload for batch server validation. */
export interface ServerValidationBatchRequest {
  readonly fields: readonly ServerValidationRequest[];
}

/** Response from batch server validation. */
export interface ServerValidationBatchResponse {
  readonly results: readonly ServerValidationResult[];
}
