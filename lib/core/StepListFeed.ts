import type { AppBskyFeedGetListFeed, AppBskyFeedDefs } from "@atproto/api"

import { StepPosts, type StepPostsOutput, type StepList, type StepListOutput } from "../trotsky"

/**
 * Type representing the output of the list feed retrieved by {@link StepListFeed}.
 * @public
 */
export type StepListFeedOutput = StepPostsOutput

/**
 * Type representing the query parameters for retrieving a list feed.
 * @public
 */
export type StepListFeedQueryParams = AppBskyFeedGetListFeed.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepListFeedQueryParamsCursor = StepListFeedQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving posts from a list feed using the Bluesky API.
 * Supports paginated retrieval of posts.
 *
 * @typeParam P - Type of the parent step, extending {@link StepList}.
 * @typeParam C - Type of the context object, extending {@link StepListOutput}.
 * @typeParam O - Type of the output object, extending {@link StepListFeedOutput}.
 *
 * @example
 * Get posts from a list feed:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .feed()
 *   .take(20)
 *   .each()
 *   .tap((step) => {
 *     console.log(`@${step.context.author.handle}: ${step.context.record.text}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Like posts from a list feed:
 * ```ts
 * await Trotsky.init(agent)
 *   .list("at://did:plc:example/app.bsky.graph.list/listid")
 *   .feed()
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
export class StepListFeed<P = StepList, C extends StepListOutput = StepListOutput, O extends StepListFeedOutput = StepListFeedOutput> extends StepPosts<P, C, O> {

  /**
   * Applies pagination to retrieve list feed posts and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    const feed = await this.paginate<AppBskyFeedDefs.FeedViewPost[], AppBskyFeedGetListFeed.Response>("feed", (cursor) => {
      return this.agent.app.bsky.feed.getListFeed(this.queryParams(cursor))
    })

    this.output = feed.map((post: AppBskyFeedDefs.FeedViewPost) => post.post) as O
  }

  /**
   * Generates query parameters for retrieving the list feed, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving the list feed.
   * @throws Error if no context is found.
   */
  private queryParams (cursor: StepListFeedQueryParamsCursor): StepListFeedQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepListFeed")
    }

    return { "list": this.context.uri, cursor }
  }
}
