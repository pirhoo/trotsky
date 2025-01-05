import type { AppBskyFeedGetActorLikes } from "@atproto/api"

import {
  StepPosts, 
  type StepPostsOutput, 
  type StepActor, 
  type StepActorOutput 
} from "../trotsky"

/**
 * Type representing the output of the likes retrieved by {@link StepActorLikes}.
 */
type StepActorLikesOutput = StepPostsOutput

/**
 * Type representing the query parameters for retrieving actor likes.
 */
type StepActorLikesQueryParams = AppBskyFeedGetActorLikes.QueryParams

/**
 * Type representing the cursor for paginated queries.
 */
type StepActorLikesQueryParamsCursor = StepActorLikesQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's likes using the Bluesky API.
 * Supports paginated retrieval of likes.
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorLikesOutput}.
 * @public
 */
export class StepActorLikes<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorLikesOutput = StepActorLikesOutput> extends StepPosts<P, C, O> {

  /**
   * Applies pagination to retrieve likes and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyFeedGetActorLikes.Response>("feed", (cursor) => {
      return this.agent.app.bsky.feed.getActorLikes(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving likes, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving likes.
   * @throws Error if no context is found.
   */
  queryParams (cursor: StepActorLikesQueryParamsCursor): StepActorLikesQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorLikes")
    }

    return { "actor": this.context.did, cursor }
  }
}
