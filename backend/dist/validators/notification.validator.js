"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllNotificationsReadSchema = exports.markNotificationReadSchema = exports.getNotificationsSchema = void 0;
const zod_1 = require("zod");
exports.getNotificationsSchema = zod_1.z.object({
    query: zod_1.z.object({
        merchantId: zod_1.z.string().uuid({ message: 'merchantId must be a valid UUID' }),
        isRead: zod_1.z
            .enum(['true', 'false'])
            .transform((v) => v === 'true')
            .optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
exports.markNotificationReadSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Notification ID must be a valid UUID' }),
    }),
});
exports.markAllNotificationsReadSchema = zod_1.z.object({
    body: zod_1.z.object({
        merchantId: zod_1.z.string().uuid({ message: 'merchantId must be a valid UUID' }),
    }),
});
