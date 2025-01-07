import type { AtpAgent } from "@atproto/api"
import { Step, type StepBuilder } from "../trotsky"

/**
 * Defines the type for a function that intercepts a {@link Step} instance.
 * The interceptor can be synchronous or asynchronous.
 * @public
 */
export type StepTapInterceptor =
  | ((step: Step) => unknown)
  | ((step: Step) => Promise<unknown>)

/**
 * Represents a step that allows interception of the current {@link Step} instance
 * for custom processing or side effects.
 *
 * @typeParam P - The type of the parent constraint.
 * @typeParam C - The type of the context.
 * @typeParam O - The type of the output, defaults to `null`.
 * @public
 *
 * @remarks
 * The `StepTap` class enables the execution of a provided interceptor function,
 * which receives the current step as its argument. This is useful for debugging,
 * logging, or performing side effects without altering the main flow.
 *
 * @see {@link Step}
 */
export class StepTap<P = StepBuilder, C = unknown, O = null> extends Step<P, C, O> {

  /**
   * The interceptor function to be executed during the apply phase.
   * It receives the current {@link Step} instance and can perform custom operations.
   */
  protected _interceptor: StepTapInterceptor

  /**
   * Creates an instance of `StepTap`.
   *
   * @param agent - The ATP agent used for API interactions.
   * @param parent - The parent step or context.
   * @param interceptor - A function that intercepts the current step for custom processing.
   */
  constructor (agent: AtpAgent, parent: P, interceptor: StepTapInterceptor) {
    super(agent, parent)
    this._interceptor = interceptor
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._interceptor, ...rest)
  }

  /**
   * Executes the interceptor function with the current step as its argument.
   */
  async apply (): Promise<void> {
    await this._interceptor(this as Step)
  }
}
