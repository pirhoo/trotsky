/**
 * Error class for validation failures.
 *
 * Thrown when input validation fails, such as invalid URIs,
 * malformed parameters, or constraint violations.
 *
 * @example
 * ```ts
 * throw new ValidationError(
 *   "Invalid AT URI format",
 *   "INVALID_URI",
 *   "StepPost",
 *   { uri: "invalid://uri" }
 * )
 * ```
 *
 * @public
 */

import { TrotskyError } from "./TrotskyError"

export class ValidationError extends TrotskyError {

  /**
   * Additional validation details (field names, values, etc.).
   */
  public readonly details?: Record<string, unknown>

  /**
   * Creates a new ValidationError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param step - Optional step name where error occurred
   * @param details - Optional validation details
   * @param cause - Optional underlying error
   */
  constructor (
    message: string,
    code: string = "VALIDATION_ERROR",
    step?: string,
    details?: Record<string, unknown>,
    cause?: Error
  ) {
    super(message, code, step, cause)
    this.name = "ValidationError"
    this.details = details
  }

  /**
   * Returns a JSON representation including validation details.
   *
   * @returns Object containing error details with validation info
   */
  override toJSON () {
    return {
      ...super.toJSON(),
      "details": this.details
    }
  }
}

/**
 * Common validation error codes.
 *
 * @public
 */
export const ValidationErrorCode = {

  /** URI is invalid or malformed */
  "INVALID_URI": "INVALID_URI",

  /** Parameter is missing */
  "MISSING_PARAM": "MISSING_PARAM",

  /** Parameter value is invalid */
  "INVALID_PARAM": "INVALID_PARAM",

  /** Parameter type is incorrect */
  "INVALID_TYPE": "INVALID_TYPE",

  /** Parameter value is out of range */
  "OUT_OF_RANGE": "OUT_OF_RANGE",

  /** Required field is missing */
  "REQUIRED_FIELD": "REQUIRED_FIELD"
} as const
