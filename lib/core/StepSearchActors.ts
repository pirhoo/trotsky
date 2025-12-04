import type { AppBskyActorSearchActors, AtpAgent } from "@atproto/api"

import { StepActors } from "../trotsky"

/**
 * Represents the output of a search actors step, consisting of an array of actor profiles.
 * @public
 */
export type StepSearchActorsOutput = AppBskyActorSearchActors.OutputSchema["actors"]

/**
 * Represents the query parameters for searching actors.
 * @public
 */
export type StepSearchActorsQueryParams = AppBskyActorSearchActors.QueryParams

/**
 * Represents the cursor for paginating through search actor results.
 * @public
 */
export type StepSearchActorsQueryParamsCursor = StepSearchActorsQueryParams["cursor"] | undefined

/**
 * Represents a step for searching actors on Bluesky, with support for pagination.
 *
 * @typeParam P - The parent type of this step.
 * @typeParam C - The child context type, defaulting to `null`.
 * @typeParam O - The output type, defaulting to {@link StepSearchActorsOutput}.
 *
 * @example
 * Search for actors and display them:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchActors({ q: "typescript" })
 *   .take(10)
 *   .each()
 *   .tap((step) => {
 *     console.log(step.context.handle)
 *     console.log(`Followers: ${step.context.followersCount}`)
 *   })
 *   .run()
 * ```
 *
 * @example
 * Follow actors matching specific criteria:
 * ```ts
 * await Trotsky.init(agent)
 *   .searchActors({ q: "bluesky" })
 *   .take(20)
 *   .each()
 *   .when((step) => step?.context?.followersCount > 100)
 *   .follow()
 *   .wait(2000)
 *   .run()
 * ```
 *
 * @public
 */
export class StepSearchActors<P, C = null, O extends StepSearchActorsOutput = StepSearchActorsOutput> extends StepActors<P, C, O> {

  /**
   * The initial query parameters for the search.
   */
  _queryParams: StepSearchActorsQueryParams

  /**
   * Initializes the StepSearchActors instance with the given agent, parent, and query parameters.
   *
   * @param agent - The AT protocol agent used for API calls.
   * @param parent - The parent step in the chain.
   * @param queryParams - The initial query parameters for the search.
   */
  constructor (agent: AtpAgent, parent: P, queryParams: StepSearchActorsQueryParams) {
    super(agent, parent, [])
    this._queryParams = queryParams
  }

  /**
   * Clones the current step and returns a new instance with the same parameters.
   * @returns A new {@link StepSearchActors} instance.
   */
  override clone () {
    return super.clone(this._queryParams)
  }

  /**
   * Applies the pagination logic to retrieve actors based on the search parameters.
   * Results are stored in the `output` property.
   *
   * @override
   */
  async applyPagination () {
    this.output = await this.paginate<O, AppBskyActorSearchActors.Response>("actors", (cursor) => {
      return this
        .agent
        .app.bsky.actor
        .searchActors(this.queryParams(cursor))
    })
  }

  /**
   * Constructs the query parameters for the current pagination step.
   *
   * @param cursor - The cursor indicating the current position in the paginated results.
   * @returns The query parameters for the search.
   */
  queryParams (cursor: StepSearchActorsQueryParamsCursor): StepSearchActorsQueryParams {
    return { ...this._queryParams, cursor }
  }
}
