"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.escalationJob = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const notification_service_1 = require("../services/notification.service");
const activity_service_1 = require("../services/activity.service");
// Escalate disputes that have been open for more than 7 days
const escalationJob = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const expiredDisputes = await prisma_1.default.dispute.findMany({
            where: {
                status: 'OPEN',
                createdAt: {
                    lt: sevenDaysAgo,
                },
            },
        });
        for (const dispute of expiredDisputes) {
            // Update status to ESCALATED
            await prisma_1.default.dispute.update({
                where: { id: dispute.id },
                data: { status: 'ESCALATED' },
            });
            // Create activity
            await activity_service_1.activityService.createActivity(dispute.id, 'ESCALATED', 'Dispute was escalated due to lack of response within 7 days.');
            // Create notification
            await notification_service_1.notificationService.createNotification(dispute.merchantId, 'escalated', `Dispute ${dispute.id} escalated`, 'This dispute was escalated because no evidence was submitted before the deadline.');
            console.log(`[Job] Escalated dispute ${dispute.id}`);
        }
    }
    catch (error) {
        console.error('[Job] Error in escalationJob:', error);
    }
};
exports.escalationJob = escalationJob;
