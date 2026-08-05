import { envConfig } from './env.config';

export const databaseConfig = {
  url: envConfig.databaseUrl,
  /** Prisma log levels to enable based on env */
  logLevels: envConfig.isDevelopment
    ? (['query', 'info', 'warn', 'error'] as const)
    : (['warn', 'error'] as const),
};
