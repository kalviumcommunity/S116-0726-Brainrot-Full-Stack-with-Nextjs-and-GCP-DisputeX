"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceService = void 0;
const evidence_repository_1 = require("../repositories/evidence.repository");
const dispute_repository_1 = require("../repositories/dispute.repository");
const activity_service_1 = require("./activity.service");
const storage_service_1 = require("../storage/storage.service");
const evidence_validator_1 = require("../validators/evidence.validator");
const error_interface_1 = require("../interfaces/error.interface");
exports.evidenceService = {
    /**
     * Uploads a file to GCP Storage and stores the URL on the Dispute record.
     * Returns the updated evidence URL.
     */
    async uploadEvidence(disputeId, file) {
        // 1. Validate file (MIME type + size)
        const fileError = (0, evidence_validator_1.validateEvidenceFile)(file);
        if (fileError) {
            throw new error_interface_1.AppError(fileError, 400, 'INVALID_FILE');
        }
        // 2. Verify dispute exists and check for existing evidence
        const dispute = await dispute_repository_1.disputeRepository.findById(disputeId);
        if (!dispute) {
            throw new error_interface_1.AppError('Dispute not found.', 404, 'DISPUTE_NOT_FOUND');
        }
        if (dispute.evidenceUrl) {
            throw new error_interface_1.AppError('Evidence has already been uploaded for this dispute and cannot be altered.', 403, 'EVIDENCE_ALREADY_EXISTS');
        }
        // 3. Build a deterministic file path
        const safeFileName = file.originalname.replace(/\s+/g, '_');
        const filePath = `disputes/${disputeId}/evidence_${Date.now()}_${safeFileName}`;
        // 4. Upload to GCP (or mock if unconfigured)
        const url = await storage_service_1.storageService.uploadFile(file.buffer, filePath, file.mimetype);
        // 5. Persist the URL on the dispute and update status to UNDER_REVIEW
        await require('../utils/prisma').default.dispute.update({
            where: { id: disputeId },
            data: { evidenceUrl: url, status: 'UNDER_REVIEW' }
        });
        // 6. Log the activity
        await activity_service_1.activityService.createActivity(disputeId, 'EVIDENCE_UPLOADED', `Evidence file "${file.originalname}" uploaded successfully.`);
        return url;
    },
    /** Returns the current evidence URL for a dispute, or null */
    async getEvidenceUrl(disputeId) {
        return evidence_repository_1.evidenceRepository.getEvidenceUrl(disputeId);
    },
    /** Returns true if evidence has been submitted for a dispute */
    async hasEvidence(disputeId) {
        return evidence_repository_1.evidenceRepository.hasEvidence(disputeId);
    },
};
