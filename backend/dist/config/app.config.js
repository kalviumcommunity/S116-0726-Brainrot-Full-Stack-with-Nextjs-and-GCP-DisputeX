"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = void 0;
const constants_1 = require("../utils/constants");
const env_config_1 = require("./env.config");
exports.appConfig = {
    port: env_config_1.envConfig.port,
    env: env_config_1.envConfig.nodeEnv,
    isProduction: env_config_1.envConfig.isProduction,
    isDevelopment: env_config_1.envConfig.isDevelopment,
    // CORS — allow all in dev; restrict in prod
    corsOrigins: env_config_1.envConfig.isProduction
        ? [process.env.FRONTEND_URL || 'http://localhost:3000']
        : '*',
    // Pagination
    defaultPageSize: constants_1.BACKEND_CONSTANTS.DEFAULT_PAGE_SIZE,
    maxPageSize: constants_1.BACKEND_CONSTANTS.MAX_PAGE_SIZE,
    // JWT
    jwtSecret: env_config_1.envConfig.jwtSecret,
    jwtExpiresIn: env_config_1.envConfig.jwtExpiresIn,
    // Upload
    maxFileSizeBytes: constants_1.BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES,
    allowedMimeTypes: constants_1.BACKEND_CONSTANTS.ALLOWED_MIME_TYPES,
    // Business logic
    escalationThresholdDays: constants_1.BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS,
    reminderThresholdDays: constants_1.BACKEND_CONSTANTS.REMINDER_THRESHOLD_DAYS,
};
