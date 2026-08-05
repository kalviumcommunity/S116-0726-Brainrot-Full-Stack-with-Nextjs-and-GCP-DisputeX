import { DisputeModel } from '../types/model.types';
import { AppDisputeStatus } from '../types/app.types';
import { BACKEND_CONSTANTS } from '../utils/constants';
import { daysSince } from '../utils/date.utils';

export type { DisputeModel };

/** Returns true if a dispute is past the escalation threshold */
export const isOverdue = (dispute: DisputeModel): boolean =>
  dispute.status === 'OPEN' &&
  daysSince(dispute.createdAt) >= BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS;

/** Returns true if a dispute is approaching the escalation threshold */
export const needsReminder = (dispute: DisputeModel): boolean =>
  dispute.status === 'OPEN' &&
  daysSince(dispute.createdAt) >= BACKEND_CONSTANTS.REMINDER_THRESHOLD_DAYS &&
  daysSince(dispute.createdAt) < BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS;

/** Returns the next valid status transitions for a given status */
export const getAllowedTransitions = (status: AppDisputeStatus): AppDisputeStatus[] => {
  const transitions: Record<AppDisputeStatus, AppDisputeStatus[]> = {
    OPEN: ['UNDER_REVIEW', 'ESCALATED'],
    UNDER_REVIEW: ['WON', 'LOST', 'ESCALATED'],
    ESCALATED: ['WON', 'LOST'],
    WON: [],
    LOST: [],
  };
  return transitions[status] ?? [];
};
