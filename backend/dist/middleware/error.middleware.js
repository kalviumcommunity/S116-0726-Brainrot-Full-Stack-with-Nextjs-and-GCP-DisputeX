"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const zod_1 = require("zod");
const error_interface_1 = require("../interfaces/error.interface");
const logger_1 = require("../utils/logger");
/**
 * Global error handling middleware.
 * Must be registered LAST in app.ts (after all routes).
 * Handles: AppError, ZodError, Prisma errors, and unknown errors.
 */
const errorMiddleware = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
_next) => {
    // ── Zod validation errors ────────────────────────────────────────────────────
    if (err instanceof zod_1.ZodError) {
        res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: err.issues.map((e) => ({
                field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
                message: e.message,
            })),
        });
        return;
    }
    // ── Known operational errors (thrown via new AppError(...)) ─────────────────
    if (err instanceof error_interface_1.AppError && err.isOperational) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            code: err.code,
        });
        return;
    }
    // ── Prisma errors ────────────────────────────────────────────────────────────
    if (err.code === 'P2025') {
        // Record not found
        res.status(404).json({ status: 'error', message: 'Resource not found.' });
        return;
    }
    if (err.code === 'P2002') {
        // Unique constraint violation
        res.status(409).json({ status: 'error', message: 'A record with this value already exists.' });
        return;
    }
    // ── Unknown / unexpected errors ──────────────────────────────────────────────
    logger_1.logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, err);
    res.status(500).json({
        status: 'error',
        message: 'An unexpected internal error occurred.',
    });
};
exports.errorMiddleware = errorMiddleware;
