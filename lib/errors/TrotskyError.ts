/**
 * Base error class for all Trotsky-related errors.
 *
 * This class extends the standard Error class and provides additional
 * context such as error codes, step information, and causal errors.
 *
 * @example
 * ```ts
 * throw new TrotskyError(
 *   "Failed to fetch actor",
 *   "ACTOR_NOT_FOUND",
 *   "StepActor"
 * )
 * ```
 *
 * @public
 */
export class TrotskyError extends Error {
  /**
   * Error code for programmatic handling.
   */
  public readonly code: string

  /**
   * Name of the step where the error occurred (if applicable).
   */
  public readonly step?: string

  /**
   * Original error that caused this error (if applicable).
   */
  public override readonly cause?: Error

  /**
   * Timestamp when the error was created.
   */
  public readonly timestamp: Date

  /**
   * Creates a new TrotskyError.
   *
   * @param message - Human-readable error message
   * @param code - Machine-readable error code
   * @param step - Optional step name where error occurred
   * @param cause - Optional underlying error that caused this error
   */
  constructor (
    message: string,
    code: string,
    step?: string,
    cause?: Error
  ) {
    super(message)
    this.name = "TrotskyError"
    this.code = code
    this.step = step
    this.cause = cause
    this.timestamp = new Date()

    // Maintains proper stack trace for where error was thrown (V8 only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, TrotskyError)
    }
  }

  /**
   * Returns a JSON representation of the error.
   *
   * @returns Object containing error details
   */
  toJSON () {
    return {
      "name": this.name,
      "message": this.message,
      "code": this.code,
      "step": this.step,
      "timestamp": this.timestamp.toISOString(),
      "stack": this.stack,
      "cause": this.cause ? {
        "name": this.cause.name,
        "message": this.cause.message
      } : undefined
    }
  }

  /**
   * Returns a formatted string representation of the error.
   *
   * @returns Formatted error string
   */
  override toString (): string {
    const parts = [
      `${this.name} [${this.code}]: ${this.message}`
    ]

    if (this.step) {
      parts.push(`at step: ${this.step}`)
    }

    if (this.cause) {
      parts.push(`caused by: ${this.cause.message}`)
    }

    return parts.join(" ")
  }
}
