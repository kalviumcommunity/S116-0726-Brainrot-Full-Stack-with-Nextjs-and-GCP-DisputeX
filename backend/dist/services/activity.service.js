"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityService = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
exports.activityService = {
    createActivity: async (disputeId, action, description) => {
        return await prisma_1.default.activity.create({
            data: {
                disputeId,
                action,
                description,
            },
        });
    },
    getActivitiesByDispute: async (disputeId) => {
        return await prisma_1.default.activity.findMany({
            where: {
                disputeId,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    },
};
