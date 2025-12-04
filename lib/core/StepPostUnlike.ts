import type { AppBskyFeedDefs } from "@atproto/api"

import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a step for unliking a specific post.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to `null`.
 *
 * @example
 * Unlike a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .unlike()
 *   .run()
 * ```
 *
 * @example
 * Unlike posts from search results:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .when((step) => step?.context?.viewer?.like)
 *   .unlike()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostUnlike<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step logic to unlike the post provided in the context.
   * Only unlikes if the user has previously liked the post.
   *
   * @override
   * @throws Error if the context does not provide the required post data.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepPostUnlike")
    }

    // PostView from the API includes viewer state
    const context = this.context as unknown as AppBskyFeedDefs.PostView
    const likeUri = context.viewer?.like
    if (likeUri) {
      await this.agent.deleteLike(likeUri)
    }
  }
}
