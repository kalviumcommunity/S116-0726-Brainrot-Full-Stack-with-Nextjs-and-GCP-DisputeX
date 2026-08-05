import { Response } from 'express';

interface SuccessOptions {
  message?: string;
  data?: unknown;
  meta?: unknown; // pagination, counts, etc.
}

interface ErrorOptions {
  message: string;
  errors?: unknown;
  code?: string;
}

export const sendSuccess = (
  res: Response,
  statusCode: number,
  options: SuccessOptions = {}
): Response => {
  const { message = 'Success', data, meta } = options;
  return res.status(statusCode).json({
    status: 'success',
    message,
    ...(data !== undefined && { data }),
    ...(meta !== undefined && { meta }),
  });
};

export const sendError = (
  res: Response,
  statusCode: number,
  options: ErrorOptions
): Response => {
  const { message, errors, code } = options;
  return res.status(statusCode).json({
    status: 'error',
    message,
    ...(code && { code }),
    ...(errors !== undefined && { errors }),
  });
};

export const sendPaginated = (
  res: Response,
  data: unknown[],
  page: number,
  limit: number,
  total: number
): Response => {
  return res.status(200).json({
    status: 'success',
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
};
