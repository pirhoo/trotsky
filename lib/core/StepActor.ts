import type { AtpAgent, AppBskyActorGetProfile } from "@atproto/api"

import type { Resolvable } from "./utils/resolvable"
import type { ParentConstraint, Step } from "../trotsky"
import { ActorMixins } from "./mixins/ActorMixins"
import { resolveValue } from "./utils/resolvable"

/**
 * Type for the parameter passed to the {@link StepActor} class.
 * Represents the identifier of an actor (e.g., handle or DID).
 */
export type StepActorParam = string

/**
 * Type for the output of the {@link StepActor} class.
 * Matches the schema of the actor profile from the Bluesky API.
 */
export type StepActorOutput = AppBskyActorGetProfile.OutputSchema

/**
 * Represents a step for retrieving and handling an actor's profile using the Bluesky API.
 * @typeParam P - Type of the parent object.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepActorOutput}.
 * @public
 */
export class StepActor<P = ParentConstraint, C = null, O extends StepActorOutput = StepActorOutput> extends ActorMixins<P, C, O> {

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
   * Applies the step by resolving the actor parameter and fetching the actor's profile.
   * Sets the profile data as the output of this step.
   * @returns A promise that resolves when the step is complete.
   */
  async apply () {
    const actor = await resolveValue<StepActorParam>(this as Step<ParentConstraint>, this._param)
    const { data } = await this.agent.getProfile({ actor })
    this.output = data as O
  }
}
