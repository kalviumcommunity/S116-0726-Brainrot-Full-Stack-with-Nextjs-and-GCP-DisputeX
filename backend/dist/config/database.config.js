"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseConfig = void 0;
const env_config_1 = require("./env.config");
exports.databaseConfig = {
    url: env_config_1.envConfig.databaseUrl,
    /** Prisma log levels to enable based on env */
    logLevels: env_config_1.envConfig.isDevelopment
        ? ['query', 'info', 'warn', 'error']
        : ['warn', 'error'],
};
