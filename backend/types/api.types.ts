/** Union of all HTTP methods the API uses */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** Generic paginated list response shape */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/** Parameters to create a dispute via the API */
export interface CreateDisputeInput {
  merchantId: string;
  amount: number;
  currency?: string;
  reason: string;
}

/** Parameters to update dispute status */
export interface UpdateDisputeStatusInput {
  status: string;
}

/** Filter parameters for listing disputes */
export interface DisputeFilters {
  merchantId?: string;
  status?: string;
  page?: number;
  limit?: number;
}

/** Filter parameters for listing notifications */
export interface NotificationFilters {
  merchantId: string;
  isRead?: boolean;
}
