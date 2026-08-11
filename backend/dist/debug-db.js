"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
async function checkDb() {
    const users = await prisma_1.default.user.findMany();
    console.log('USERS:', users.map((u) => ({ id: u.id, email: u.email, role: u.role })));
    const merchants = await prisma_1.default.merchant.findMany();
    console.log('MERCHANTS:', merchants.map((m) => ({ id: m.id, contactEmail: m.contactEmail })));
    const disputes = await prisma_1.default.dispute.findMany();
    console.log(`Total Disputes: ${disputes.length}`);
    const notifications = await prisma_1.default.notification.findMany();
    console.log(`Total Notifications: ${notifications.length}`);
}
checkDb().catch(console.error).finally(() => process.exit(0));
