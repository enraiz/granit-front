import type { AxiosInstance } from 'axios';

export type MobilePlatform = 'android' | 'ios';

export interface DeviceTokenDto {
  readonly token: string;
  readonly platform: MobilePlatform;
  readonly deviceId?: string;
}

function buildUrl(basePath: string, ...segments: string[]): string {
  return [basePath, ...segments].join('/');
}

export async function registerDeviceToken(
  client: AxiosInstance,
  basePath: string,
  payload: DeviceTokenDto
): Promise<void> {
  await client.post(buildUrl(basePath, 'notifications', 'push-tokens'), payload);
}

export async function unregisterDeviceToken(
  client: AxiosInstance,
  basePath: string,
  token: string
): Promise<void> {
  await client.delete(
    buildUrl(basePath, 'notifications', 'push-tokens', encodeURIComponent(token))
  );
}
