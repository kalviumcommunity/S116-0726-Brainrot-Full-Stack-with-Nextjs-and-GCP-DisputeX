import { ActivityModel } from '../types/model.types';
import { ActivityAction } from '../types/app.types';

export type { ActivityModel };

/** Maps an activity action to a user-friendly description */
export const activityActionLabel: Record<ActivityAction, string> = {
  CREATED: 'Dispute Created',
  STATUS_UPDATED: 'Status Updated',
  EVIDENCE_UPLOADED: 'Evidence Uploaded',
  ESCALATED: 'Dispute Escalated',
  RESOLVED: 'Dispute Resolved',
};
