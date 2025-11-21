import type { AtpAgent } from "@atproto/api"
import { Step, type StepBuilder } from "../trotsky"
import { Resolvable, resolveValue } from "./utils/resolvable"


/**
 * Boolean values resolved by the {@link StepWhen} predicate.
 * @public
 */
export type StepWhenPredicate = boolean

/**
 * Represents a conditional step that evaluates a predicate to determine its outcome.
 *
 * @typeParam P - The type of the parent constraint.
 * @typeParam C - The type of the context.
 * @typeParam O - The type of the output, defaults to `boolean`.
 * @public
 *
 * @remarks
 * This step evaluates a predicate, which can be a boolean value or a resolvable that
 * resolves to a boolean. The result of the predicate evaluation is stored in the output.
 *
 * @example
 * Filter posts by like count:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript" })
 *   .take(20)
 *   .each()
 *   .when((step) => step?.context?.likeCount > 10)
 *   .like()
 *   .run()
 * ```
 *
 * @example
 * Conditional following:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("myhandle.bsky.social")
 *   .followers()
 *   .each()
 *   .when((step) => !step?.context?.viewer?.following)
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
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
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._predicate, ...rest)
  }

  /**
   * Evaluates the predicate and sets the output to its result.
   */
  async apply (): Promise<void> {
    this.output = (await resolveValue(this, this._predicate)) as O
  }
}
