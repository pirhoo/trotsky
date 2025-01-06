import type { AppBskyFeedDefs } from "@atproto/api"

import type { StepBuilder } from "../trotsky"
import { StepBuilderList, StepPostsEntry } from "../trotsky"

/**
 * Represents the output of a posts step, consisting of an array of post views.
 * @public
 */
export type StepPostsOutput = AppBskyFeedDefs.PostView[]

/**
 * Abstract class representing a list of posts to process.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepBuilder}.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepPostsOutput}.
 * @public
 */
export abstract class StepPosts<P = StepBuilder, C = null, O extends StepPostsOutput = StepPostsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Holds the list of steps to be executed for each post entry.
   */
  _steps: StepPostsEntry<this>[] = []

  /**
   * Appends a new post entry step to the current list and returns it.
   * 
   * @returns The newly appended {@link StepPostsEntry} instance.
   */
  each (): StepPostsEntry<this> {
    return this.append(StepPostsEntry<this>)
  }
}
