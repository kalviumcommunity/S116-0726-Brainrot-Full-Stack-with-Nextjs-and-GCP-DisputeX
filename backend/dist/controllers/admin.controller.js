"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalSearchAdmin = exports.getAuditLogsAdmin = exports.getAllDisputesAdmin = exports.getAllMerchantsAdmin = exports.getAdminStats = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
const request_interface_1 = require("../interfaces/request.interface");
const getAdminStats = async (req, res, next) => {
    try {
        const [totalDisputes, openDisputes, underReviewDisputes, escalatedDisputes, wonDisputes, lostDisputes, totalMerchants, recentDisputes, recentActivities,] = await Promise.all([
            prisma_1.default.dispute.count(),
            prisma_1.default.dispute.count({ where: { status: 'OPEN' } }),
            prisma_1.default.dispute.count({ where: { status: 'UNDER_REVIEW' } }),
            prisma_1.default.dispute.count({ where: { status: 'ESCALATED' } }),
            prisma_1.default.dispute.count({ where: { status: 'WON' } }),
            prisma_1.default.dispute.count({ where: { status: 'LOST' } }),
            prisma_1.default.merchant.count(),
            prisma_1.default.dispute.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { merchant: true },
            }),
            prisma_1.default.activity.findMany({
                take: 10,
                orderBy: { createdAt: 'desc' },
                include: { dispute: { select: { id: true, reason: true, merchant: { select: { name: true } } } } },
            }),
        ]);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        const recentDisputesForChart = await prisma_1.default.dispute.findMany({
            where: { createdAt: { gte: sevenDaysAgo } },
            select: { createdAt: true }
        });
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const casesByDay = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            casesByDay.push({
                name: days[d.getDay()],
                cases: 0
            });
        }
        recentDisputesForChart.forEach((d) => {
            const dayName = days[d.createdAt.getDay()];
            const entry = casesByDay.find(c => c.name === dayName);
            if (entry)
                entry.cases++;
        });
        return (0, response_1.sendSuccess)(res, 200, {
            data: {
                stats: {
                    disputes: {
                        total: totalDisputes,
                        open: openDisputes,
                        underReview: underReviewDisputes,
                        escalated: escalatedDisputes,
                        won: wonDisputes,
                        lost: lostDisputes,
                    },
                    merchants: {
                        total: totalMerchants,
                    },
                },
                recentDisputes,
                recentActivities,
                casesByDay,
            },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAdminStats = getAdminStats;
const getAllMerchantsAdmin = async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, request_interface_1.parsePagination)(req.query);
        const [merchants, total] = await Promise.all([
            prisma_1.default.merchant.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { _count: { select: { disputes: true } } },
            }),
            prisma_1.default.merchant.count(),
        ]);
        return res.status(200).json({
            status: 'success',
            data: merchants,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAllMerchantsAdmin = getAllMerchantsAdmin;
const getAllDisputesAdmin = async (req, res, next) => {
    try {
        const { status, merchantId } = req.query;
        const { page, limit, skip } = (0, request_interface_1.parsePagination)(req.query);
        const where = {};
        if (status)
            where.status = status;
        if (merchantId)
            where.merchantId = merchantId;
        const [disputes, total] = await Promise.all([
            prisma_1.default.dispute.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { merchant: true },
            }),
            prisma_1.default.dispute.count({ where }),
        ]);
        return res.status(200).json({
            status: 'success',
            data: disputes,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAllDisputesAdmin = getAllDisputesAdmin;
const getAuditLogsAdmin = async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, request_interface_1.parsePagination)(req.query);
        const [logs, total] = await Promise.all([
            prisma_1.default.activity.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.activity.count(),
        ]);
        const formattedLogs = logs.map((log) => ({
            id: log.id,
            action: log.action,
            entityType: 'Dispute',
            entityId: log.disputeId,
            details: { description: log.description },
            createdAt: log.createdAt,
        }));
        return res.status(200).json({
            status: 'success',
            data: formattedLogs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getAuditLogsAdmin = getAuditLogsAdmin;
const globalSearchAdmin = async (req, res, next) => {
    try {
        const q = (req.query.q || '').trim();
        if (!q) {
            return res.status(200).json({
                status: 'success',
                data: { disputes: [], merchants: [], activities: [], notifications: [] }
            });
        }
        const ALL_STATUSES = ['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'];
        const statusMatches = ALL_STATUSES.filter(s => s.toLowerCase().includes(q.toLowerCase()));
        const [disputes, merchants, activities, notifications] = await Promise.all([
            prisma_1.default.dispute.findMany({
                where: {
                    OR: [
                        { id: { contains: q, mode: 'insensitive' } },
                        { reason: { contains: q, mode: 'insensitive' } },
                        { merchant: { name: { contains: q, mode: 'insensitive' } } },
                        { merchant: { contactEmail: { contains: q, mode: 'insensitive' } } },
                        ...(statusMatches.length > 0 ? [{ status: { in: statusMatches } }] : [])
                    ]
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    merchant: { select: { id: true, name: true, contactEmail: true } }
                }
            }),
            prisma_1.default.merchant.findMany({
                where: {
                    OR: [
                        { name: { contains: q, mode: 'insensitive' } },
                        { contactEmail: { contains: q, mode: 'insensitive' } },
                        { businessId: { contains: q, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                orderBy: { createdAt: 'desc' }
            }),
            prisma_1.default.activity.findMany({
                where: {
                    OR: [
                        { action: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    dispute: { select: { id: true, reason: true } }
                }
            }),
            prisma_1.default.notification.findMany({
                where: {
                    OR: [
                        { title: { contains: q, mode: 'insensitive' } },
                        { description: { contains: q, mode: 'insensitive' } },
                        { type: { contains: q, mode: 'insensitive' } }
                    ]
                },
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    merchant: { select: { name: true } }
                }
            })
        ]);
        return res.status(200).json({
            status: 'success',
            data: {
                disputes,
                merchants,
                activities,
                notifications
            }
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.globalSearchAdmin = globalSearchAdmin;
