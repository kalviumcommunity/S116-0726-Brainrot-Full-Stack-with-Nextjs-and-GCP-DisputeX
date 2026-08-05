import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../interfaces/error.interface';
import { logger } from '../utils/logger';

/**
 * Global error handling middleware.
 * Must be registered LAST in app.ts (after all routes).
 * Handles: AppError, ZodError, Prisma errors, and unknown errors.
 */
export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // ── Zod validation errors ────────────────────────────────────────────────────
  if (err instanceof ZodError) {
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.issues.map((e: any) => ({
        field: Array.isArray(e.path) ? e.path.join('.') : String(e.path),
        message: e.message,
      })),
    });
    return;
  }

  // ── Known operational errors (thrown via new AppError(...)) ─────────────────
  if (err instanceof AppError && err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
    return;
  }

  // ── Prisma errors ────────────────────────────────────────────────────────────
  if ((err as any).code === 'P2025') {
    // Record not found
    res.status(404).json({ status: 'error', message: 'Resource not found.' });
    return;
  }
  if ((err as any).code === 'P2002') {
    // Unique constraint violation
    res.status(409).json({ status: 'error', message: 'A record with this value already exists.' });
    return;
  }

  // ── Unknown / unexpected errors ──────────────────────────────────────────────
  logger.error(`Unhandled error on ${req.method} ${req.originalUrl}`, err);

  res.status(500).json({
    status: 'error',
    message: 'An unexpected internal error occurred.',
  });
};
