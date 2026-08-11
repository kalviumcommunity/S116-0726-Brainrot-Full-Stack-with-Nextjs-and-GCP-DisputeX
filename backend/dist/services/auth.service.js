"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const error_interface_1 = require("../interfaces/error.interface");
const prisma_1 = __importDefault(require("../utils/prisma"));
const env_config_1 = require("../config/env.config");
const constants_1 = require("../utils/constants");
const user_model_1 = require("../models/user.model");
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ userId, role }, env_config_1.envConfig.jwtSecret, { expiresIn: constants_1.BACKEND_CONSTANTS.JWT_EXPIRES_IN });
};
exports.authService = {
    async register(email, password, role) {
        const existing = await user_repository_1.userRepository.findByEmail(email);
        if (existing) {
            throw new error_interface_1.AppError('A user with this email already exists.', 409, 'USER_EXISTS');
        }
        const hashed = await bcryptjs_1.default.hash(password, constants_1.BACKEND_CONSTANTS.BCRYPT_SALT_ROUNDS);
        const user = await user_repository_1.userRepository.create({ email, password: hashed, role });
        if (role === 'MERCHANT') {
            const merchant = await prisma_1.default.merchant.create({
                data: {
                    name: email.split('@')[0],
                    businessId: `MCH-${Date.now().toString().slice(-6)}`,
                    contactEmail: email,
                }
            });
            const dispute = await prisma_1.default.dispute.create({
                data: {
                    merchantId: merchant.id,
                    amount: 50.00,
                    currency: 'USD',
                    reason: 'Welcome to DisputeX! Please upload your first dummy evidence.',
                    status: 'OPEN',
                }
            });
            await prisma_1.default.activity.create({
                data: {
                    disputeId: dispute.id,
                    action: 'MERCHANT_REGISTERED',
                    description: 'Merchant registered successfully and default dispute initialized.'
                }
            });
        }
        const token = generateToken(user.id, user.role);
        return { token, user: (0, user_model_1.toPublicUser)(user) };
    },
    async login(email, password, role) {
        const user = await user_repository_1.userRepository.findByEmail(email);
        if (!user) {
            throw new error_interface_1.AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            throw new error_interface_1.AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
        }
        if (role && user.role !== role) {
            throw new error_interface_1.AppError(`Access denied. This account does not have ${role.toLowerCase()} privileges.`, 403, 'INVALID_ROLE_FOR_PORTAL');
        }
        const token = generateToken(user.id, user.role);
        return { token, user: (0, user_model_1.toPublicUser)(user) };
    },
    async getProfile(userId) {
        const user = await user_repository_1.userRepository.findById(userId);
        if (!user) {
            throw new error_interface_1.AppError('User not found.', 404, 'USER_NOT_FOUND');
        }
        return user;
    },
};
