/**
 * Error class for pagination-related failures.
 *
 * Thrown when pagination operations fail, such as invalid cursors,
 * cursor expiration, or pagination API errors.
 *
 * @example
 * ```ts
 * throw new PaginationError(
 *   "Invalid pagination cursor",
 *   "INVALID_CURSOR",
 *   "StepActorFollowers"
 * )
 * ```
 *
 * @public
 */

import { TrotskyError } from "./TrotskyError"

export class PaginationError extends TrotskyError {

  /**
   * Creates a new PaginationError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param step - Optional step name where error occurred
   * @param cause - Optional underlying error
   */
  constructor (
    message: string,
    code: string = "PAGINATION_ERROR",
    step?: string,
    cause?: Error
  ) {
    super(message, code, step, cause)
    this.name = "PaginationError"
  }
}

/**
 * Common pagination error codes.
 *
 * @public
 */
export const PaginationErrorCode = {

  /** Cursor is invalid or malformed */
  "INVALID_CURSOR": "INVALID_CURSOR",

  /** Cursor has expired */
  "CURSOR_EXPIRED": "CURSOR_EXPIRED",

  /** Failed to fetch next page */
  "FETCH_FAILED": "FETCH_FAILED",

  /** Limit parameter is invalid */
  "INVALID_LIMIT": "INVALID_LIMIT",

  /** No more pages available */
  "NO_MORE_PAGES": "NO_MORE_PAGES"
} as const
