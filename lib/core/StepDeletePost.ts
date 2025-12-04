import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a step for deleting a specific post.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to `null`.
 *
 * @example
 * Delete a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .delete()
 *   .run()
 * ```
 *
 * @example
 * Delete posts matching criteria:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("myhandle.bsky.social")
 *   .posts()
 *   .take(10)
 *   .each()
 *   .when((step) => step?.context?.record?.text?.includes("#delete"))
 *   .delete()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepDeletePost<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step logic to delete the post provided in the context.
   *
   * @override
   * @throws Error if the context does not provide the required post data.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepDeletePost")
    }

    const { uri } = this.context
    await this.agent.deletePost(uri)
  }
}
