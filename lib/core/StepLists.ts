import type { AppBskyGraphGetLists } from "@atproto/api"

import { StepBuilderList, StepListsEntry, type StepBuilder } from "../trotsky"

/**
 * Represents the output of a Lists step, consisting of an array of List views.
 * @public
 */
export type StepListsOutput = AppBskyGraphGetLists.OutputSchema["lists"]

/**
 * Abstract class representing a list of Lists to process.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepListsOutput}.
 * @public
 */
export abstract class StepLists<P = StepBuilder, C = null, O extends StepListsOutput = StepListsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Holds the list of steps to be executed for each List entry.
   */
  _steps: StepListsEntry<this>[] = []

  /**
   * Appends a new List entry step to the current list and returns it.
   * 
   * @returns The newly appended {@link StepListsEntry} instance.
   */
  each (): StepListsEntry<this> {
    return this.append(StepListsEntry<this>)
  }
}
