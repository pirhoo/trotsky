import type { AppBskyGraphGetFollowers } from "@atproto/api"

import {
  StepActors, 
  type StepActor, 
  type StepActorOutput 
} from "../trotsky"

/**
 * Type representing the output of the followers retrieved by {@link StepActorFollowers}.
 */
type StepActorFollowersOutput = AppBskyGraphGetFollowers.OutputSchema["followers"]

/**
 * Type representing the query parameters for retrieving followers.
 */
type StepActorFollowersQueryParams = AppBskyGraphGetFollowers.QueryParams

/**
 * Type representing the cursor for paginated queries.
 */
type StepActorFollowersQueryParamsCursor = StepActorFollowersQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's followers using the Bluesky API.
 * Supports paginated retrieval of followers.
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorFollowersOutput}.
 * @public
 */
export class StepActorFollowers<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorFollowersOutput = StepActorFollowersOutput> extends StepActors<P, C, O> {  

  /**
   * Applies pagination to retrieve followers and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetFollowers.Response>("followers", (cursor) => {
      return this.agent.app.bsky.graph.getFollowers(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving followers, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving followers.
   * @throws Error if no context is found.
   * @private
   */
  private queryParams (cursor: StepActorFollowersQueryParamsCursor): StepActorFollowersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorFollowers")
    }
  
    return { "actor": this.context.did, cursor }
  }
}
