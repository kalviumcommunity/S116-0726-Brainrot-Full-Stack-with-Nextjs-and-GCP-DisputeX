"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
async function test() {
    try {
        await prisma_1.default.dispute.count({ where: { status: 'ESCALATED' } });
        console.log('count ESCALATED ok');
    }
    catch (e) {
        console.error('Error count:', e);
    }
    try {
        await prisma_1.default.activity.findMany({ take: 10, include: { dispute: { select: { id: true, reason: true, merchant: { select: { name: true } } } } } });
        console.log('activity findMany ok');
    }
    catch (e) {
        console.error('Error activity:', e);
    }
}
test();
