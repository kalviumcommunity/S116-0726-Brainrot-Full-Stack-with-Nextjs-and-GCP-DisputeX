"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeController = void 0;
const dispute_service_1 = require("../services/dispute.service");
const activity_service_1 = require("../services/activity.service");
const evidence_service_1 = require("../services/evidence.service");
const dispute_repository_1 = require("../repositories/dispute.repository");
const response_1 = require("../utils/response");
const request_interface_1 = require("../interfaces/request.interface");
const error_interface_1 = require("../interfaces/error.interface");
const VALID_STATUSES = ['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'];
exports.disputeController = {
    async createDispute(req, res, next) {
        try {
            const { merchantId, amount, currency, reason } = req.body;
            const dispute = await dispute_service_1.disputeService.createDispute({
                merchantId,
                amount: parseFloat(amount),
                currency: currency || 'USD',
                reason,
            });
            return (0, response_1.sendSuccess)(res, 201, { message: 'Dispute created successfully.', data: { dispute } });
        }
        catch (error) {
            return next(error);
        }
    },
    async getDisputes(req, res, next) {
        try {
            const merchantId = Array.isArray(req.query.merchantId) ? req.query.merchantId[0] : req.query.merchantId;
            const status = Array.isArray(req.query.status) ? req.query.status[0] : req.query.status;
            const { page, limit, skip } = (0, request_interface_1.parsePagination)(req.query);
            const filters = {};
            if (merchantId)
                filters.merchantId = merchantId;
            if (status && VALID_STATUSES.includes(status)) {
                filters.status = status;
            }
            const [disputes, total] = await Promise.all([
                dispute_repository_1.disputeRepository.findMany(filters, { skip, take: limit }),
                dispute_repository_1.disputeRepository.count(filters),
            ]);
            return (0, response_1.sendPaginated)(res, disputes, page, limit, total);
        }
        catch (error) {
            return next(error);
        }
    },
    async getDisputeById(req, res, next) {
        try {
            const id = req.params.id;
            const dispute = await dispute_repository_1.disputeRepository.findById(id);
            if (!dispute)
                throw new error_interface_1.AppError('Dispute not found.', 404, 'DISPUTE_NOT_FOUND');
            return (0, response_1.sendSuccess)(res, 200, { data: { dispute } });
        }
        catch (error) {
            return next(error);
        }
    },
    async updateDisputeStatus(req, res, next) {
        try {
            const { status } = req.body;
            if (!VALID_STATUSES.includes(status)) {
                throw new error_interface_1.AppError('Invalid status value.', 400, 'INVALID_STATUS');
            }
            const dispute = await dispute_service_1.disputeService.updateDisputeStatus(req.params['id'], status);
            return (0, response_1.sendSuccess)(res, 200, { message: 'Dispute status updated.', data: { dispute } });
        }
        catch (error) {
            return next(error);
        }
    },
    async uploadEvidence(req, res, next) {
        try {
            if (!req.file) {
                throw new error_interface_1.AppError('No file uploaded.', 400, 'NO_FILE');
            }
            const url = await evidence_service_1.evidenceService.uploadEvidence(req.params['id'], req.file);
            return (0, response_1.sendSuccess)(res, 200, { message: 'Evidence uploaded successfully.', data: { evidenceUrl: url } });
        }
        catch (error) {
            return next(error);
        }
    },
    async getDisputeActivities(req, res, next) {
        try {
            const activities = await activity_service_1.activityService.getActivitiesByDispute(req.params['id']);
            return (0, response_1.sendSuccess)(res, 200, { data: { activities } });
        }
        catch (error) {
            return next(error);
        }
    },
};
