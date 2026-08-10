"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllowedTransitions = exports.needsReminder = exports.isOverdue = void 0;
const constants_1 = require("../utils/constants");
const date_utils_1 = require("../utils/date.utils");
/** Returns true if a dispute is past the escalation threshold */
const isOverdue = (dispute) => dispute.status === 'OPEN' &&
    (0, date_utils_1.daysSince)(dispute.createdAt) >= constants_1.BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS;
exports.isOverdue = isOverdue;
/** Returns true if a dispute is approaching the escalation threshold */
const needsReminder = (dispute) => dispute.status === 'OPEN' &&
    (0, date_utils_1.daysSince)(dispute.createdAt) >= constants_1.BACKEND_CONSTANTS.REMINDER_THRESHOLD_DAYS &&
    (0, date_utils_1.daysSince)(dispute.createdAt) < constants_1.BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS;
exports.needsReminder = needsReminder;
/** Returns the next valid status transitions for a given status */
const getAllowedTransitions = (status) => {
    const transitions = {
        OPEN: ['UNDER_REVIEW', 'ESCALATED'],
        UNDER_REVIEW: ['WON', 'LOST', 'ESCALATED'],
        ESCALATED: ['WON', 'LOST'],
        WON: [],
        LOST: [],
    };
    return transitions[status] ?? [];
};
exports.getAllowedTransitions = getAllowedTransitions;
