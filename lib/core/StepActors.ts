import type { AppBskyActorDefs } from "@atproto/api"

import { StepBuilder, StepActorsEntry, StepBuilderList } from "../trotsky"


/**
 * Defines the output schema for a list of actors' profiles.
 * @typeParam StepActorsOutput - The output schema for actor profiles.
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
export abstract class StepActors<P = StepBuilder, C = null, O extends StepActorsOutput = StepActorsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Stores the list of appended actor entries.
   */
  _steps: StepActorsEntry<this, null, null>[] = []

  /**
   * Appends a new {@link StepActorsEntry} instance to the step list 
   * and returns the newly created entry.
   *
   * @returns A new step entry configured for actor processing.
   */
  each (): StepActorsEntry<this> {
    return this.append(StepActorsEntry<this>)
  }
}
