"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const required = (key) => {
    const value = process.env[key];
    if (!value) {
        console.warn(`[Config] WARNING: Environment variable "${key}" is not set.`);
        return '';
    }
    return value;
};
const optional = (key, fallback) => process.env[key] || fallback;
exports.envConfig = {
    nodeEnv: optional('NODE_ENV', 'development'),
    port: parseInt(optional('PORT', '5000'), 10),
    // Database
    databaseUrl: required('DATABASE_URL'),
    // JWT
    jwtSecret: optional('JWT_SECRET', 'supersecret_dev_only'),
    jwtExpiresIn: optional('JWT_EXPIRES_IN', '1d'),
    // GCP
    gcpProjectId: optional('GCP_PROJECT_ID', ''),
    gcpBucketName: optional('GCP_BUCKET_NAME', 'disputex-evidence-bucket'),
    gcpKeyFilename: optional('GCP_KEY_FILENAME', ''),
    gcpClientEmail: optional('GCP_CLIENT_EMAIL', ''),
    gcpPrivateKey: optional('GCP_PRIVATE_KEY', '').replace(/\\n/g, '\n'),
    // Feature flags
    isProduction: optional('NODE_ENV', 'development') === 'production',
    isDevelopment: optional('NODE_ENV', 'development') === 'development',
};
