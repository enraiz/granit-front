// Keycloak / OIDC standard user claims
export interface KeycloakUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
}

// Generic paginated response wrapper (REST APIs)
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// RFC 7807 Problem Details — standard error format from Granit .NET backend.
// See: Granit.ExceptionHandling (400 BusinessException, 404 NotFoundException,
// 403 ForbiddenException, 409 ConflictException, 422 ValidationException, 500).
export interface ProblemDetails {
  type?: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  /** OpenTelemetry trace ID for correlation in Grafana/Loki/Tempo */
  traceId?: string;
  /** Domain error code (e.g. "Appointment:SlotUnavailable") from IHasErrorCode */
  errorCode?: string;
}
