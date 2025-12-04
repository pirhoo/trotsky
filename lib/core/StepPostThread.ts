import type { AppBskyFeedGetPostThread } from "@atproto/api"

import {
  Step,
  type StepPost,
  type StepPostOutput
} from "../trotsky"

/**
 * Type representing the output of the thread retrieved by {@link StepPostThread}.
 * @public
 */
export type StepPostThreadOutput = AppBskyFeedGetPostThread.OutputSchema

/**
 * Type representing the query parameters for retrieving a post thread.
 * @public
 */
export type StepPostThreadQueryParams = AppBskyFeedGetPostThread.QueryParams

/**
 * Represents a step for retrieving a full post thread with replies using the Bluesky API.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object, extending {@link StepPostThreadOutput}.
 *
 * @example
 * Get a post thread with replies:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .thread()
 *   .tap((step) => {
 *     const thread = step.output.thread as AppBskyFeedDefs.ThreadViewPost
 *     console.log(`Thread by: ${thread.post.author.handle}`)
 *     console.log(`Replies: ${thread.replies?.length || 0}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Get a thread with custom depth:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .thread({ depth: 10, parentHeight: 5 })
 *   .tap((step) => {
 *     console.log(step.output)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostThread<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostThreadOutput = StepPostThreadOutput> extends Step<P, C, O> {

  /**
   * Additional query parameters for the thread request (depth, parentHeight).
   */
  _options: Partial<StepPostThreadQueryParams>

  /**
   * Initializes the StepPostThread instance.
   *
   * @param options - Optional parameters for thread retrieval (depth, parentHeight).
   */
  constructor (...args: unknown[]) {
    const [agent, parent, options = {}] = args as [ConstructorParameters<typeof Step>[0], P, Partial<StepPostThreadQueryParams>?]
    super(agent, parent)
    this._options = options
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @returns A new {@link StepPostThread} instance.
   */
  override clone () {
    return super.clone(this._options)
  }

  /**
   * Applies the step logic to retrieve the thread.
   *
   * @throws Error if no context is found.
   */
  async apply () {
    if (!this.context) {
      throw new Error("No context found for StepPostThread")
    }

    const { data } = await this.agent.app.bsky.feed.getPostThread({
      "uri": this.context.uri,
      ...this._options
    })

    this.output = data as O
  }
}
