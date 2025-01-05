import type { AppBskyGraphGetFollows } from "@atproto/api"

import {
  StepActors, 
  type StepActor, 
  type StepActorOutput 
} from "../trotsky"

/**
 * Type representing the output of the followings retrieved by {@link StepActorFollowings}.
 */
type StepActorFollowingsOutput = AppBskyGraphGetFollows.OutputSchema["follows"]

/**
 * Type representing the query parameters for retrieving followings.
 */
type StepActorFollowingsQueryParams = AppBskyGraphGetFollows.QueryParams

/**
 * Type representing the cursor for paginated queries.
 */
type StepActorFollowingsQueryParamsCursor = StepActorFollowingsQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's followings using the Bluesky API.
 * Supports paginated retrieval of followings.
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorFollowingsOutput}.
 * @public
 */
export class StepActorFollowings<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorFollowingsOutput = StepActorFollowingsOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve followings and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetFollows.Response>("follows", (cursor) => {
      return this.agent.app.bsky.graph.getFollows(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving followings, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving followings.
   * @throws Error if no context is found.
   */
  queryParams (cursor: StepActorFollowingsQueryParamsCursor): StepActorFollowingsQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorFollowings")
    }
  
    return { "actor": this.context.did, cursor }
  }
}
