import type { AppBskyFeedSearchPosts, AtpAgent } from "@atproto/api"

import { StepPosts } from "../trotsky"

/**
 * Represents the output of a search posts step, consisting of an array of posts.
 * @public
 */
export type StepSearchPostsOutput = AppBskyFeedSearchPosts.OutputSchema["posts"]

/**
 * Represents the query parameters for searching posts.
 * @public
 */
export type StepSearchPostsQueryParams = AppBskyFeedSearchPosts.QueryParams

/**
 * Represents the cursor for paginating through search post results.
 * @public
 */
export type StepSearchPostsQueryParamsCursor = StepSearchPostsQueryParams["cursor"] | undefined

/**
 * A step for searching posts on Bluesky, with support for pagination.
 * 
 * @typeParam P - The parent type of this step.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepSearchPostsOutput}.
 * @public
 */
export class StepSearchPosts<P, C = null, O extends StepSearchPostsOutput = StepSearchPostsOutput> extends StepPosts<P, C, O> {

  /**
   * The initial query parameters for the search.
   */
  _queryParams: StepSearchPostsQueryParams

  /**
   * Initializes the StepSearchPosts instance with the given agent, parent, and query parameters.
   * 
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param queryParams - The initial query parameters for the search.
   */
  constructor (agent: AtpAgent, parent: P, queryParams: StepSearchPostsQueryParams) {
    super(agent, parent)
    this._queryParams = queryParams
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @param rest - Additional parameters to pass to the cloned step. This is useful for child class overriding the clone.
   * @returns A new {@link StepActor} instance.
   */
  override clone (...rest: unknown[]) {
    const step = super.clone(...rest)
    step._queryParams = this._queryParams
    return step
  }

  /**
   * Applies the pagination logic to retrieve posts based on the search parameters.
   * Results are stored in the `output` property.
   * 
   * @override
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedSearchPosts.Response>("posts", (cursor) => {
      return this
        .agent
        .app.bsky.feed
        .searchPosts(this.queryParams(cursor))
    })
  }

  /**
   * Constructs the query parameters for the current pagination step.
   * 
   * @param cursor - The cursor indicating the current position in the paginated results.
   * @returns The query parameters for the search.
   */
  queryParams (cursor: StepSearchPostsQueryParamsCursor): StepSearchPostsQueryParams {
    return { ...this._queryParams, cursor }
  }
}
