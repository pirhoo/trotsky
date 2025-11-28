/**
 * Error class for authentication and authorization failures.
 *
 * Thrown when authentication is required but missing, invalid,
 * or when the user lacks permission for an operation.
 *
 * @example
 * ```ts
 * throw new AuthenticationError(
 *   "Authentication required for this operation",
 *   "AUTH_REQUIRED",
 *   "StepActorFollow"
 * )
 * ```
 *
 * @public
 */

import { TrotskyError } from "./TrotskyError"

export class AuthenticationError extends TrotskyError {

  /**
   * Creates a new AuthenticationError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param step - Optional step name where error occurred
   * @param cause - Optional underlying error
   */
  constructor (
    message: string,
    code: string = "AUTH_ERROR",
    step?: string,
    cause?: Error
  ) {
    super(message, code, step, cause)
    this.name = "AuthenticationError"
  }
}

/**
 * Common authentication error codes.
 *
 * @public
 */
export const AuthenticationErrorCode = {

  /** Authentication is required but not provided */
  "AUTH_REQUIRED": "AUTH_REQUIRED",

  /** Provided credentials are invalid */
  "INVALID_CREDENTIALS": "INVALID_CREDENTIALS",

  /** Session has expired */
  "SESSION_EXPIRED": "SESSION_EXPIRED",

  /** User lacks permission for this operation */
  "FORBIDDEN": "FORBIDDEN",

  /** Agent is not authenticated */
  "NOT_AUTHENTICATED": "NOT_AUTHENTICATED"
} as const
