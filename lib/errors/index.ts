/**
 * Central export point for all Trotsky error classes.
 *
 * This module provides custom error classes for different failure scenarios,
 * making it easier to handle and diagnose errors in Trotsky operations.
 *
 * @example
 * ```ts
 * import { PaginationError, ValidationError } from "trotsky/errors"
 *
 * try {
 *   await trotsky.actor("handle").followers().run()
 * } catch (error) {
 *   if (error instanceof PaginationError) {
 *     console.error("Pagination failed:", error.code)
 *   } else if (error instanceof ValidationError) {
 *     console.error("Validation failed:", error.details)
 *   }
 * }
 * ```
 *
 * @module errors
 * @packageDocumentation
 */

// Base error class
export { TrotskyError } from "./TrotskyError"

// Specific error classes
export {
  PaginationError,
  PaginationErrorCode
} from "./PaginationError"

export {
  AuthenticationError,
  AuthenticationErrorCode
} from "./AuthenticationError"

export {
  RateLimitError,
  RateLimitErrorCode
} from "./RateLimitError"

export {
  ValidationError,
  ValidationErrorCode
} from "./ValidationError"

/**
 * Type guard to check if an error is a Trotsky error.
 *
 * @param error - Error to check
 * @returns True if error is a TrotskyError instance
 *
 * @example
 * ```ts
 * if (isTrotskyError(error)) {
 *   console.log(error.code, error.step)
 * }
 * ```
 *
 * @public
 */
export function isTrotskyError (error: unknown): error is import("./TrotskyError").TrotskyError {
  return error instanceof Error && "code" in error && "step" in error
}

/**
 * Helper to create error from AT Protocol XRPCError.
 *
 * @param error - XRPC error from AT Protocol client
 * @param step - Step name where error occurred
 * @returns Appropriate Trotsky error instance
 *
 * @example
 * ```ts
 * try {
 *   await agent.getProfile({ actor: did })
 * } catch (err) {
 *   throw fromXRPCError(err, "StepActor")
 * }
 * ```
 *
 * @public
 */
export function fromXRPCError (error: any, step?: string): import("./TrotskyError").TrotskyError {
  const { TrotskyError } = require("./TrotskyError")
  const { AuthenticationError } = require("./AuthenticationError")
  const { RateLimitError } = require("./RateLimitError")

  // Check for common XRPC error statuses
  if (error.status === 401 || error.status === 403) {
    return new AuthenticationError(
      error.message || "Authentication failed",
      error.status === 401 ? "NOT_AUTHENTICATED" : "FORBIDDEN",
      step,
      error
    )
  }

  if (error.status === 429) {
    const retryAfter = error.headers?.["retry-after"]
      ? parseInt(error.headers["retry-after"], 10)
      : undefined

    return new RateLimitError(
      error.message || "Rate limit exceeded",
      "RATE_LIMIT_EXCEEDED",
      step,
      retryAfter,
      error
    )
  }

  // Default to generic TrotskyError
  return new TrotskyError(
    error.message || "Unknown error",
    error.error || "UNKNOWN_ERROR",
    step,
    error
  )
}
