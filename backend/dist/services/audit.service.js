"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.auditService = {
    logAction: async (action, entityType, entityId, userId, details) => {
        try {
            await prisma_1.default.auditLog.create({
                data: {
                    action,
                    entityType,
                    entityId,
                    userId,
                    details: details ? JSON.parse(JSON.stringify(details)) : null,
                },
            });
        }
        catch (error) {
            console.error('Failed to write audit log:', error);
        }
    },
    getLogs: async (page = 1, limit = 20) => {
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            prisma_1.default.auditLog.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.auditLog.count(),
        ]);
        return {
            data: logs,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };
    }
};
