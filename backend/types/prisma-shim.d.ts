/**
 * Prisma client shim — provides ambient declarations so TypeScript compiles
 * before `prisma generate` has been run. Once the schema is migrated and
 * `prisma generate` is executed, the generated client will override these.
 */
declare module '@prisma/client' {
  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    user: any;
    merchant: any;
    dispute: any;
    notification: any;
    activity: any;
  }

  export type DisputeStatus = 'OPEN' | 'UNDER_REVIEW' | 'WON' | 'LOST' | 'ESCALATED';
  export type Role = 'ADMIN' | 'MERCHANT';
}
