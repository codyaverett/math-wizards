// Common type definitions and utilities

export interface PaginationParams {
  limit: number;
  offset: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface SuccessResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  message?: string;
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// Helper function to create success response
export function successResponse<T>(data: T, message?: string): SuccessResponse<T> {
  return { success: true, data, message };
}

// Helper function to create error response
export function errorResponse(error: string, message?: string): ErrorResponse {
  return { success: false, error, message };
}
