import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NotificationPreferences } from '../components/notification-preferences.js';

import type { NotificationPreferenceDto } from '../types/index.js';

const PREFS: NotificationPreferenceDto[] = [
  {
    notificationType: 'AppointmentReminder',
    label: 'Rappel de rendez-vous',
    channels: { inApp: true, email: true, push: false },
  },
  {
    notificationType: 'SystemAlert',
    label: 'Alerte système',
    channels: { inApp: true, email: false, push: false },
  },
];

describe('NotificationPreferences', () => {
  it('should render a table with preferences', () => {
    render(
      <NotificationPreferences
        preferences={PREFS}
        loading={false}
        saving={false}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByTestId('notification-preferences')).toBeInTheDocument();
    const rows = screen.getAllByTestId('preferences-row');
    expect(rows).toHaveLength(2);
  });

  it('should show loading state', () => {
    render(
      <NotificationPreferences
        preferences={[]}
        loading={true}
        saving={false}
        onToggle={vi.fn()}
      />,
    );

    expect(screen.getByTestId('preferences-loading')).toBeInTheDocument();
  });

  it('should render checkboxes reflecting channel state', () => {
    render(
      <NotificationPreferences
        preferences={PREFS}
        loading={false}
        saving={false}
        onToggle={vi.fn()}
      />,
    );

    const emailCheckbox = screen.getByTestId('pref-AppointmentReminder-email') as HTMLInputElement;
    expect(emailCheckbox.checked).toBe(true);

    const pushCheckbox = screen.getByTestId('pref-AppointmentReminder-push') as HTMLInputElement;
    expect(pushCheckbox.checked).toBe(false);
  });

  it('should call onToggle when checkbox is clicked', async () => {
    const onToggle = vi.fn();
    const user = userEvent.setup();

    render(
      <NotificationPreferences
        preferences={PREFS}
        loading={false}
        saving={false}
        onToggle={onToggle}
      />,
    );

    await user.click(screen.getByTestId('pref-AppointmentReminder-push'));

    expect(onToggle).toHaveBeenCalledWith('AppointmentReminder', 'push', true);
  });

  it('should disable checkboxes when saving', () => {
    render(
      <NotificationPreferences
        preferences={PREFS}
        loading={false}
        saving={true}
        onToggle={vi.fn()}
      />,
    );

    const checkbox = screen.getByTestId('pref-AppointmentReminder-email') as HTMLInputElement;
    expect(checkbox.disabled).toBe(true);
  });
});
