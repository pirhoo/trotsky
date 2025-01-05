import type { AtpAgent } from "@atproto/api"
import { Step, type StepBuilder } from "../trotsky"
import { Resolvable, resolveValue } from "./utils/resolvable"


export type StepWhenPredicate = boolean

/**
 * Represents a conditional step that evaluates a predicate to determine its outcome.
 *
 * @typeParam P - The type of the parent constraint.
 * @typeParam C - The type of the context.
 * @typeParam O - The type of the output, defaults to `boolean`.
 *
 * @remarks
 * This step evaluates a predicate, which can be a boolean value or a resolvable that
 * resolves to a boolean. The result of the predicate evaluation is stored in the output.
 */
export class StepWhen<P = StepBuilder, C = unknown, O = boolean> extends Step<P, C, O> {
  private _predicate: Resolvable<StepWhenPredicate>

  /**
   * Creates an instance of `StepWhen`.
   *
   * @param agent - The ATP agent used for API interactions.
   * @param parent - The parent step or context.
   * @param predicate - A boolean or a resolvable that resolves to a boolean,
   *                    determining the condition for this step.
   */
  constructor (agent: AtpAgent, parent: P, predicate: Resolvable<StepWhenPredicate>) {
    super(agent, parent)
    this._predicate = predicate
  }

  /**
   * Evaluates the predicate and sets the output to its result.
   */
  async apply (): Promise<void> {
    this.output = (await resolveValue(this, this._predicate)) as O
  }
}
