"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./utils/prisma"));
async function main() {
    try {
        const users = await prisma_1.default.user.findMany();
        console.log("Success! Users:", users.length);
    }
    catch (e) {
        console.error("Prisma error:", e);
    }
    finally {
        await prisma_1.default.$disconnect();
    }
}
main();
