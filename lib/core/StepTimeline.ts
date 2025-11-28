import type { AppBskyFeedGetTimeline, AppBskyFeedDefs, AtpAgent } from "@atproto/api"

import { StepPosts, type StepPostsOutput } from "./StepPosts"

/**
 * Type representing the output of the timeline retrieved by {@link StepTimeline}.
 * @public
 */
export type StepTimelineOutput = StepPostsOutput

/**
 * Type representing the query parameters for retrieving the timeline.
 * @public
 */
export type StepTimelineQueryParams = AppBskyFeedGetTimeline.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepTimelineQueryParamsCursor = StepTimelineQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving the authenticated user's timeline using the Bluesky API.
 * Supports paginated retrieval of posts from followed accounts.
 *
 * @typeParam P - Type of the parent step.
 * @typeParam C - Type of the context object, defaulting to `null`.
 * @typeParam O - Type of the output object, extending {@link StepTimelineOutput}.
 *
 * @example
 * Get recent posts from your timeline:
 * ```ts
 * await Trotsky.init(agent)
 *   .timeline()
 *   .take(20)
 *   .each()
 *   .tap((step) => {
 *     console.log(`@${step.context.author.handle}: ${step.context.record.text}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Like posts from your timeline with specific criteria:
 * ```ts
 * await Trotsky.init(agent)
 *   .timeline()
 *   .take(50)
 *   .each()
 *   .when((step) => step?.context?.record?.text?.includes("#typescript"))
 *   .like()
 *   .wait(1000)
 *   .run()
 * ```
 *
 * @example
 * Use a custom algorithm for timeline:
 * ```ts
 * await Trotsky.init(agent)
 *   .timeline({ algorithm: "reverse-chronological" })
 *   .take(10)
 *   .each()
 *   .run()
 * ```
 *
 * @public
 */
export class StepTimeline<P, C = null, O extends StepTimelineOutput = StepTimelineOutput> extends StepPosts<P, C, O> {

  /**
   * Query parameters for the timeline request.
   */
  _queryParams: StepTimelineQueryParams

  /**
   * Initializes the StepTimeline instance with the given agent, parent, and optional query parameters.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param queryParams - Optional query parameters for the timeline (e.g., algorithm).
   */
  constructor (agent: AtpAgent, parent: P, queryParams: StepTimelineQueryParams = {}) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @returns A new {@link StepTimeline} instance.
   */
  override clone () {
    return super.clone(this._queryParams)
  }

  /**
   * Applies pagination to retrieve timeline posts and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    const feed = await this.paginate<AppBskyFeedDefs.FeedViewPost[], AppBskyFeedGetTimeline.Response>("feed", (cursor) => {
      return this.agent.app.bsky.feed.getTimeline(this.queryParams(cursor))
    })

    this.output = feed.map((post: AppBskyFeedDefs.FeedViewPost) => post.post) as O
  }

  /**
   * Generates query parameters for retrieving the timeline, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving the timeline.
   */
  queryParams (cursor: StepTimelineQueryParamsCursor): StepTimelineQueryParams {
    return { ...this._queryParams, cursor }
  }
}
