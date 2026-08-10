"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.evidenceController = void 0;
const evidence_service_1 = require("../services/evidence.service");
const response_1 = require("../utils/response");
exports.evidenceController = {
    async uploadEvidence(req, res, next) {
        try {
            const disputeId = req.params['id'];
            const file = req.file;
            if (!file) {
                return res.status(400).json({ status: 'error', message: 'No file uploaded.' });
            }
            const url = await evidence_service_1.evidenceService.uploadEvidence(disputeId, file);
            return (0, response_1.sendSuccess)(res, 200, {
                message: 'Evidence uploaded successfully.',
                data: { evidenceUrl: url },
            });
        }
        catch (error) {
            return next(error);
        }
    },
    async getEvidence(req, res, next) {
        try {
            const disputeId = req.params['id'];
            const url = await evidence_service_1.evidenceService.getEvidenceUrl(disputeId);
            return (0, response_1.sendSuccess)(res, 200, {
                data: { evidenceUrl: url, hasEvidence: !!url },
            });
        }
        catch (error) {
            return next(error);
        }
    },
};
