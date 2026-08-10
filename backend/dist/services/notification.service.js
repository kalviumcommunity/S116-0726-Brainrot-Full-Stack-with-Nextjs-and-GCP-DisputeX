"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.notificationService = {
    createNotification: async (merchantId, type, title, description) => {
        return await prisma_1.default.notification.create({
            data: {
                merchantId,
                type,
                title,
                description,
            },
        });
    },
    getNotifications: async (merchantId) => {
        return await prisma_1.default.notification.findMany({
            where: {
                merchantId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },
    markAsRead: async (id) => {
        return await prisma_1.default.notification.update({
            where: { id },
            data: { isRead: true },
        });
    },
};
