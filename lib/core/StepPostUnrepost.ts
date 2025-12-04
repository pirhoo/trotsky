import type { AppBskyFeedDefs } from "@atproto/api"

import { Step, type StepPost, type StepPostOutput } from "../trotsky"

/**
 * Represents a step for unreposting (removing repost) a specific post.
 *
 * @typeParam P - The parent type of this step, defaulting to {@link StepPost}.
 * @typeParam C - The context type, defaulting to {@link StepPostOutput}.
 * @typeParam O - The output type, defaulting to `null`.
 *
 * @example
 * Unrepost a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.post/3l6oveex3ii2l")
 *   .unrepost()
 *   .run()
 * ```
 *
 * @example
 * Unrepost posts from search results:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchPosts({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .when((step) => step?.context?.viewer?.repost)
 *   .unrepost()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostUnrepost<P = StepPost, C extends StepPostOutput = StepPostOutput, O = null> extends Step<P, C, O> {

  /**
   * Applies the step logic to unrepost the post provided in the context.
   * Only unreposts if the user has previously reposted the post.
   *
   * @override
   * @throws Error if the context does not provide the required post data.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepPostUnrepost")
    }

    // PostView from the API includes viewer state
    const context = this.context as unknown as AppBskyFeedDefs.PostView
    const repostUri = context.viewer?.repost
    if (repostUri) {
      await this.agent.deleteRepost(repostUri)
    }
  }
}
