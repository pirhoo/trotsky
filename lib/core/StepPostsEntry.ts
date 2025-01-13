import type { StepPosts, StepPostsOutput } from "../trotsky"
import { PostMixins } from "./mixins/PostMixins"

/**
 * Represents an individual entry step within a {@link StepPosts} list.
 * Extends {@link PostMixins} to include common post-related operations.
 * 
 * @typeParam P - The parent type of this step, defaulting to {@link StepPosts}.
 * @typeParam C - The context type, defaulting to {@link StepPostsOutput}.
 * @typeParam O - The output type, defaulting to `unknown`.
 * @public
 */
export class StepPostsEntry<P = StepPosts, C extends StepPostsOutput = StepPostsOutput, O = unknown> extends PostMixins<P, C, O> {
  
  /**
   * Applies the step's logic but do nothing by default. This method is 
   * usually be overridden by child classes but will not throw an error if not.
   * @override
   */
  async apply (): Promise<void> { }
}
