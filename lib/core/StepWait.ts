import type { AtpAgent } from "@atproto/api"

import { Step, type StepBuilder } from "../trotsky"

/**
 * A step that introduces a delay before proceeding to the next step.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to `null`.
 * @public
 */
export class StepWait<P = StepBuilder, C = null, O = null> extends Step<P, C, O> {

  /**
   * The duration of the delay in milliseconds.
   */
  protected _duration: number

  /**
   * Initializes the StepWait instance with the given duration.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param duration - The duration of the delay in milliseconds. Defaults to `0`.
   */
  constructor (agent: AtpAgent, parent: P, duration = 0) {
    super(agent, parent)
    this._duration = duration
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._duration, ...rest)
  }


  /**
   * Applies the step logic to introduce a delay.
   * The process is paused for the duration specified in `_duration`.
   * 
   * @override
   */
  async apply () {
    await new Promise(resolve => setTimeout(resolve, this._duration))
  }
}
