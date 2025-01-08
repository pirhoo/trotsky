import type { AppBskyActorDefs, AtpAgent } from "@atproto/api"

import { StepBuilder, StepActorsEntry, StepBuilderList } from "../trotsky"
import { Resolvable, resolveValue } from "./utils/resolvable"


/**
 * Type for the parameter passed to the {@link StepActors} class.
 * Represents the identifiers of several actors (e.g., handle or DID).
 * Bluesky currently limit this to 25 actors.
 * @public
 */
export type StepActorsParam = string[]

/**
 * Defines the output schema for a list of actors' profiles.
 * @public
 */
export type StepActorsOutput = Partial<AppBskyActorDefs.ProfileView>[]

/**
 * An abstract class that extends {@link StepBuilderList} to handle a list of actor profiles.
 * It defines a collection of steps dealing with actor entries (`StepActorsEntry`), 
 * which can be appended via the `each()` method.
 *
 * @typeParam P - The parent step builder type, defaults to `StepBuilder`.
 * @typeParam C - The context type, defaults to `null`.
 * @typeParam O - The output type, extending {@link StepActorsOutput}, defaults to `StepActorsOutput`.
 * @public
 */
export class StepActors<P = StepBuilder, C = null, O extends StepActorsOutput = StepActorsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Stores the list of appended actor entries.
   * @internal
   */
  _steps: StepActorsEntry<this, null, null>[] = []

  /**
   * The parameter passed to the {@link StepActors} class to retreive the actors
   * @internal 
   */
  _param: Resolvable<StepActorsParam>


  /**
   * Initializes a new {@link StepActors} instance.
   * @param agent - The {@link AtpAgent} instance for API interactions.
   * @param parent - The parent object associated with this step.
   * @param param - The parameter representing the actors to retrieve, which can be a resolvable value.
   */
  constructor (agent: AtpAgent, parent: P, param: Resolvable<StepActorsParam>) {
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
   * Appends a new {@link StepActorsEntry} instance to the step list 
   * and returns the newly created entry.
   *
   * @returns A new step entry configured for actor processing.
   */
  each (): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }

  /**
   * Applies the step by resolving the actor parameter and fetching the actors' profiles.
   * Sets the profile data as the output of this step.
   * @returns A promise that resolves when the step is complete.
   */
  async applyPagination (): Promise<void> {    
    const actors = await resolveValue<StepActorsParam>(this, this._param)
    const { data } = await this.agent.app.bsky.actor.getProfiles({ actors })
    this.output = data.profiles as O 
  }
}
