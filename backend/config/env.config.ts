import dotenv from 'dotenv';
dotenv.config();

const required = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`[Config] WARNING: Environment variable "${key}" is not set.`);
    return '';
  }
  return value;
};

const optional = (key: string, fallback: string): string =>
  process.env[key] || fallback;

export const envConfig = {
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
