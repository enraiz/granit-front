import { buildApiUrl } from '@granit/api-client';

import type {
  MobilePushTokenRegisterRequest,
  MobilePushTokenRemoveRequest,
  MobilePushTokenResponse,
} from '../types';
import type { AxiosInstance } from '@granit/api-client';

export async function registerDeviceToken(
  client: AxiosInstance,
  basePath: string,
  payload: MobilePushTokenRegisterRequest
): Promise<void> {
  await client.post(buildApiUrl(basePath, 'notifications', 'mobile-push', 'tokens'), payload);
}

/**
 * Removes a registered device token for the current user.
 *
 * `DELETE {basePath}/notifications/mobile-push/tokens` — the token is a sendable
 * push credential, so it travels in the request body, never in the URL where it
 * would leak into access and proxy logs. No-op if the token does not exist.
 */
export async function unregisterDeviceToken(
  client: AxiosInstance,
  basePath: string,
  token: string
): Promise<void> {
  const request: MobilePushTokenRemoveRequest = { deviceToken: token };
  await client.delete(buildApiUrl(basePath, 'notifications', 'mobile-push', 'tokens'), {
    data: request,
  });
}

/**
 * Lists all registered device tokens for the current user.
 *
 * `GET {basePath}/notifications/mobile-push/tokens`
 */
export async function listDeviceTokens(
  client: AxiosInstance,
  basePath: string
): Promise<readonly MobilePushTokenResponse[]> {
  const { data } = await client.get<MobilePushTokenResponse[]>(
    buildApiUrl(basePath, 'notifications', 'mobile-push', 'tokens')
  );
  return data;
}
