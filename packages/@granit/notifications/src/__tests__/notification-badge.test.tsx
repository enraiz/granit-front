import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { NotificationBadge } from '../components/notification-badge.js';

describe('NotificationBadge', () => {
  it('should render nothing when count is 0', () => {
    const { container } = render(<NotificationBadge count={0} />);
    expect(container.firstChild).toBeNull();
  });

  it('should render the count', () => {
    render(<NotificationBadge count={5} />);
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('5');
  });

  it('should cap display at max value', () => {
    render(<NotificationBadge count={150} max={99} />);
    expect(screen.getByTestId('notification-badge')).toHaveTextContent('99+');
  });

  it('should set aria-label with the real count', () => {
    render(<NotificationBadge count={150} />);
    expect(screen.getByTestId('notification-badge')).toHaveAttribute(
      'aria-label',
      '150 notifications non lues',
    );
  });

  it('should expose data-count attribute', () => {
    render(<NotificationBadge count={3} />);
    expect(screen.getByTestId('notification-badge')).toHaveAttribute('data-count', '3');
  });
});
