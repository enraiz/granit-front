/** Response for `GET /settings/user/{name}` (and global, tenant). */
export interface SettingValueResponse {
  readonly name: string;
  readonly value: string | null;
}

/** Request body for `PUT /settings/{scope}/{name}`. */
export interface UpdateSettingValueRequest {
  readonly value: string | null;
}

/** Response for `GET /settings/user` — flat key/value map. */
export type SettingsMap = Record<string, string | null>;

/** Setting scope for API routing. */
export type SettingScope = 'user' | 'global' | 'tenant';

// ── Admin types ─────────────────────────────────────────────────────────────

/** Admin-scoped application setting with type metadata. */
export interface AdminAppSetting {
  readonly key: string;
  readonly label: string;
  readonly description: string;
  readonly value: string;
  readonly type: 'string' | 'number' | 'boolean';
}
