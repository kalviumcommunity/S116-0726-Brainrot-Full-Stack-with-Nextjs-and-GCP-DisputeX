/** Standard success API response */
export interface ApiSuccessResponse<T = unknown> {
  status: 'success';
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

/** Pagination metadata attached to list responses */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
