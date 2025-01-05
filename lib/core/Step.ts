import type { AtpAgent } from "@atproto/api"
import { ParentConstraint, Trotsky } from "../trotsky"

/**
 * Represents an abstract step in a sequence managed by the {@link Trotsky} framework.
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object.
 * @public
 */
export abstract class Step<P = ParentConstraint, C = unknown, O = unknown> extends Trotsky<P, C, O> {

  /** @internal */
  _parent: P

  /**
   * Initializes a new {@link Step} instance.
   * @param agent - The {@link AtpAgent} instance for API interactions.
   * @param parent - The parent object that this step is associated with.
   */
  constructor (agent: AtpAgent, parent: P) {
    super(agent, parent)
    this._parent = parent
  }

  /**
   * Abstract method that must be implemented by subclasses to define the behavior of the step.
   * @returns A promise that resolves when the step is applied.
   */
  abstract apply (): Promise<void>

  /**
   * Retrieves the parent object of this step.
   * @returns The parent object.
   */
  back (): P {
    return this._parent
  }
}
