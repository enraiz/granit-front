import {
  Checkbox,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@granit/ui';

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
 * Notification preferences matrix — type x channel toggles.
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
        <Spinner />
      </div>
    );
  }

  return (
    <Table
      data-testid="notification-preferences"
      className={className}
      aria-label="Préférences de notification"
    >
      <TableHeader>
        <TableRow>
          <TableHead data-testid="preferences-header-type">Type</TableHead>
          {channels.map((ch) => (
            <TableHead key={ch} data-testid={`preferences-header-${ch}`}>
              {CHANNEL_LABELS[ch]}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {preferences.map((pref) => (
          <TableRow key={pref.notificationType} data-testid="preferences-row">
            <TableCell data-testid="preferences-label">{pref.label}</TableCell>
            {channels.map((ch) => (
              <TableCell key={ch}>
                <Checkbox
                  data-testid={`pref-${pref.notificationType}-${ch}`}
                  checked={pref.channels[ch]}
                  disabled={saving}
                  onCheckedChange={(checked) =>
                    onToggle(pref.notificationType, ch, checked === true)
                  }
                  aria-label={`${pref.label} — ${CHANNEL_LABELS[ch]}`}
                />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
