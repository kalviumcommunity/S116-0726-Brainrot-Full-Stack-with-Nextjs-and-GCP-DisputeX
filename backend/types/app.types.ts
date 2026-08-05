/** Application-level roles (mirrors Prisma Role enum) */
export type AppRole = 'ADMIN' | 'MERCHANT';

/** Dispute status values (mirrors Prisma DisputeStatus enum) */
export type AppDisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'WON' | 'LOST' | 'ESCALATED';

/** Notification type strings used throughout the app */
export type NotificationType = 'escalated' | 'reminder' | 'resolved' | 'info';

/** Activity action strings recorded in the audit log */
export type ActivityAction =
  | 'CREATED'
  | 'STATUS_UPDATED'
  | 'EVIDENCE_UPLOADED'
  | 'ESCALATED'
  | 'RESOLVED';

/** JWT payload decoded from a token */
export interface JwtPayload {
  userId: string;
  role: AppRole;
  iat?: number;
  exp?: number;
}

/** Represents a file uploaded through multer */
export interface UploadedFile {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}
