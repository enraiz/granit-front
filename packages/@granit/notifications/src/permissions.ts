/** Permission constants for the notifications module. Mirrors `Granit.Notifications.Endpoints.Permissions.NotificationPermissions`. */
export const NotificationPermissions = {
  /** Permissions for user notifications. */
  UserNotifications: {
    /** Grants read-only access to view notifications (inbox, activity feed). */
    Read: 'Notifications.UserNotifications.Read',
    /**
     * Grants self-service updates to the caller's own notifications — marking a
     * single notification (`POST /notifications/{id}/read`) or all of them
     * (`POST /notifications/read-all`) as read.
     */
    Update: 'Notifications.UserNotifications.Update',
    /** Grants management access to notification settings (preferences, subscriptions, push tokens). */
    Manage: 'Notifications.UserNotifications.Manage',
  },
} as const;
