import { BACKEND_CONSTANTS } from '../utils/constants';
import { envConfig } from './env.config';

export const appConfig = {
  port: envConfig.port,
  env: envConfig.nodeEnv,
  isProduction: envConfig.isProduction,
  isDevelopment: envConfig.isDevelopment,

  // CORS — allow all in dev; restrict in prod
  corsOrigins: envConfig.isProduction
    ? [process.env.FRONTEND_URL || 'http://localhost:3000']
    : '*',

  // Pagination
  defaultPageSize: BACKEND_CONSTANTS.DEFAULT_PAGE_SIZE,
  maxPageSize: BACKEND_CONSTANTS.MAX_PAGE_SIZE,

  // JWT
  jwtSecret: envConfig.jwtSecret,
  jwtExpiresIn: envConfig.jwtExpiresIn,

  // Upload
  maxFileSizeBytes: BACKEND_CONSTANTS.MAX_FILE_SIZE_BYTES,
  allowedMimeTypes: BACKEND_CONSTANTS.ALLOWED_MIME_TYPES,

  // Business logic
  escalationThresholdDays: BACKEND_CONSTANTS.ESCALATION_THRESHOLD_DAYS,
  reminderThresholdDays: BACKEND_CONSTANTS.REMINDER_THRESHOLD_DAYS,
};
