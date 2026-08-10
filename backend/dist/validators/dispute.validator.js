"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listDisputesSchema = exports.getDisputeByIdSchema = exports.updateDisputeStatusSchema = exports.createDisputeSchema = void 0;
const zod_1 = require("zod");
exports.createDisputeSchema = zod_1.z.object({
    body: zod_1.z.object({
        merchantId: zod_1.z.string().uuid({ message: 'merchantId must be a valid UUID' }),
        amount: zod_1.z
            .number({ message: 'amount must be a positive number' })
            .positive({ message: 'amount must be greater than 0' }),
        currency: zod_1.z
            .string()
            .length(3, { message: 'currency must be a 3-letter ISO code (e.g. USD)' })
            .toUpperCase()
            .optional()
            .default('USD'),
        reason: zod_1.z
            .string()
            .min(10, { message: 'reason must be at least 10 characters' })
            .max(1000, { message: 'reason must be at most 1000 characters' }),
    }),
});
exports.updateDisputeStatusSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
    }),
    body: zod_1.z.object({
        status: zod_1.z.enum(['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'], {
            message: 'status must be one of: OPEN, UNDER_REVIEW, WON, LOST, ESCALATED',
        }),
    }),
});
exports.getDisputeByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().uuid({ message: 'Dispute ID must be a valid UUID' }),
    }),
});
exports.listDisputesSchema = zod_1.z.object({
    query: zod_1.z.object({
        merchantId: zod_1.z.string().uuid().optional(),
        status: zod_1.z
            .enum(['OPEN', 'UNDER_REVIEW', 'WON', 'LOST', 'ESCALATED'])
            .optional(),
        page: zod_1.z.string().regex(/^\d+$/).optional(),
        limit: zod_1.z.string().regex(/^\d+$/).optional(),
    }),
});
