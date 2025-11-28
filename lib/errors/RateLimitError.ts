/**
 * Error class for rate limiting failures.
 *
 * Thrown when API rate limits are exceeded or when rate limiting
 * is enforced by Trotsky's internal rate limiter.
 *
 * @example
 * ```ts
 * throw new RateLimitError(
 *   "Rate limit exceeded. Retry after 60 seconds",
 *   "RATE_LIMIT_EXCEEDED",
 *   "StepSearchPosts",
 *   60
 * )
 * ```
 *
 * @public
 */

import { TrotskyError } from "./TrotskyError"

export class RateLimitError extends TrotskyError {

  /**
   * Number of seconds until rate limit resets (if known).
   */
  public readonly retryAfter?: number

  /**
   * Creates a new RateLimitError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param step - Optional step name where error occurred
   * @param retryAfter - Optional seconds until retry is allowed
   * @param cause - Optional underlying error
   */
  constructor (
    message: string,
    code: string = "RATE_LIMIT_ERROR",
    step?: string,
    retryAfter?: number,
    cause?: Error
  ) {
    super(message, code, step, cause)
    this.name = "RateLimitError"
    this.retryAfter = retryAfter
  }

  /**
   * Returns a JSON representation including retry information.
   *
   * @returns Object containing error details with retry info
   */
  override toJSON () {
    return {
      ...super.toJSON(),
      "retryAfter": this.retryAfter
    }
  }
}

/**
 * Common rate limit error codes.
 *
 * @public
 */
export const RateLimitErrorCode = {

  /** API rate limit exceeded */
  "RATE_LIMIT_EXCEEDED": "RATE_LIMIT_EXCEEDED",

  /** Too many requests */
  "TOO_MANY_REQUESTS": "TOO_MANY_REQUESTS",

  /** Daily quota exceeded */
  "QUOTA_EXCEEDED": "QUOTA_EXCEEDED",

  /** Concurrent request limit exceeded */
  "CONCURRENT_LIMIT": "CONCURRENT_LIMIT"
} as const
