"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.evidenceRepository = {
    /**
     * Evidence is stored as a single URL on the Dispute model (current schema).
     * This repository abstracts that access so it can be migrated to a
     * separate Evidence model later without touching service/controller code.
     */
    async getEvidenceUrl(disputeId) {
        const dispute = await prisma_1.default.dispute.findUnique({
            where: { id: disputeId },
            select: { evidenceUrl: true },
        });
        return dispute?.evidenceUrl ?? null;
    },
    async setEvidenceUrl(disputeId, url) {
        const updated = await prisma_1.default.dispute.update({
            where: { id: disputeId },
            data: { evidenceUrl: url },
            select: { evidenceUrl: true },
        });
        return updated.evidenceUrl;
    },
    async hasEvidence(disputeId) {
        const url = await this.getEvidenceUrl(disputeId);
        return !!url;
    },
};
