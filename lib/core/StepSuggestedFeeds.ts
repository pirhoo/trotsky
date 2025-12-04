import type { AppBskyFeedGetSuggestedFeeds, AppBskyFeedDefs } from "@atproto/api"

import { StepBuilderList, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the suggested feeds retrieved by {@link StepSuggestedFeeds}.
 * @public
 */
export type StepSuggestedFeedsOutput = AppBskyFeedDefs.GeneratorView[]

/**
 * Type representing the query parameters for retrieving suggested feeds.
 * @public
 */
export type StepSuggestedFeedsQueryParams = AppBskyFeedGetSuggestedFeeds.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepSuggestedFeedsQueryParamsCursor = StepSuggestedFeedsQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving suggested custom feeds using the Bluesky API.
 * Supports paginated retrieval of feed suggestions.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepSuggestedFeedsOutput}.
 *
 * @example
 * Get and iterate through suggested feeds:
 * ```ts
 * await Trotsky.init(agent)
 *   .suggestedFeeds()
 *   .take(10)
 *   .tap((step) => {
 *     step.output.forEach((feed) => {
 *       console.log(`Feed: ${feed.displayName} - ${feed.description}`)
 *     })
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepSuggestedFeeds<P = Trotsky, C = null, O extends StepSuggestedFeedsOutput = StepSuggestedFeedsOutput> extends StepBuilderList<P, C, O> {

  /**
   * Applies pagination to retrieve suggested feeds and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedGetSuggestedFeeds.Response>("feeds", (cursor) => {
      return this.agent.app.bsky.feed.getSuggestedFeeds(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving suggested feeds, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving suggested feeds.
   */
  private queryParams (cursor: StepSuggestedFeedsQueryParamsCursor): StepSuggestedFeedsQueryParams {
    return { cursor }
  }
}
