import { describe, expect, it } from 'vitest';

import { getAvailableChannels } from '../types/index.js';

import type { NotificationPreference } from '../types/index.js';

describe('getAvailableChannels', () => {
  it('should return empty array for empty preferences', () => {
    expect(getAvailableChannels([])).toEqual([]);
  });

  it('should extract channel keys from the first preference', () => {
    const preferences: NotificationPreference[] = [
      {
        notificationType: 'document_update',
        label: 'Document updates',
        channels: { inApp: true, email: false, sms: true, whatsApp: false },
      },
      {
        notificationType: 'system_alert',
        label: 'System alerts',
        channels: { inApp: true, email: true, sms: false, whatsApp: false },
      },
    ];

    expect(getAvailableChannels(preferences)).toEqual(['inApp', 'email', 'sms', 'whatsApp']);
  });

  it('should handle preferences with a single channel', () => {
    const preferences: NotificationPreference[] = [
      {
        notificationType: 'alert',
        label: 'Alert',
        channels: { inApp: true },
      },
    ];

    expect(getAvailableChannels(preferences)).toEqual(['inApp']);
  });
});
