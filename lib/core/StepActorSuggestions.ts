import type { AppBskyActorGetSuggestions } from "@atproto/api"

import { StepActors, type Trotsky } from "../trotsky"

/**
 * Type representing the output of the suggested actors retrieved by {@link StepActorSuggestions}.
 * @public
 */
export type StepActorSuggestionsOutput = AppBskyActorGetSuggestions.OutputSchema["actors"]

/**
 * Type representing the query parameters for retrieving suggested actors.
 * @public
 */
export type StepActorSuggestionsQueryParams = AppBskyActorGetSuggestions.QueryParams

/**
 * Type representing the cursor for paginated queries.
 * @public
 */
export type StepActorSuggestionsQueryParamsCursor = StepActorSuggestionsQueryParams["cursor"] | undefined

/**
 * Represents a step for retrieving suggested actors to follow using the Bluesky API.
 * Supports paginated retrieval of suggestions.
 *
 * @typeParam P - Type of the parent step, extending {@link Trotsky}.
 * @typeParam C - Type of the context object.
 * @typeParam O - Type of the output object, extending {@link StepActorSuggestionsOutput}.
 *
 * @example
 * Get and iterate through suggested actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .suggestions()
 *   .each()
 *   .tap((step) => {
 *     console.log(`Suggested: ${step.context.handle}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow suggested actors:
 * ```ts
 * await Trotsky.init(agent)
 *   .suggestions()
 *   .take(10)
 *   .each()
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepActorSuggestions<P = Trotsky, C = null, O extends StepActorSuggestionsOutput = StepActorSuggestionsOutput> extends StepActors<P, C, O> {

  /**
   * Applies pagination to retrieve suggested actors and sets the output.
   * Fetches paginated results using the agent and appends them to the output.
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyActorGetSuggestions.Response>("actors", (cursor) => {
      return this.agent.app.bsky.actor.getSuggestions(this.queryParams(cursor))
    })
  }

  /**
   * Generates query parameters for retrieving suggested actors, including the optional cursor.
   * @param cursor - The cursor for paginated queries.
   * @returns The query parameters for retrieving suggested actors.
   */
  private queryParams (cursor: StepActorSuggestionsQueryParamsCursor): StepActorSuggestionsQueryParams {
    return { cursor }
  }
}
