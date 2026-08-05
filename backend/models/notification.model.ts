import { NotificationModel } from '../types/model.types';
import { NotificationType } from '../types/app.types';

export type { NotificationModel };

/** Maps a notification type to a human-readable label */
export const notificationTypeLabel: Record<NotificationType, string> = {
  escalated: '⚠️ Dispute Escalated',
  reminder: '⏰ Evidence Reminder',
  resolved: '✅ Dispute Resolved',
  info: 'ℹ️ Information',
};
