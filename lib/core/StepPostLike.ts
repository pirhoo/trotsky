import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents the output of the `StepPostLike` step, which contains the URI and CID of the liked post.
 * @public
 */
export type StepPostLikeOutput = { "uri": string; "cid": string }

/**
 * Represents a step for liking a specific post.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to {@link StepPostLikeOutput}.
 *
 * @example
 * Like a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .like()
 *   .run()
 * ```
 *
 * @example
 * Like posts from search results:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .when((step) => step?.context?.likeCount > 5)
 *   .like()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostLike<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostLikeOutput = StepPostLikeOutput> extends Step<P, C, O> {

  /**
   * Applies the step logic to like the post provided in the context.
   * The resulting URI and CID of the like operation are stored in the output.
   * 
   * @override
   * @throws Error
   * If the context does not provide the required `uri` and `cid`.
   */
  async apply () {
    const { uri, cid } = this.context as C
    this.output = await this.agent.like(uri, cid) as O
  }
}
