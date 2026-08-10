"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMerchantById = exports.getMerchants = exports.createMerchant = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const response_1 = require("../utils/response");
const error_interface_1 = require("../interfaces/error.interface");
const request_interface_1 = require("../interfaces/request.interface");
const createMerchant = async (req, res, next) => {
    try {
        const { name, businessId, contactEmail } = req.body;
        const existing = await prisma_1.default.merchant.findUnique({ where: { businessId } });
        if (existing) {
            throw new error_interface_1.AppError('A merchant with this Business ID already exists.', 409, 'MERCHANT_EXISTS');
        }
        const merchant = await prisma_1.default.merchant.create({ data: { name, businessId, contactEmail } });
        return (0, response_1.sendSuccess)(res, 201, { message: 'Merchant created successfully.', data: { merchant } });
    }
    catch (error) {
        return next(error);
    }
};
exports.createMerchant = createMerchant;
const getMerchants = async (req, res, next) => {
    try {
        const { page, limit, skip } = (0, request_interface_1.parsePagination)(req.query);
        const [merchants, total] = await Promise.all([
            prisma_1.default.merchant.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            prisma_1.default.merchant.count(),
        ]);
        return res.status(200).json({
            status: 'success',
            data: merchants,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.getMerchants = getMerchants;
const getMerchantById = async (req, res, next) => {
    try {
        const merchant = await prisma_1.default.merchant.findUnique({
            where: { id: req.params.id },
            include: {
                disputes: { orderBy: { createdAt: 'desc' }, take: 10 },
                _count: { select: { disputes: true, notifications: true } },
            },
        });
        if (!merchant)
            throw new error_interface_1.AppError('Merchant not found.', 404, 'MERCHANT_NOT_FOUND');
        return (0, response_1.sendSuccess)(res, 200, { data: { merchant } });
    }
    catch (error) {
        return next(error);
    }
};
exports.getMerchantById = getMerchantById;
