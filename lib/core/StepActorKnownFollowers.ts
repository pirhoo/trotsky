import type { AppBskyGraphGetKnownFollowers } from "@atproto/api"

import {
  StepActors,
  type StepActor,
  type StepActorOutput
} from "../trotsky"

/**
 * Type representing the output of the known followers retrieved by {@link StepActorKnownFollowers}.
 * @public
 */
export type StepActorKnownFollowersOutput = AppBskyGraphGetKnownFollowers.OutputSchema["followers"]

/**
 * Type representing the query parameters for retrieving known followers.
 * @public
 */
export type StepActorKnownFollowersQueryParams = AppBskyGraphGetKnownFollowers.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorKnownFollowersQueryParamsCursor = StepActorKnownFollowersQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's known followers (mutual connections) using the Bluesky API.
 * Supports paginated retrieval of known followers.
 *
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorKnownFollowersOutput}.
 *
 * @example
 * Get and iterate through an actor's known followers:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("bsky.app")
 *   .knownFollowers()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Known follower: ${step.context.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Find mutual connections and follow them:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("friend.bsky.social")
 *   .knownFollowers()
 *   .each()
 *   .when((step) => !step?.context?.viewer?.following)
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorKnownFollowers<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorKnownFollowersOutput = StepActorKnownFollowersOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve known followers and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetKnownFollowers.Response>("followers", (cursor) => {
      return this.agent.app.bsky.graph.getKnownFollowers(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving known followers, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving known followers.
   * @throws
   * Error if no context is found.
   */
  private queryParams (cursor: StepActorKnownFollowersQueryParamsCursor): StepActorKnownFollowersQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorKnownFollowers")
    }

    return { "actor": this.context.did, cursor }
  }
}
