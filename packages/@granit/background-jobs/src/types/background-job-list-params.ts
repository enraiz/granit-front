/** Pagination parameters for listing background jobs. Mirrors .NET query params. */
export interface BackgroundJobListParams {
  readonly page?: number;
  readonly pageSize?: number;
}
