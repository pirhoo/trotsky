import type { StepPosts, StepPostsOutput } from "../trotsky"
import { PostMixins } from "./mixins/PostMixins"

/**
 * Represents an individual entry step within a {@link StepPosts} list.
 * Extends {@link PostMixins} to include common post-related operations.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepPosts}.
 * @typeParam C - The context type, defaulting to {@link StepPostsOutput}.
 * @typeParam O - The output type, defaulting to `null`.
 * @public
 */
export class StepPostsEntry<P = StepPosts, C extends StepPostsOutput = StepPostsOutput, O = null> extends PostMixins<P, C, O> {

  /**
   * Applies the logic for the step. This base implementation sets the output to `null`.
   * 
   * @override
   * @returns A promise that resolves when the step is applied.
   */
  async apply (): Promise<void> {
    this.output = null
  }
}
