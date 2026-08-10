"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reminderJob = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const notification_service_1 = require("../services/notification.service");
// Send reminder for all OPEN disputes
const reminderJob = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        // Find disputes that are OPEN and less than 7 days old (7+ days are handled by escalationJob)
        const disputesToRemind = await prisma_1.default.dispute.findMany({
            where: {
                status: 'OPEN',
                createdAt: {
                    gte: sevenDaysAgo,
                },
            },
        });
        for (const dispute of disputesToRemind) {
            await notification_service_1.notificationService.createNotification(dispute.merchantId, 'reminder', `Reminder: ${dispute.id}`, 'Upload supporting evidence before the 7-day deadline expires.');
            console.log(`[Job] Sent reminder for dispute ${dispute.id}`);
        }
    }
    catch (error) {
        console.error('[Job] Error in reminderJob:', error);
    }
};
exports.reminderJob = reminderJob;
