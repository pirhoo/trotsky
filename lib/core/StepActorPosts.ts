import type { AppBskyFeedGetAuthorFeed, AppBskyFeedDefs } from "@atproto/api"

import {
  StepPosts, 
  type StepPostsOutput, 
  type StepActor,
  type StepActorOutput 
} from "../trotsky"

/**
 * Type representing the output of the posts retrieved by {@link StepActorPosts}.
 * @public
 */
export type StepActorPostsOutput = StepPostsOutput

/**
 * Type representing the query parameters for retrieving actor posts.
 * @public
 */
export type StepActorPostsQueryParams = AppBskyFeedGetAuthorFeed.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorPostsQueryParamsCursor = StepActorPostsQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's posts using the Bluesky API.
 * Supports paginated retrieval of posts.
 *
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorPostsOutput}.
 *
 * @example
 * Get an actor's recent posts:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("bsky.app")
 *   .posts()
 *   .take(10)
 *   .each()
 *   .tap((step) => {
 *     console.log(step.context.record.text)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Like an actor's popular posts:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("alice.bsky.social")
 *   .posts()
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
export class StepActorPosts<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorPostsOutput = StepActorPostsOutput> extends StepPosts<P, C, O> {
  
  /**
   * Applies pagination to retrieve posts and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    const feed = await this.paginate<AppBskyFeedDefs.FeedViewPost[], AppBskyFeedGetAuthorFeed.Response>("feed", (cursor) => {
      return this.agent.app.bsky.feed.getAuthorFeed(this.queryParams(cursor))
    })

    this.output = feed.map((post: AppBskyFeedDefs.FeedViewPost) => post.post) as O
  }

  /**
   * Generates query parameters for retrieving posts, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving posts.
   * @throws
   * Error if no context is found.
   */
  queryParams (cursor: StepActorPostsQueryParamsCursor): StepActorPostsQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorPosts")
    }

    return { "actor": this.context.did, cursor }
  }
}
