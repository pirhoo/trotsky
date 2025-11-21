import type { AtpAgent, AppBskyActorGetProfile } from "@atproto/api"

import type { Resolvable } from "./utils/resolvable"
import type { StepBuilder, Step } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"
import { resolveValue } from "./utils/resolvable"

/**
 * Type for the parameter passed to the {@link StepActor} class.
 * Represents the identifier of an actor (e.g., handle or DID).
 * @public
 */
export type StepActorParam = string

/**
 * Type for the output of the {@link StepActor} class.
 * Matches the schema of the actor profile from the Bluesky API.
 * @public
 */
export type StepActorOutput = AppBskyActorGetProfile.OutputSchema

/**
 * Represents a step for retrieving and handling an actor's profile using the Bluesky API.
 *
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepActorOutput}.
 *
 * @example
 * Get an actor's profile:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("bsky.app")
 *   .tap((step) => {
 *     console.log(step.context.displayName)
 *     console.log(step.context.followersCount)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow an actor:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("alice.bsky.social")
 *   .follow()
 *   .run()
 * ```
 *
 * @public
 */
export class StepActor<P = StepBuilder, C = null, O extends StepActorOutput = StepActorOutput> extends ActorMixins<P, C, O> {

  /** @internal */
  _param: Resolvable<StepActorParam>

  /**
   * Initializes a new {@link StepActor} instance.
   * @param agent - The {@link AtpAgent} instance for API interactions.
   * @param parent - The parent object associated with this step.
   * @param param - The parameter representing the actor to retrieve, which can be a resolvable value.
   */
  constructor (agent: AtpAgent, parent: P, param: Resolvable<StepActorParam>) {
    super(agent, parent)
    this._param = param
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    return super.clone(this._param, ...rest)
  }

  /**
   * Applies the step by resolving the actor parameter and fetching the actor's profile.
   * Sets the profile data as the output of this step.
   * @returns A promise that resolves when the step is complete.
   */
  async apply () {
    const actor = await resolveValue<StepActorParam>(this as Step<StepBuilder>, this._param)
    const { data } = await this.agent.getProfile({ actor })
    this.output = data as O
  }
}
