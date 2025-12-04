import type { AppBskyGraphGetMutes } from "@atproto/api"

import { StepActors, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the muted actors retrieved by {@link StepActorMutes}.
 * @public
 */
export type StepActorMutesOutput = AppBskyGraphGetMutes.OutputSchema["mutes"]

/**
 * Type representing the query parameters for retrieving muted actors.
 * @public
 */
export type StepActorMutesQueryParams = AppBskyGraphGetMutes.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorMutesQueryParamsCursor = StepActorMutesQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving the authenticated user's muted actors using the Bluesky API.
 * Supports paginated retrieval of muted accounts.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepActorMutesOutput}.
 *
 * @example
 * Get and iterate through muted actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .mutes()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Muted: ${step.context.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Unmute all muted actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .mutes()
 *   .each()
 *   .unmute()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorMutes<P = Trotsky, C = null, O extends StepActorMutesOutput = StepActorMutesOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve muted actors and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetMutes.Response>("mutes", (cursor) => {
      return this.agent.app.bsky.graph.getMutes(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving muted actors, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving muted actors.
   */
  private queryParams (cursor: StepActorMutesQueryParamsCursor): StepActorMutesQueryParams {
    return { cursor }
  }
}
