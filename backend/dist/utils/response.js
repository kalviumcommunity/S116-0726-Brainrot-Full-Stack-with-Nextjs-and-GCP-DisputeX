"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPaginated = exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode, options = {}) => {
    const { message = 'Success', data, meta } = options;
    return res.status(statusCode).json({
        status: 'success',
        message,
        ...(data !== undefined && { data }),
        ...(meta !== undefined && { meta }),
    });
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, options) => {
    const { message, errors, code } = options;
    return res.status(statusCode).json({
        status: 'error',
        message,
        ...(code && { code }),
        ...(errors !== undefined && { errors }),
    });
};
exports.sendError = sendError;
const sendPaginated = (res, data, page, limit, total) => {
    return res.status(200).json({
        status: 'success',
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};
exports.sendPaginated = sendPaginated;
