import type { NotificationChannel, NotificationPreferenceDto } from '../types/index.js';

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  inApp: 'In-app',
  email: 'Email',
  push: 'Push',
};

export interface NotificationPreferencesProps {
  preferences: NotificationPreferenceDto[];
  loading: boolean;
  saving: boolean;
  onToggle: (
    notificationType: string,
    channel: NotificationChannel,
    enabled: boolean,
  ) => void;
  className?: string;
}

/**
 * Headless notification preferences matrix — type x channel toggles.
 */
export function NotificationPreferences({
  preferences,
  loading,
  saving,
  onToggle,
  className,
}: Readonly<NotificationPreferencesProps>) {
  const channels: NotificationChannel[] = ['inApp', 'email', 'push'];

  if (loading) {
    return (
      <div data-testid="preferences-loading" aria-busy="true" className={className}>
        Chargement…
      </div>
    );
  }

  return (
    <table
      data-testid="notification-preferences"
      className={className}
      aria-label="Préférences de notification"
    >
      <thead>
        <tr>
          <th data-testid="preferences-header-type">Type</th>
          {channels.map((ch) => (
            <th key={ch} data-testid={`preferences-header-${ch}`}>
              {CHANNEL_LABELS[ch]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {preferences.map((pref) => (
          <tr key={pref.notificationType} data-testid="preferences-row">
            <td data-testid="preferences-label">{pref.label}</td>
            {channels.map((ch) => (
              <td key={ch}>
                <input
                  data-testid={`pref-${pref.notificationType}-${ch}`}
                  type="checkbox"
                  checked={pref.channels[ch]}
                  disabled={saving}
                  onChange={(e) =>
                    onToggle(pref.notificationType, ch, e.target.checked)
                  }
                  aria-label={`${pref.label} — ${CHANNEL_LABELS[ch]}`}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
