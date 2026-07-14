import type { ISODateString } from '@granit/types';

export type MobilePlatform = 'Android' | 'Ios';

/** Write DTO for token registration. Mirrors `MobilePushTokenRegisterRequest` from .NET. */
export interface MobilePushTokenRegisterRequest {
  readonly deviceToken: string;
  readonly platform: MobilePlatform;
}

/**
 * Write DTO for token removal. Mirrors `MobilePushTokenRemoveRequest` from .NET.
 *
 * The device token is a sendable push credential, so it travels in the request
 * body — never in the URL, where it would leak into access and proxy logs.
 */
export interface MobilePushTokenRemoveRequest {
  readonly deviceToken: string;
}

export interface MobilePushTokenResponse {
  /** Masked preview of the stored device token (the full token is never returned). */
  readonly deviceTokenPreview: string;
  readonly platform: MobilePlatform;
  readonly createdAt: ISODateString;
}
