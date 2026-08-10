"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disputeRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.disputeRepository = {
    async create(data) {
        return prisma_1.default.dispute.create({ data });
    },
    async findById(id) {
        return prisma_1.default.dispute.findUnique({
            where: { id },
            include: { merchant: true, activities: { orderBy: { createdAt: 'desc' } } },
        });
    },
    async findMany(filters = {}, pagination = {}) {
        const where = {};
        if (filters.merchantId)
            where.merchantId = filters.merchantId;
        if (filters.status)
            where.status = filters.status;
        return prisma_1.default.dispute.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: { merchant: true },
            skip: pagination.skip,
            take: pagination.take,
        });
    },
    async count(filters = {}) {
        const where = {};
        if (filters.merchantId)
            where.merchantId = filters.merchantId;
        if (filters.status)
            where.status = filters.status;
        return prisma_1.default.dispute.count({ where });
    },
    async updateStatus(id, status) {
        return prisma_1.default.dispute.update({ where: { id }, data: { status: status } });
    },
    async updateEvidenceUrl(id, evidenceUrl) {
        return prisma_1.default.dispute.update({ where: { id }, data: { evidenceUrl } });
    },
    async countByStatus() {
        return prisma_1.default.dispute.groupBy({
            by: ['status'],
            _count: { _all: true },
        });
    },
};
