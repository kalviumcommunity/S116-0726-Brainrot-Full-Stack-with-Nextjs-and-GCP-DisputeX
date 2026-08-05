/** Custom application error with HTTP status code support */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/** Error detail item used in Zod validation errors */
export interface ValidationErrorItem {
  field: string;
  message: string;
}

/** Shape of an API error response body */
export interface ApiErrorResponse {
  status: 'error';
  message: string;
  code?: string;
  errors?: ValidationErrorItem[];
}
