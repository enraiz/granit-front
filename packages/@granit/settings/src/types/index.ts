/** Response for `GET /settings/user/{name}` (and global, tenant). */
export interface SettingValueResponse {
  name: string;
  value: string | null;
}

/** Request body for `PUT /settings/{scope}/{name}`. */
export interface UpdateSettingValueRequest {
  value: string | null;
}

/** Response for `GET /settings/user` — flat key/value map. */
export type SettingsMap = Record<string, string | null>;

/** Setting scope for API routing. */
export type SettingScope = 'user' | 'global' | 'tenant';
