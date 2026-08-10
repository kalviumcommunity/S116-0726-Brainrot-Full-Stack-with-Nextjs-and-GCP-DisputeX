"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.loginUser = exports.registerUser = void 0;
const auth_service_1 = require("../services/auth.service");
const response_1 = require("../utils/response");
const registerUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const result = await auth_service_1.authService.register(email, password, role);
        return (0, response_1.sendSuccess)(res, 201, {
            message: 'User registered successfully.',
            data: result,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password, role } = req.body;
        const result = await auth_service_1.authService.login(email, password, role);
        return (0, response_1.sendSuccess)(res, 200, {
            message: 'Login successful.',
            data: result,
        });
    }
    catch (error) {
        return next(error);
    }
};
exports.loginUser = loginUser;
const getMe = async (req, res, next) => {
    try {
        const user = await auth_service_1.authService.getProfile(req.user.userId);
        return (0, response_1.sendSuccess)(res, 200, { data: { user } });
    }
    catch (error) {
        return next(error);
    }
};
exports.getMe = getMe;
