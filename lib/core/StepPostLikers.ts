import type { AppBskyFeedGetLikes } from "@atproto/api"

import {
  StepActors,
  type StepActorsOutput,
  type StepPost,
  type StepPostOutput
} from "../trotsky"

/**
 * Type representing the output of the likers retrieved by {@link StepPostLikers}.
 * Each entry contains the actor who liked the post.
 * @public
 */
export type StepPostLikersOutput = StepActorsOutput

/**
 * Type representing the query parameters for retrieving post likers.
 * @public
 */
export type StepPostLikersQueryParams = AppBskyFeedGetLikes.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepPostLikersQueryParamsCursor = StepPostLikersQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving actors who liked a post using the Bluesky API.
 * Supports paginated retrieval of likers.
 *
 * @typeParam P - Type of the parent step, extending {@link StepPost}.
 * @typeParam C - Type of the context object, extending {@link StepPostOutput}.
 * @typeParam O - Type of the output object, extending {@link StepPostLikersOutput}.
 *
 * @example
 * Get and iterate through users who liked a post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .likers()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Liked by: ${step.context.actor.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow users who liked a specific post:
 * ```ts
 * await Trotsky.init(agent)
 *   .post("at://did:plc:example/app.bsky.feed.post/postid")
 *   .likers()
 *   .take(10)
 *   .each()
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepPostLikers<P = StepPost, C extends StepPostOutput = StepPostOutput, O extends StepPostLikersOutput = StepPostLikersOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve likers and sets the output.
   * Fetches paginated results using the agent and extracts actor profiles.
   */
  async applyPagination () {
    const likes = await this.paginate<AppBskyFeedGetLikes.Like[], AppBskyFeedGetLikes.Response>("likes", (cursor) => {
      return this.agent.app.bsky.feed.getLikes(this.queryParams(cursor))
    })
    // Extract actor profiles from like objects
    this.output = likes.map((like: AppBskyFeedGetLikes.Like) => like.actor) as O
  }

  /**
   * Generates query parameters for retrieving likers, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving likers.
   * @throws Error if no context is found.
   */
  private queryParams (cursor: StepPostLikersQueryParamsCursor): StepPostLikersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepPostLikers")
    }

    return { "uri": this.context.uri, cursor }
  }
}
