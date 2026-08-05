import { Request } from 'express';
import { AppRole } from '../types/app.types';

/** Authenticated request — user is set by the auth middleware */
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    role: AppRole;
  };
}

/** Paginated query parameters */
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

/** Parses pagination params from a request query, with safe defaults */
export const parsePagination = (
  query: PaginationQuery,
  defaultLimit = 20,
  maxLimit = 100
): { page: number; limit: number; skip: number } => {
  const page = Math.max(1, parseInt(query.page || '1', 10));
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit), 10)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};
