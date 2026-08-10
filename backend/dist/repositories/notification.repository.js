"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRepository = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.notificationRepository = {
    async create(data) {
        return prisma_1.default.notification.create({ data });
    },
    async findByMerchant(merchantId, isRead) {
        const where = { merchantId };
        if (isRead !== undefined)
            where.isRead = isRead;
        return prisma_1.default.notification.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    },
    async markAsRead(id) {
        return prisma_1.default.notification.update({ where: { id }, data: { isRead: true } });
    },
    async markAllAsRead(merchantId) {
        return prisma_1.default.notification.updateMany({
            where: { merchantId, isRead: false },
            data: { isRead: true },
        });
    },
    async countUnread(merchantId) {
        return prisma_1.default.notification.count({ where: { merchantId, isRead: false } });
    },
};
