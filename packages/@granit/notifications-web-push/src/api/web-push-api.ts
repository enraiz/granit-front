import type { AxiosInstance } from 'axios';

function buildUrl(basePath: string, ...segments: string[]): string {
  return [basePath, ...segments].join('/');
}

export async function registerPushSubscription(
  client: AxiosInstance,
  basePath: string,
  subscription: PushSubscriptionJSON
): Promise<void> {
  await client.post(buildUrl(basePath, 'notifications', 'push-subscriptions'), subscription);
}

export async function unregisterPushSubscription(
  client: AxiosInstance,
  basePath: string,
  endpoint: string
): Promise<void> {
  await client.delete(buildUrl(basePath, 'notifications', 'push-subscriptions'), {
    data: { endpoint },
  });
}
