import type { AppBskyFeedGetFeed, AppBskyFeedDefs, AtpAgent } from "@atproto/api"

import { StepPosts, type StepPostsOutput, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the feed retrieved by {@link StepFeed}.
 * @public
 */
export type StepFeedOutput = StepPostsOutput

/**
 * Type representing the URI of a custom feed.
 * @public
 */
export type StepFeedUri = string

/**
 * Type representing the query parameters for retrieving a feed.
 * @public
 */
export type StepFeedQueryParams = AppBskyFeedGetFeed.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepFeedQueryParamsCursor = StepFeedQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving posts from a custom feed using the Bluesky API.
 * Supports paginated retrieval of posts.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object, defaulting to `null`.
 * @typeParam O - Type of the output object, extending {@link StepFeedOutput}.
 *
 * @example
 * Get posts from a custom feed:
 * ```ts
 * await Trotsky.init(agent)
 *   .feed("at://did:plc:z72i7hdynmk6r22z27h6tvur/app.bsky.feed.generator/whats-hot")
 *   .take(20)
 *   .each()
 *   .tap((step) => {
 *     console.log(`@${step.context.author.handle}: ${step.context.record.text}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Like posts from a feed with specific criteria:
 * ```ts
 * await Trotsky.init(agent)
 *   .feed("at://did:plc:example/app.bsky.feed.generator/typescript")
 *   .take(50)
 *   .each()
 *   .when((step) => step?.context?.likeCount > 10)
 *   .like()
 *   .wait(1000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepFeed<P = Trotsky, C = null, O extends StepFeedOutput = StepFeedOutput> extends StepPosts<P, C, O> {

  /**
   * The URI of the custom feed.
   */
  _feedUri: StepFeedUri

  /**
   * Initializes the StepFeed instance with the given agent, parent, and feed URI.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param feedUri - The URI of the custom feed.
   */
  constructor (agent: AtpAgent, parent: P, feedUri: StepFeedUri) {
    super(agent, parent)
    this._feedUri = feedUri
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @returns A new {@link StepFeed} instance.
   */
  override clone () {
    return super.clone(this._feedUri)
  }

  /**
   * Applies pagination to retrieve feed posts and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    const feed = await this.paginate<AppBskyFeedDefs.FeedViewPost[], AppBskyFeedGetFeed.Response>("feed", (cursor) => {
      return this.agent.app.bsky.feed.getFeed(this.queryParams(cursor))
    })

    this.output = feed.map((post: AppBskyFeedDefs.FeedViewPost) => post.post) as O
  }

  /**
   * Generates query parameters for retrieving the feed, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving the feed.
   */
  queryParams (cursor: StepFeedQueryParamsCursor): StepFeedQueryParams {
    return { "feed": this._feedUri, cursor }
  }
}
