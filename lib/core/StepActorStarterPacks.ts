import type { AppBskyGraphGetActorStarterPacks } from "@atproto/api"

import { StepStarterPacks, type StepStarterPacksOutput } from "./StepStarterPacks"
import type { StepActor } from "./StepActor"
import type { StepActorOutput } from "./StepActor"

/**
 * Type representing the output of the starter packs retrieved by {@link StepActorStarterPacks}.
 * @public
 */
export type StepActorStarterPacksOutput = StepStarterPacksOutput

/**
 * Type representing the query parameters for retrieving actor starter packs.
 * @public
 */
export type StepActorStarterPacksQueryParams = AppBskyGraphGetActorStarterPacks.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorStarterPacksQueryParamsCursor = StepActorStarterPacksQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving an actor's starter packs using the Bluesky API.
 * Supports paginated retrieval of starter packs.
 *
 * @typeParam P - Type of the parent step, extending {@link StepActor}.
 * @typeParam C - Type of the context object, extending {@link StepActorOutput}.
 * @typeParam O - Type of the output object, extending {@link StepActorStarterPacksOutput}.
 *
 * @example
 * Get an actor's starter packs:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("alice.bsky.social")
 *   .starterPacks()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Pack: ${step.context.uri}`)
 *     console.log(`Creator: @${step.context.creator.handle}`)
 *     console.log(`Members: ${step.context.listItemCount || 0}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow members from an actor's popular starter packs:
 * ```ts
 * await Trotsky.init(agent)
 *   .actor("bob.bsky.social")
 *   .starterPacks()
 *   .each()
 *   .when((step) => (step?.context?.joinedAllTimeCount || 0) > 50)
 *   .tap((step) => {
 *     console.log(`Popular pack: ${step.context.uri}`)
 *   })
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorStarterPacks<P = StepActor, C extends StepActorOutput = StepActorOutput, O extends StepActorStarterPacksOutput = StepActorStarterPacksOutput> extends StepStarterPacks<P, C, O> {

  /**
   * Applies pagination to retrieve starter packs and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyGraphGetActorStarterPacks.Response>("starterPacks", (cursor) => {
      return this.agent.app.bsky.graph.getActorStarterPacks(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving starter packs, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving starter packs.
   * @throws
   * Error if no context is found.
   */
  queryParams (cursor: StepActorStarterPacksQueryParamsCursor): StepActorStarterPacksQueryParams {
    if (!this.context) {
      throw new Error("No context found for StepActorStarterPacks")
    }

    return { "actor": this.context.did, cursor }
  }
}
