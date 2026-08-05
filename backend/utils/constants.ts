export const BACKEND_CONSTANTS = {
  /** JWT token expiry duration */
  JWT_EXPIRES_IN: '1d',
  /** Bcrypt salt rounds */
  BCRYPT_SALT_ROUNDS: 10,
  /** Default pagination page size */
  DEFAULT_PAGE_SIZE: 20,
  /** Maximum pagination page size */
  MAX_PAGE_SIZE: 100,
  /** Max evidence file size in bytes (5 MB) */
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,
  /** Allowed MIME types for evidence upload */
  ALLOWED_MIME_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  /** Number of days before a dispute auto-escalates */
  ESCALATION_THRESHOLD_DAYS: 7,
  /** Number of days before escalation when a reminder is sent */
  REMINDER_THRESHOLD_DAYS: 5,
  /** GCP default bucket name */
  GCP_DEFAULT_BUCKET: 'disputex-evidence-bucket',
} as const;
