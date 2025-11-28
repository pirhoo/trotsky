/**
 * Type definitions for pagination-related operations.
 * @module types/pagination
 */

/**
 * Standard pagination parameters used across AT Protocol APIs.
 *
 * @public
 */
export interface PaginationParams {
  /** Maximum number of items to return per page */
  limit?: number
  /** Cursor for pagination (opaque string from previous response) */
  cursor?: string
}

/**
 * Standard paginated response structure.
 *
 * @typeParam T - The type of items in the paginated response
 * @public
 */
export interface PaginatedResponse<T> {
  /** Array of items for this page */
  items: T[]
  /** Cursor for fetching the next page (undefined if no more pages) */
  cursor?: string
}

/**
 * Query parameters with pagination support.
 *
 * @typeParam T - Additional query parameters specific to the endpoint
 * @public
 */
export type PaginatedQueryParams<T = Record<string, unknown>> = T & PaginationParams
