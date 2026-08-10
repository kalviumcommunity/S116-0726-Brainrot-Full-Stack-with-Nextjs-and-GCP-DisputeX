"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const activity_service_1 = require("./activity.service");
exports.disputeService = {
    async createDispute(data) {
        const dispute = await prisma_1.default.dispute.create({
            data,
        });
        await activity_service_1.activityService.createActivity(dispute.id, 'CREATED', `Dispute created for amount ${dispute.currency || 'USD'} ${dispute.amount}. Reason: ${dispute.reason}`);
        return dispute;
    },
    async getDisputeById(id) {
        return prisma_1.default.dispute.findUnique({
            where: { id },
            include: { merchant: true },
        });
    },
    async getAllDisputes(filters) {
        const where = {};
        if (filters?.merchantId)
            where.merchantId = filters.merchantId;
        if (filters?.status)
            where.status = filters.status;
        return prisma_1.default.dispute.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { merchant: true },
        });
    },
    async updateDisputeStatus(id, status) {
        const updated = await prisma_1.default.dispute.update({
            where: { id },
            data: { status: status },
        });
        await activity_service_1.activityService.createActivity(id, 'STATUS_UPDATED', `Dispute status updated to ${status}`);
        return updated;
    },
    async updateDisputeEvidence(id, evidenceUrl) {
        const updated = await prisma_1.default.dispute.update({
            where: { id },
            data: { evidenceUrl },
        });
        await activity_service_1.activityService.createActivity(id, 'EVIDENCE_UPLOADED', `Evidence uploaded via GCP Storage`);
        return updated;
    }
};
