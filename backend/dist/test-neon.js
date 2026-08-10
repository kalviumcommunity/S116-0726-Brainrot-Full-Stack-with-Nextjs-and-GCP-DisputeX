"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverless_1 = require("@neondatabase/serverless");
const adapter_neon_1 = require("@prisma/adapter-neon");
const ws_1 = __importDefault(require("ws"));
const client_1 = require("@prisma/client");
serverless_1.neonConfig.webSocketConstructor = ws_1.default;
const connectionString = "postgresql://neondb_owner:npg_oJ1UVqkmb6nu@ep-lively-bonus-ax0hei4s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const pool = new serverless_1.Pool({ connectionString });
// @ts-ignore
const adapter = new adapter_neon_1.PrismaNeon(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    try {
        const res = await prisma.$queryRaw `SELECT 1`;
        console.log('Success!', res);
    }
    catch (e) {
        console.error('Error:', e);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
