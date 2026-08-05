import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * HTTP request/response logging middleware.
 * Logs method, path, status code, and response time in ms.
 */
export const loggingMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Hook into the 'finish' event so we log after the response is sent
  res.on('finish', () => {
    const durationMs = Date.now() - start;
    logger.request(req, res, durationMs);
  });

  next();
};
