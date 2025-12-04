import type { AppBskyGraphGetBlocks } from "@atproto/api"

import { StepActors, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the blocked actors retrieved by {@link StepActorBlocks}.
 * @public
 */
export type StepActorBlocksOutput = AppBskyGraphGetBlocks.OutputSchema["blocks"]

/**
 * Type representing the query parameters for retrieving blocked actors.
 * @public
 */
export type StepActorBlocksQueryParams = AppBskyGraphGetBlocks.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorBlocksQueryParamsCursor = StepActorBlocksQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving the authenticated user's blocked actors using the Bluesky API.
 * Supports paginated retrieval of blocked accounts.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepActorBlocksOutput}.
 *
 * @example
 * Get and iterate through blocked actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .blocks()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Blocked: ${step.context.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Unblock all blocked actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .blocks()
 *   .each()
 *   .unblock()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorBlocks<P = Trotsky, C = null, O extends StepActorBlocksOutput = StepActorBlocksOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve blocked actors and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetBlocks.Response>("blocks", (cursor) => {
      return this.agent.app.bsky.graph.getBlocks(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving blocked actors, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving blocked actors.
   */
  private queryParams (cursor: StepActorBlocksQueryParamsCursor): StepActorBlocksQueryParams {
    return { cursor }
  }
}
