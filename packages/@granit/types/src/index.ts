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
