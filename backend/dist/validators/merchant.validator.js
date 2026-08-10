"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMerchantSchema = void 0;
const zod_1 = require("zod");
exports.createMerchantSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string().min(2),
        businessId: zod_1.z.string().min(2),
        contactEmail: zod_1.z.string().email()
    })
});
