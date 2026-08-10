"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggingMiddleware = void 0;
const logger_1 = require("../utils/logger");
/**
 * HTTP request/response logging middleware.
 * Logs method, path, status code, and response time in ms.
 */
const loggingMiddleware = (req, res, next) => {
    const start = Date.now();
    // Hook into the 'finish' event so we log after the response is sent
    res.on('finish', () => {
        const durationMs = Date.now() - start;
        logger_1.logger.request(req, res, durationMs);
    });
    next();
};
exports.loggingMiddleware = loggingMiddleware;
