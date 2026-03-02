import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { NotificationItem } from '../components/notification-item.js';

import type { NotificationDto } from '../types/index.js';

const NOTIFICATION: NotificationDto = {
  id: 'n-1',
  title: 'Nouveau rendez-vous',
  body: 'Consultation prévue le 15 janvier',
  severity: 'info',
  entityType: 'Appointment',
  entityId: 'apt-1',
  isRead: false,
  createdAt: '2026-01-15T10:00:00Z',
  readAt: null,
};

describe('NotificationItem', () => {
  it('renders title and body', () => {
    render(<NotificationItem notification={NOTIFICATION} />);

    expect(screen.getByTestId('notification-title')).toHaveTextContent('Nouveau rendez-vous');
    expect(screen.getByTestId('notification-body')).toHaveTextContent('Consultation prévue le 15 janvier');
  });

  it('sets data-severity and data-read attributes', () => {
    render(<NotificationItem notification={NOTIFICATION} />);

    const item = screen.getByTestId('notification-item');
    expect(item).toHaveAttribute('data-severity', 'info');
    expect(item).toHaveAttribute('data-read', 'false');
  });

  it('hides body when null', () => {
    render(
      <NotificationItem notification={{ ...NOTIFICATION, body: null }} />,
    );

    expect(screen.queryByTestId('notification-body')).toBeNull();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<NotificationItem notification={NOTIFICATION} onClick={onClick} />);

    await user.click(screen.getByTestId('notification-item'));

    expect(onClick).toHaveBeenCalledWith(NOTIFICATION);
  });

  it('calls onClick on Enter key', async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<NotificationItem notification={NOTIFICATION} onClick={onClick} />);

    screen.getByTestId('notification-item').focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledWith(NOTIFICATION);
  });
});
